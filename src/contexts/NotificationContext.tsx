import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

// API 기본 URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090';

// 로컬스토리지 키 상수
const DISPLAYED_NOTIFICATIONS_KEY = 'brlog_displayed_notifications';
const READ_NOTIFICATIONS_KEY = 'brlog_read_notifications';
// 세션 스토리지 키 추가
const SESSION_PROCESSED_NOTIFICATIONS = 'brlog_session_processed';

// 알림 타입 정의
export enum NotificationType {
    COMMENT = 'COMMENT',
    REPLY = 'REPLY',
    LIKE = 'LIKE',
    SYSTEM = 'SYSTEM'
}

// 알림 인터페이스 정의
export interface Notification {
    id: number;
    userId: string;
    senderUserId: string;
    senderUserNm: string;
    senderProfileImgUrl?: string;
    type: NotificationType;
    content: string;
    postId?: number;
    commentId?: number;
    isRead: boolean;
    createdAt: string;
    uniqueId?: string; // 고유 식별자
}

// 알림 컨텍스트 타입 정의
interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
    markAsRead: (notificationId: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    fetchNotifications: () => Promise<void>;
}

// 기본 컨텍스트 값
const defaultNotificationContext: NotificationContextType = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
    markAsRead: async () => { },
    markAllAsRead: async () => { },
    fetchNotifications: async () => { }
};

// 알림 컨텍스트 생성
const NotificationContext = createContext<NotificationContextType>(defaultNotificationContext);

// 알림 제공자 Props 타입
interface NotificationProviderProps {
    children: ReactNode;
}

