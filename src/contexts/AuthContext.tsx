import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';

// 인증 사용자 타입 정의
interface User {
    userId: string;
    userNm: string;
    provider?: string;  // 소셜 로그인 제공자
    providerId?: string; // 소셜 로그인 ID
    profileImgUrl?: string; // 프로필 이미지 URL
}

// 인증 컨텍스트 타입 정의
interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    socialLogin: (provider: string) => void;
    handleOAuth2Redirect: () => void;
}

// 기본 컨텍스트 값
const defaultAuthContext: AuthContextType = {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    login: async () => { },
    logout: async () => { },
    checkAuth: async () => { },
    socialLogin: () => { },
    handleOAuth2Redirect: () => { },
};

// 인증 컨텍스트 생성
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// 인증 제공자 Props 타입
interface AuthProviderProps {
    children: ReactNode;
}

// API 기본 URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090';

// 인증 제공자 컴포넌트
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    // 토큰을 로컬 스토리지에서 가져오기
    const getToken = (): string | null => {
        return localStorage.getItem('authToken');
    };

    // 토큰을 로컬 스토리지에 저장
    const setToken = (token: string): void => {
        localStorage.setItem('authToken', token);
    };

    // 토큰을 로컬 스토리지에서 제거
    const removeToken = (): void => {
        localStorage.removeItem('authToken');
    };

    // 소셜 로그인 함수
    const socialLogin = (provider: string): void => {
        console.log(`${provider} 소셜 로그인 시도`);
        window.location.href = `${API_URL}/oauth2/authorize/${provider.toLowerCase()}`;
    };

    // OAuth2 리디렉션 처리 함수
    const handleOAuth2Redirect = (): void => {
        // URL 파라미터에서 토큰 추출
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const error = urlParams.get('error');
        
        console.log('token? : ', token, ' / error?: ', error)
        if (error) {
            console.error('OAuth2 인증 오류:', error);
            setError(`소셜 로그인 실패: ${error}`);
            setLoading(false);
            return;
        }

        if (token) {
            console.log('OAuth2 토큰 받음:', token);
            setToken(token);
            
            // 토큰으로 사용자 정보 가져오기
            checkAuth().then(() => {
                // URL에서 토큰 파라미터 제거하기 위한 히스토리 관리
                const cleanUrl = window.location.pathname;
                window.history.replaceState({}, document.title, cleanUrl);
            });
        }
    };

    // 로그인 함수
    const login = async (email: string, password: string): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            console.log("로그인 요청 시작:", { userId: email, userPw: '***' });
            console.log(`요청 URL: ${API_URL}/auth/login`);

            // 직접 axios 사용
            const response = await axios({
                method: 'POST',
                url: `${API_URL}/auth/login`,
                data: {
                    userId: email,
                    userPw: password,
                    rememberMe: false
                },
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
                maxRedirects: 0,
                validateStatus: function (status) {
                    return status >= 200 && status < 300;
                }
            });

            console.log("로그인 응답:", response);

            // 응답 데이터 구조 처리
            const responseData = response.data;
            console.log("응답 데이터:", responseData);

            // ResponseDTO<TokenResponseDTO> 구조
            if (responseData.data) {
                const tokenData = responseData.data;
                console.log("토큰 데이터:", tokenData);

                // 토큰 및 사용자 정보 추출
                if (tokenData.token && tokenData.user) {
                    setToken(tokenData.token);
                    setUser(tokenData.user);
                    setIsAuthenticated(true);
                    console.log("로그인 성공: 토큰 및 사용자 정보 저장 완료");
                } else {
                    throw new Error("토큰 또는 사용자 정보가 응답에 없습니다");
                }
            }
            // 플랫 구조 처리
            else if (responseData.token && responseData.user) {
                setToken(responseData.token);
                setUser(responseData.user);
                setIsAuthenticated(true);
                console.log("로그인 성공: 토큰 및 사용자 정보 저장 완료");
            }
            else {
                throw new Error("응답 데이터 형식을 인식할 수 없습니다");
            }
        } catch (error: any) {
            console.error('로그인 오류:', error);

            // 자세한 에러 정보 로깅
            if (error.response) {
                console.error('에러 응답 데이터:', error.response.data);
                console.error('에러 응답 상태:', error.response.status);
                console.error('에러 응답 헤더:', error.response.headers);

                // 응답 본문이 HTML인 경우 (리다이렉션 발생 가능)
                if (typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE html>')) {
                    console.error('HTML 응답 감지: 리다이렉션 또는 오류 페이지 반환됨');
                }
            } else if (error.request) {
                console.error('에러 요청:', error.request);
            } else {
                console.error('에러 메시지:', error.message);
            }

            // 사용자 친화적인 오류 메시지 설정
            setError(
                error.response?.data?.message ||
                error.message ||
                '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.'
            );
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    // 로그아웃 함수
    const logout = async (): Promise<void> => {
        setLoading(true);

        try {
            if (isAuthenticated) {
                // 토큰이 있는 경우 서버에 로그아웃 요청
                const token = getToken();
                if (token) {
                    await axios({
                        method: 'POST',
                        url: `${API_URL}/auth/logout`,
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        withCredentials: true
                    });
                    console.log("로그아웃 요청 성공");
                }
            }
        } catch (error) {
            console.error('로그아웃 오류:', error);
        } finally {
            // 로컬 상태 초기화
            removeToken();
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
            console.log("로그아웃 완료: 로컬 상태 초기화");
        }
    };

    // 인증 상태 확인 함수
    const checkAuth = async (): Promise<void> => {
        setLoading(true);

        try {
            const token = getToken();

            if (!token) {
                console.log("저장된 토큰 없음: 인증되지 않은 상태");
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
                return;
            }

            console.log(`인증 상태 확인 요청: ${API_URL}/auth/me`);
            const response = await axios({
                method: 'GET',
                url: `${API_URL}/auth/me`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            console.log("인증 상태 응답:", response.data);

            // 응답 데이터 구조에 따라 사용자 정보 추출
            const responseData = response.data;
            const userData = responseData.data || responseData;

            if (userData) {
                console.log("사용자 정보 가져옴:", userData);
                setUser(userData);
                setIsAuthenticated(true);
            } else {
                throw new Error("사용자 정보가 응답에 없습니다");
            }
        } catch (error) {
            console.error('인증 상태 확인 오류:', error);
            removeToken();
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    // axios 요청 인터셉터 설정
    useEffect(() => {
        // 요청 인터셉터 - 인증 토큰 추가
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                const token = getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // 응답 인터셉터 - 토큰 만료 처리
        const responseInterceptor = axios.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error: AxiosError) => {
                const originalRequest = error.config;

                // 인증 오류 (401) 처리를 수정
                if (error.response?.status === 401 && originalRequest && !originalRequest.headers._retry) {
                    originalRequest.headers._retry = true;

                    // 접근 권한이 필요한 경로인지 확인
                    const requestUrl = originalRequest.url || '';
                    
                    // 권한이 필요한 엔드포인트 목록
                    const authRequiredEndpoints = [
                        '/post/new', '/auth/me', '/post/comments'
                        // 로그인 필수 엔드포인트 추가
                    ];
                    
                    // 접근 권한이 필요한 API 요청이면 로그인 페이지로 이동
                    const needsAuth = authRequiredEndpoints.some(endpoint => 
                        requestUrl.includes(endpoint)
                    );
                    
                    // 인증이 필요한 엔드포인트일 경우에만 로그인 페이지로 리다이렉트
                    if (needsAuth) {
                        try {
                            await logout();
                            // URL path를 확인하여 게시판 페이지에서는 리다이렉트하지 않음
                            const currentPath = window.location.pathname;
                            
                            // 글쓰기 등 인증이 필요한 페이지일 경우에만 리다이렉트
                            if (currentPath.includes('/board/new') || 
                                currentPath.includes('/profile')) {
                                window.location.href = '/login';
                            }
                        } catch (refreshError) {
                            // 조용히 로그아웃만 처리
                            await logout();
                        }
                    }
                }

                return Promise.reject(error);
            }
        );

        // 컴포넌트 언마운트 시 인터셉터 제거
        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, []);

     // OAuth2 리디렉션 감지
     useEffect(() => {
        // URL에 token 파라미터가 있으면 OAuth2 리디렉션으로 판단
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('token') || urlParams.has('error')) {
            handleOAuth2Redirect();
        } else {
            // 컴포넌트 마운트 시 인증 상태 확인
            checkAuth();
        }
    }, []);

    const contextValue: AuthContextType = {
        user,
        loading,
        error,
        isAuthenticated,
        login,
        logout,
        checkAuth,
        socialLogin,
        handleOAuth2Redirect
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// 인증 훅 내보내기
export const useAuth = (): AuthContextType => useContext(AuthContext);

export default AuthContext;