import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
// ThemeContext에서 useTheme 가져오기
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";

import appleIcon from '../../assets/img/icon/apple-icon.png';
import microsoftIcon from '../../assets/img/icon/microsoft-icon.png';
import googleIcon from '../../assets/img/icon/google-icon.png';

// API 기본 URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090';

// 로그인 폼 인터페이스
interface LoginFormState {
    email: string;
    password: string;
}

// 소셜 로그인 제공자 타입
type SocialLoginProvider = "Google" | "Apple" | "Microsoft";

const Login: React.FC = () => {
    const [form, setForm] = useState<LoginFormState>({ email: "", password: "" });
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const navigate = useNavigate();

    // 인증 컨텍스트 사용
    const { login, error, isAuthenticated, loading, socialLogin } = useAuth();

    // 인증 상태 변경 시 리다이렉트
    useEffect(() => {
        if (isAuthenticated) {
            console.log("인증됨: 홈으로 리다이렉트");
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    // 테마 가져오기
    const { theme } = useTheme();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault(); // 기본 폼 제출 방지
        console.log("일반 로그인 시도:", form.email);
        
        setIsSubmitting(true);
        
        try {
            // AuthContext의 login 함수 사용
            await login(form.email, form.password);
            // 로그인 성공 처리는 useEffect에서 함
        } catch (err) {
            console.error("로그인 중 오류 발생:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSocialLogin = (provider: SocialLoginProvider): void => {
        console.log(`${provider} 소셜 로그인 시도`);
        // AuthContext의 socialLogin 함수 사용
        socialLogin(provider.toLowerCase());
    };

    return (
        <div className="min-h-screen bg-base-100 text-base-content">
            {/* 컨텐츠 */}
            <div className="flex flex-col items-center justify-center pt-20">
                <h2 className="text-3xl font-semibold">로그인</h2>
                
                {/* 에러 메시지 표시 */}
                {error && (
                    <div className="alert alert-error my-4 max-w-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{error}</span>
                    </div>
                )}

                <form className="mt-8 w-full max-w-md px-4 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium">이메일</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="이메일 입력"
                            className="w-full mt-1 px-4 py-2 border border-base-300 rounded-none focus:ring-1 focus:ring-primary input input-bordered"
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">비밀번호</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="비밀번호 입력"
                            className="w-full mt-1 px-4 py-2 border border-base-300 rounded-none focus:ring-1 focus:ring-primary input input-bordered"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* 로그인 상태 유지 체크박스 */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="checkbox checkbox-sm"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                disabled={isSubmitting}
                            />
                            <label htmlFor="remember-me" className="ml-2 text-sm">
                                로그인 상태 유지
                            </label>
                        </div>
                        <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                            비밀번호 찾기
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-3 mt-4 btn btn-primary ${isSubmitting || loading ? 'loading' : ''}`}
                        disabled={isSubmitting || loading}
                    >
                        {isSubmitting || loading ? '로그인 중...' : '로그인'}
                    </button>
                </form>

                {/* 소셜 로그인 버튼 */}
                <div className="mt-6 w-full max-w-md px-4 space-y-3">
                    <button
                        type="button"
                        onClick={() => handleSocialLogin("Google")}
                        className="w-full py-2 border border-base-300 bg-base-100 hover:bg-base-200 flex items-center justify-center gap-2 btn btn-outline"
                        disabled={isSubmitting}
                    >
                        <img 
                            src={googleIcon} 
                            alt="Google" 
                            className="w-5 h-5"
                        />
                        Google 로그인
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSocialLogin("Apple")}
                        className="w-full py-2 border border-base-300 bg-base-100 hover:bg-base-200 flex items-center justify-center gap-2 btn btn-outline"
                        disabled={isSubmitting}
                    >
                        <img 
                            src={appleIcon} 
                            alt="Apple" 
                            className="w-5 h-5"
                        />
                        Apple 로그인
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSocialLogin("Microsoft")}
                        className="w-full py-2 border border-base-300 bg-base-100 hover:bg-base-200 flex items-center justify-center gap-2 btn btn-outline"
                        disabled={isSubmitting}
                    >
                        <img 
                            src={microsoftIcon} 
                            alt="Microsoft" 
                            className="w-5 h-5"
                        />
                        Microsoft 로그인
                    </button>
                </div>

                {/* 회원가입 & 아이디 찾기 */}
                <div className="mt-4 text-sm opacity-70">
                    <button
                        type="button"
                        onClick={() => navigate("/signup")}
                        className="hover:underline bg-transparent border-none cursor-pointer"
                    >
                        회원가입
                    </button> |
                    <button
                        type="button"
                        className="hover:underline bg-transparent border-none cursor-pointer"
                    >
                        아이디 찾기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;