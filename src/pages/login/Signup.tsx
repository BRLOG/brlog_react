import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// 회원가입 폼 인터페이스
interface SignupFormState {
    name: string;
    email: string;
    password: string;
}

const Signup: React.FC = () => {
    const [form, setForm] = useState<SignupFormState>({
        name: "",
        email: "",
        password: ""
    });
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        console.log("회원가입 정보:", form);
        // 회원가입 로직 구현
    };

    return (
        <div className="min-h-screen bg-white text-black">
            {/* 컨텐츠 */}
            <div className="flex flex-col items-center justify-center pt-20">
                <h2 className="text-3xl font-semibold">회원가입</h2>
                <form className="mt-8 w-full max-w-md px-4 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">이름</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="이름 입력"
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-none focus:ring-1 focus:ring-black"
                            required
                        />
                    </div>
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
                        회원가입
                    </button>
                </form>

                {/* 로그인으로 돌아가기 버튼 */}
                <div className="mt-4 text-sm text-gray-600">
                    <button
                        onClick={() => navigate("/login")}
                        className="hover:underline bg-transparent border-none cursor-pointer"
                    >
                        이미 계정이 있으신가요? 로그인하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Signup;