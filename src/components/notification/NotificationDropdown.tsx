import React, { useRef, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNotification, Notification, NotificationType } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';
import { HiOutlineBell, HiX, HiCheck, HiOutlineExclamation } from 'react-icons/hi';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090';

const NotificationDropdown: React.FC = () => {
    const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotification();
    const { user, isAuthenticated } = useAuth();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 알림 아이콘 선택
    const getNotificationIcon = (type: NotificationType) => {
        switch (type) {
            case NotificationType.COMMENT:
                return <div className="p-2 bg-blue-100 rounded-full text-blue-600"><HiOutlineBell className="w-4 h-4" /></div>;
            case NotificationType.REPLY:
                return <div className="p-2 bg-green-100 rounded-full text-green-600"><HiOutlineBell className="w-4 h-4" /></div>;
            case NotificationType.LIKE:
                return <div className="p-2 bg-red-100 rounded-full text-red-600"><HiOutlineBell className="w-4 h-4" /></div>;
            case NotificationType.SYSTEM:
                return <div className="p-2 bg-yellow-100 rounded-full text-yellow-600"><HiOutlineExclamation className="w-4 h-4" /></div>;
            default:
                return <div className="p-2 bg-gray-100 rounded-full text-gray-600"><HiOutlineBell className="w-4 h-4" /></div>;
        }
    };

    // 알림 클릭 처리
    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.isRead && notification.id) {
            try {
                // 읽음 처리
                markAsRead(notification.id);
            } catch (error) {
                console.error('알림 읽음 처리 오류:', error);
            }
        }
    };

    // 알림 날짜 포맷팅
    const formatNotificationDate = (dateString: string) => {
        try {
            if (!dateString) return '알 수 없는 시간';
            
            //console.log('날짜:', dateString);

            // 배열 형식 날짜 처리 (예: [2025, 4, 24, 0, 29, 20, 823970000])
            if (Array.isArray(dateString) && dateString.length >= 6) {
                const [year, month, day, hour, minute, second] = dateString;
                const dateObj = new Date(year, month-1, day, hour, minute, second);
                return formatDistanceToNow(dateObj, { 
                    addSuffix: true,
                    locale: ko
                });
            }
            
            // 문자열 날짜 처리
            if (typeof dateString === 'string' && dateString.trim() !== '') {
                return formatDistanceToNow(new Date(dateString), { 
                    addSuffix: true,
                    locale: ko
                });
            }
            
            return '최근';
        } catch (error) {
            console.error('날짜 포맷 오류:', error, dateString);
            return '알 수 없는 시간';
        }
    };

    // 알림이 없을 때 표시할 메시지
    const EmptyNotifications = () => (
        <div className="py-6 text-center text-base-content/60">
            <HiOutlineBell className="w-8 h-8 mx-auto mb-2" />
            <p>새로운 알림이 없습니다</p>
        </div>
    );

    // 알림 링크 생성
    const getNotificationLink = (notification: Notification) => {
        if (notification.postId) {
            if (notification.commentId) {
                return `/board/${notification.postId}#comment-${notification.commentId}`;
            }
            return `/board/${notification.postId}`;
        }
        return '#';
    };

    // ESC 키를 누르면 드롭다운 닫기
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                const checkbox = document.getElementById('notification-dropdown') as HTMLInputElement;
                if (checkbox && checkbox.checked) {
                    checkbox.checked = false;
                }
            }
        };

        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, []);

    // 드롭다운 외부 클릭 감지
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                const checkbox = document.getElementById('notification-dropdown') as HTMLInputElement;
                if (checkbox && checkbox.checked) {
                    checkbox.checked = false;
                }
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    return (
        <div className="dropdown dropdown-end" ref={dropdownRef}>
            {/* 알림 아이콘 */}
            <label tabIndex={0} className="btn btn-ghost btn-circle" htmlFor="notification-dropdown">
                <div className="indicator text-yellow-600">
                    <HiOutlineBell className="w-6 h-6" />
                    {unreadCount > 0 && (
                        <span className="badge badge-sm badge-primary indicator-item">{unreadCount}</span>
                    )}
                </div>
            </label>
            
            {/* 드롭다운 메뉴 (체크박스 해킹으로 토글) */}
            <input type="checkbox" id="notification-dropdown" className="hidden" />
            <div tabIndex={0} className="mt-3 z-50 card card-compact dropdown-content w-80 bg-base-100 shadow-lg right-0 max-h-96 overflow-y-auto border border-base-300">
                {/* 헤더 */}
                <div className="card-body p-0">
                    <div className="flex justify-between items-center p-4 border-b border-base-300 text-base-content">
                        <h3 className="text-lg font-medium">알림</h3>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button 
                                    className="btn btn-xs btn-ghost flex items-center gap-1"
                                    onClick={markAllAsRead}
                                >
                                    <HiCheck className="w-4 h-4" />
                                    <span>모두 읽음</span>
                                </button>
                            )}
                            <label htmlFor="notification-dropdown" className="btn btn-xs btn-ghost">
                                <HiX className="w-4 h-4" />
                            </label>
                        </div>
                    </div>

                    {/* 알림 목록 */}
                    {loading ? (
                        <div className="py-6 text-center">
                            <span className="loading loading-spinner loading-md"></span>
                        </div>
                        ) : Array.isArray(notifications) && notifications.length > 0 ? (
                            <ul className="divide-y divide-base-300">
                                {notifications.map((notification, idx) => {
                                    // id가 없으면 idx를, 있으면 id를 키로 사용
                                    const reactKey = notification.id != null
                                        ? notification.id
                                        : `notif-${idx}`;
                                    
                                    return (
                                        <li
                                            key={reactKey}
                                            className={`p-4 hover:bg-base-200 ${!notification.isRead ? 'bg-base-200/50' : ''}`}
                                        >
                                            <Link 
                                                to={getNotificationLink(notification)} 
                                                className="flex items-start gap-3"
                                                onClick={() => handleNotificationClick(notification)}
                                            >
                                                {/* 알림 아이콘 */}
                                                {getNotificationIcon(notification.type)}
                                                
                                                {/* 알림 내용 */}
                                                <div className="flex-1">
                                                    <p className="text-sm text-base-content">{notification.content}</p>
                                                    <p className="text-xs text-base-content/60 mt-1">{formatNotificationDate(notification.createdAt)}</p>
                                                </div>
                                                
                                                {/* 읽지 않은 표시 */}
                                                {!notification.isRead && (
                                                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1"></div>
                                                )}
                                            </Link>
                                        </li>
                                    )})
                                }   
                            </ul>
                        ) : (
                        <EmptyNotifications />
                        )
                    }  
                    
                </div>
            </div>
        </div>
    );
};

export default NotificationDropdown;