// 알림 제공자 컴포넌트
export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [eventSource, setEventSource] = useState<EventSource | null>(null);

    // 표시된 알림 ID 추적 (브라우저 알림 중복 방지용)
    const [displayedNotificationIds, setDisplayedNotificationIds] = useState<number[]>([]);
    // 읽음 상태 추적
    const [readNotificationIds, setReadNotificationIds] = useState<number[]>([]);
    // 처리된 알림 시간 추적 (Map으로 ID별 처리 시간 저장)
    const [processedNotificationsMap, setProcessedNotificationsMap] = useState<Map<number, number>>(new Map());
    // 세션 기반 처리된 알림 ID 추적
    const [sessionProcessedIds, setSessionProcessedIds] = useState<string[]>([]);

    // 디버깅 로그 함수
    const logDebug = (message: string, data?: any) => {
        console.log(`[알림] ${message}`, data || '');
    };

    // 로컬스토리지 및 세션스토리지에서 상태 불러오기
    useEffect(() => {
        if (isAuthenticated) {
            try {
                // 표시된 알림 ID 불러오기
                const storedDisplayedIds = localStorage.getItem(DISPLAYED_NOTIFICATIONS_KEY);
                if (storedDisplayedIds) {
                    const parsedIds = JSON.parse(storedDisplayedIds);
                    setDisplayedNotificationIds(parsedIds);
                    logDebug('로드된 표시 알림 ID:', parsedIds);
                }

                // 읽은 알림 ID 불러오기
                const storedReadIds = localStorage.getItem(READ_NOTIFICATIONS_KEY);
                if (storedReadIds) {
                    const parsedIds = JSON.parse(storedReadIds);
                    setReadNotificationIds(parsedIds);
                    logDebug('로드된 읽음 알림 ID:', parsedIds);
                }

                // 세션 스토리지에서 현재 세션에 처리된 알림 ID 로드
                const sessionProcessed = sessionStorage.getItem(SESSION_PROCESSED_NOTIFICATIONS);
                if (sessionProcessed) {
                    const parsedSessionIds = JSON.parse(sessionProcessed);
                    setSessionProcessedIds(parsedSessionIds);
                    logDebug('세션에서 로드된 처리 알림 ID:', parsedSessionIds);
                }
            } catch (e) {
                console.error('로컬/세션 스토리지 데이터 파싱 오류:', e);
                // 오류 발생 시 스토리지 초기화
                localStorage.removeItem(DISPLAYED_NOTIFICATIONS_KEY);
                localStorage.removeItem(READ_NOTIFICATIONS_KEY);
                sessionStorage.removeItem(SESSION_PROCESSED_NOTIFICATIONS);
            }
        }
    }, [isAuthenticated]);

    // 알림 목록 가져오기
    const fetchNotifications = async (): Promise<void> => {
        if (!isAuthenticated || !user) return;

        setLoading(true);
        logDebug('알림 데이터 가져오기 시작');

        try {
            const response = await axios.get(`${API_URL}/notifications?userId=${user.userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            logDebug('서버 응답:', response.data);

            // 안전하게 데이터 처리
            let notificationsData: Notification[] = [];

            if (response.data && response.data.data) {
                // 응답 데이터가 배열인 경우
                if (Array.isArray(response.data.data)) {
                    // 고유 ID 추가하여 알림 매핑
                    notificationsData = response.data.data.map((notification: Notification) => {
                        // 고유 ID 생성
                        const uniqueId = `${notification.id}-${new Date(notification.createdAt).getTime()}`;

                        // 서버에서 이미 읽음으로 표시되었거나 로컬에 저장된 읽음 상태가 있으면 적용
                        const isRead = notification.isRead || readNotificationIds.includes(notification.id);

                        return {
                            ...notification,
                            uniqueId,
                            isRead
                        };
                    });

                    logDebug('처리된 알림 데이터:', notificationsData);
                } else {
                    console.warn("배열이 아닌 데이터 수신:", response.data.data);
                }
            }

            // 서버에서 빈 배열을 받은 경우의 처리
            if (notificationsData.length === 0) {
                logDebug('서버에서 빈 알림 배열 수신');

                // 상태 업데이트
                setNotifications([]);
                setUnreadCount(0);
            } else {
                // 알림 목록 업데이트
                setNotifications(notificationsData);

                // 읽지 않은 알림 개수 계산
                const unread = notificationsData.filter(n => !n.isRead).length;
                logDebug(`읽지 않은 알림 개수: ${unread}`);
                setUnreadCount(unread);
            }

            setError(null);
        } catch (err) {
            console.error('알림 조회 오류:', err);
            setError('알림을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
            logDebug('알림 데이터 가져오기 완료');
        }
    };

    // 알림을 읽음 상태로 표시
    const markAsRead = async (notificationId: number): Promise<void> => {
        if (!isAuthenticated || !user) return;

        logDebug(`알림 읽음 처리 시작: ${notificationId}`);

        try {
            const token = localStorage.getItem('authToken');

            // 백엔드 API 호출
            await axios.post(
                `${API_URL}/notifications/${notificationId}/read?userId=${user?.userId}&token=${token}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            logDebug(`백엔드 알림 읽음 처리 성공: ${notificationId}`);

            // 로컬에 읽음 상태 저장
            const updatedReadIds = [...readNotificationIds];
            if (!updatedReadIds.includes(notificationId)) {
                updatedReadIds.push(notificationId);
                setReadNotificationIds(updatedReadIds);
                localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify(updatedReadIds));
                logDebug(`로컬 읽음 상태 저장: ${notificationId}`);
            }

            // 알림 목록 업데이트
            setNotifications(prevNotifications => {
                const updated = prevNotifications.map(notification =>
                    notification.id === notificationId
                        ? { ...notification, isRead: true }
                        : notification
                );
                logDebug('업데이트된 알림 목록:', updated);
                return updated;
            });

            // 읽지 않은 알림 개수 업데이트
            setUnreadCount(prevCount => {
                const newCount = Math.max(0, prevCount - 1);
                logDebug(`읽지 않은 알림 개수 업데이트: ${prevCount} -> ${newCount}`);
                return newCount;
            });

        } catch (err) {
            console.error('알림 읽음 처리 오류:', err);
        }
    };

    // 모든 알림을 읽음 상태로 표시
    const markAllAsRead = async (): Promise<void> => {
        if (!isAuthenticated || !user || notifications.length === 0) return;

        logDebug('모든 알림 읽음 처리 시작');

        try {
            // 읽지 않은 알림만 필터링
            const unreadNotifications = notifications.filter(n => !n.isRead);
            logDebug(`읽지 않은 알림 개수: ${unreadNotifications.length}`);

            if (unreadNotifications.length === 0) {
                logDebug('읽지 않은 알림이 없음');
                return;
            }

            // 읽지 않은 모든 알림의 ID 추출
            const unreadIds = unreadNotifications.map(n => n.id);

            // 로컬 읽음 상태에 추가
            const updatedReadIds = [...new Set([...readNotificationIds, ...unreadIds])];
            setReadNotificationIds(updatedReadIds);
            localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify(updatedReadIds));
            logDebug('로컬 읽음 상태 저장:', updatedReadIds);

            // 알림 상태 업데이트
            setNotifications(prevNotifications =>
                prevNotifications.map(notification => ({ ...notification, isRead: true }))
            );

            setUnreadCount(0);
            logDebug('모든 알림 읽음 처리 완료');

        } catch (err) {
            console.error('모든 알림 읽음 처리 오류:', err);
        }
    };

    // 초기 알림 가져오기 및 상태 초기화
    useEffect(() => {
        if (isAuthenticated && user) {
            logDebug('초기 알림 로드 시작');

            // 상태 초기화
            setNotifications([]);
            setUnreadCount(0);

            // 백엔드에서 알림 가져오기
            fetchNotifications()
                .then(() => {
                    logDebug('초기 알림 로드 완료');
                })
                .catch(err => {
                    console.error('초기 알림 로드 실패:', err);
                });
        }
    }, [isAuthenticated, user]);

    // SSE 연결 설정
    useEffect(() => {
        if (isAuthenticated && user) {
            // 이전 EventSource 정리
            if (eventSource) {
                logDebug('기존 SSE 연결 종료');
                eventSource.close();
            }

            logDebug('SSE 연결 시작');

            // 새로운 EventSource 설정
            const token = localStorage.getItem('authToken');
            // EventSource는 헤더를 직접 설정할 수 없어서 URL에 토큰을 포함
            const newEventSource = new EventSource(`${API_URL}/notifications/stream?userId=${user.userId}&token=${token}`);

            newEventSource.onmessage = (event) => {
                try {
                    const rawNotification = JSON.parse(event.data);
                    logDebug('SSE 이벤트 수신:', rawNotification);

                    // 세션 기반 중복 체크 키 생성
                    const notificationId = rawNotification.id;
                    const createdTime = new Date(rawNotification.createdAt).getTime();
                    const sessionKey = `${notificationId}-${createdTime}`;

                    // 세션 기반 중복 체크 (새로고침해도 유지)
                    if (sessionProcessedIds.includes(sessionKey)) {
                        logDebug(`현재 세션에서 이미 처리된 알림 무시: ${sessionKey}`);
                        return;
                    }

                    // 최근 60초 내에 같은 ID의 알림을 처리했는지 확인
                    const now = Date.now();
                    const lastProcessedTime = processedNotificationsMap.get(notificationId);

                    if (lastProcessedTime && (now - lastProcessedTime) < 60000) {
                        // 1분 이내에 처리한 같은 ID의 알림은 무시
                        logDebug(`최근 처리된 동일 알림 무시: ${notificationId}, 경과: ${now - lastProcessedTime}ms`);
                        return;
                    }

                    // 이미 읽은 알림인지 확인
                    if (readNotificationIds.includes(rawNotification.id)) {
                        logDebug(`이미 읽은 알림 무시: ${rawNotification.id}`);
                        return;
                    }

                    // 처리 시간 기록
                    setProcessedNotificationsMap(prev => {
                        const newMap = new Map(prev);
                        newMap.set(notificationId, now);
                        // 맵 크기 제한 (최대 100개)
                        if (newMap.size > 100) {
                            const oldestKey = [...newMap.keys()][0];
                            newMap.delete(oldestKey);
                        }
                        return newMap;
                    });

                    // 세션 처리 목록에 추가
                    const updatedSessionIds = [...sessionProcessedIds, sessionKey];
                    setSessionProcessedIds(updatedSessionIds);
                    sessionStorage.setItem(SESSION_PROCESSED_NOTIFICATIONS, JSON.stringify(updatedSessionIds));

                    // 고유 ID 생성
                    const uniqueId = `${rawNotification.id}-${now}`;
                    const newNotification = {
                        ...rawNotification,
                        uniqueId
                    };

                    // 알림 추가 로직을 함수로 분리하여 상태 업데이트 한 번만 실행
                    const addNotification = () => {
                        setNotifications(prev => {
                            // 이미 같은 ID를 가진 알림이 있는지 확인
                            if (prev.some(n => n.id === newNotification.id)) {
                                logDebug(`중복 알림 무시 (id): ${newNotification.id}`);
                                return prev;
                            }

                            logDebug(`새 알림 추가: ${newNotification.id}`);

                            // 알림 목록에 추가
                            return [newNotification, ...prev];
                        });

                        // 읽지 않은 알림 개수 증가 (별도 상태 업데이트)
                        setUnreadCount(count => {
                            const newCount = count + 1;
                            logDebug(`읽지 않은 알림 개수 증가: ${count} -> ${newCount}`);
                            return newCount;
                        });

                        // 알림이 표시된 적이 없으면 브라우저 알림 표시
                        if (Notification.permission === 'granted') {
                            // 4가지 조건 모두 만족해야 브라우저 알림 표시
                            const shouldShowNotification =
                                // 1. 이미 표시된 적 없는 알림
                                !displayedNotificationIds.includes(newNotification.id) &&
                                // 2. 로컬 세션에서 처리되지 않은 알림 (이미 추가했으므로 검사 필요 없음)
                                // !sessionProcessedIds.includes(sessionKey) &&
                                // 3. 읽지 않은 알림
                                !readNotificationIds.includes(newNotification.id) &&
                                // 4. 1분 이내에 처리되지 않은 알림 (이미 체크했으므로 검사 필요 없음)
                                // (!lastProcessedTime || (now - lastProcessedTime) >= 60000);
                                true;

                            if (shouldShowNotification) {
                                logDebug(`브라우저 알림 표시: ${newNotification.id}`);

                                new Notification('새 알림', {
                                    body: newNotification.content,
                                    icon: '/favicon.ico'
                                });

                                // 표시된 알림 ID 저장
                                const updatedDisplayedIds = [...displayedNotificationIds, newNotification.id];
                                setDisplayedNotificationIds(updatedDisplayedIds);
                                localStorage.setItem(DISPLAYED_NOTIFICATIONS_KEY, JSON.stringify(updatedDisplayedIds));
                                logDebug('업데이트된 표시 알림 ID:', updatedDisplayedIds);
                            } else {
                                logDebug(`브라우저 알림 표시 건너뜀: ${newNotification.id}`);
                            }
                        }
                    };

                    // 한 번만 실행
                    addNotification();

                } catch (error) {
                    console.error('SSE 이벤트 처리 오류:', error);
                }
            };

            newEventSource.onerror = (error) => {
                console.error('SSE 연결 오류:', error);
                newEventSource.close();
                logDebug('SSE 연결 오류로 종료');
            };

            newEventSource.onopen = () => {
                logDebug('SSE 연결 성공');
            };

            setEventSource(newEventSource);

            // 브라우저 알림 권한 요청
            if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
                Notification.requestPermission()
                    .then(result => {
                        logDebug(`알림 권한 요청 결과: ${result}`);
                    });
            }

            return () => {
                logDebug('컴포넌트 언마운트 - SSE 연결 종료');
                newEventSource.close();
            };
        }
    }, [isAuthenticated, user, displayedNotificationIds, readNotificationIds, sessionProcessedIds]);

    const contextValue: NotificationContextType = {
        notifications,
        unreadCount,
        loading,
        error,
        markAsRead,
        markAllAsRead,
        fetchNotifications
    };

    // 디버깅 렌더링 (개발 환경에서만)
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            logDebug(`현재 상태: 알림 ${notifications.length}개, 읽지 않음 ${unreadCount}개`);
        }
    }, [notifications, unreadCount]);

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
        </NotificationContext.Provider>
    );
};

// 알림 훅 내보내기
export const useNotification = (): NotificationContextType => useContext(NotificationContext);

export default NotificationContext;