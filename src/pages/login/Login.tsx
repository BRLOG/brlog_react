import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../App"; // 테마 컨텍스트 가져오기

import appleIcon from '../../assets/img/icon/apple-icon.png';
import microsoftIcon from '../../assets/img/icon/microsoft-icon.png';
import googleIcon from '../../assets/img/icon/google-icon.png';

// 로그인 폼 인터페이스
interface LoginFormState {
    email: string;
    password: string;
}

// 소셜 로그인 제공자 타입
type SocialLoginProvider = "Google" | "Apple" | "Microsoft";

const Login: React.FC = () => {
    const [form, setForm] = useState<LoginFormState>({ email: "", password: "" });
    const navigate = useNavigate();
    const { theme } = useTheme();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        console.log("로그인 정보:", form);
        // 로그인 로직 구현
    };

    const handleSocialLogin = (provider: SocialLoginProvider): void => {
        console.log(`${provider} 로그인 시도`);
        // 소셜 로그인 로직 구현
    };

    return (
        <div className="min-h-screen bg-white text-black">
            {/* 컨텐츠 */}
            <div className="flex flex-col items-center justify-center pt-20">
                <h2 className="text-3xl font-semibold">로그인</h2>
                <form className="mt-8 w-full max-w-md px-4 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">이메일</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="이메일 입력"
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-none focus:ring-1 focus:ring-black"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">비밀번호</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="비밀번호 입력"
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-none focus:ring-1 focus:ring-black"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 mt-4 text-white bg-black hover:bg-gray-800 transition duration-200"
                    >
                        로그인
                    </button>
                </form>

                {/* 소셜 로그인 버튼 */}
                <div className="mt-6 w-full max-w-md px-4 space-y-3">
                    <button
                        onClick={() => handleSocialLogin("Google")}
                        className="w-full py-2 border border-gray-400 text-gray-700 hover:bg-gray-100 flex items-center justify-center gap-2"
                    >
                        <img 
                            src={googleIcon} 
                            alt="Microsoft" 
                            className="w-5 h-5" // 크기 조정
                        />
                        Google 로그인
                    </button>
                    <button
                        onClick={() => handleSocialLogin("Apple")}
                        className="w-full py-2 border border-gray-400 text-gray-700 hover:bg-gray-100 flex items-center justify-center gap-2"
                    >
                        <img 
                            src={appleIcon} 
                            alt="Microsoft" 
                            className="w-5 h-5" // 크기 조정
                        />
                        Apple 로그인
                    </button>
                    <button
                        onClick={() => handleSocialLogin("Microsoft")}
                        className="w-full py-2 border border-gray-400 text-gray-700 hover:bg-gray-100 flex items-center justify-center gap-2"
                    >
                        <img 
                            src={microsoftIcon} 
                            alt="Microsoft" 
                            className="w-5 h-5" // 크기 조정
                        />
                        Microsoft 로그인
                    </button>
                </div>

                {/* 회원가입 & 아이디 찾기 */}
                <div className="mt-4 text-sm text-gray-600">
                    <button
                        onClick={() => navigate("/signup")}
                        className="hover:underline bg-transparent border-none cursor-pointer"
                    >
                        회원가입
                    </button> |
                    <button
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