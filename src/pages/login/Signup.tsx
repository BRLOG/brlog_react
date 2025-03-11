import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// API 기본 URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090';

// 회원가입 폼 상태 인터페이스
interface SignupFormState {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
}

// 인증번호 상태 인터페이스
interface VerificationState {
    code: string;
    isVerifying: boolean;
    verificationId: string;
}

const Signup: React.FC = () => {
    // 폼 데이터 상태
    const [form, setForm] = useState<SignupFormState>({
        name: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    // 인증 상태
    const [verification, setVerification] = useState<VerificationState>({
        code: "",
        isVerifying: false,
        verificationId: ""
    });

    // 로딩 및 에러 상태
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const navigate = useNavigate();

    // 입력 필드 변경 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));

        // 이메일 입력 시 에러 초기화
        if (name === 'email') {
            setEmailError(null);
        }

        // 비밀번호 입력 시 에러 초기화
        if (name === 'password' || name === 'passwordConfirm') {
            setPasswordError(null);
        }
    };

    // 인증 코드 입력 핸들러
    const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setVerification(prev => ({ ...prev, code: e.target.value }));
    };

    // 이메일 유효성 검사
    const isEmailValid = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // 비밀번호 유효성 검사
    const isPasswordValid = (): boolean => {
        if (form.password.length < 8) {
            setPasswordError("비밀번호는 최소 8자 이상이어야 합니다.");
            return false;
        }

        if (form.password !== form.passwordConfirm) {
            setPasswordError("비밀번호가 일치하지 않습니다.");
            return false;
        }

        return true;
    };

    // 이메일 중복 확인 및 인증번호 발송
    const handleCheckEmailAndSendVerification = async (): Promise<void> => {
        // 입력 유효성 검사
        if (!form.name.trim()) {
            setError("이름을 입력해주세요.");
            return;
        }

        if (!isEmailValid(form.email)) {
            setEmailError("유효한 이메일 주소를 입력해주세요.");
            return;
        }

        if (!isPasswordValid()) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log('API_URL?: ', API_URL)
            // 이메일 중복 확인
            const checkResponse = await axios.post(`${API_URL}/auth/check-email`, {
                email: form.email
            });

            console.log("이메일 중복 확인 응답:", checkResponse.data);

            // ResponseDTO 구조 확인
            const responseData = checkResponse.data;
            const exists = responseData.data?.exists;
            
            if (exists) {
                setEmailError("이미 사용 중인 이메일입니다.");
                setLoading(false);
                return;
            }

            // 인증번호 발송
            const verifyResponse = await axios.post(`${API_URL}/auth/send-verification`, {
                email: form.email,
                name: form.name
            });

            console.log("인증번호 발송 응답:", verifyResponse.data);

            // ResponseDTO 구조에서 데이터 추출
            const verificationData = verifyResponse.data.data;
            
            // 인증 모드로 전환
            setVerification({
                code: "",
                isVerifying: true,
                verificationId: verificationData.verificationId
            });

            setError(null);
        } catch (err: any) {
            console.error("이메일 확인/인증번호 발송 중 오류:", err);
            
            const errorMessage = err.response?.data?.message || 
                                err.response?.data?.detail || 
                                "이메일 확인 중 오류가 발생했습니다.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // 인증번호 확인 및 회원가입 완료
    const handleVerifyAndSignup = async (): Promise<void> => {
        if (!verification.code.trim()) {
            setError("인증번호를 입력해주세요.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 인증번호 확인
            const verifyResponse = await axios.post(`${API_URL}/auth/verify-code`, {
                email: form.email,
                verificationId: verification.verificationId,
                code: verification.code
            });

            console.log("인증 확인 응답:", verifyResponse.data);

            // ResponseDTO 구조에서 데이터 추출
            const verificationResult = verifyResponse.data.data;
            
            if (!verificationResult.verified) {
                setError("인증번호가 올바르지 않습니다.");
                setLoading(false);
                return;
            }

            // 회원가입 완료
            const signupResponse = await axios.post(`${API_URL}/auth/signup`, {
                userId: form.email,
                userNm: form.name,
                userPw: form.password,
                userLevel: "USER"
            });

            console.log("회원가입 응답:", signupResponse.data);

            // 회원가입 성공 메시지 표시 후 로그인 페이지로 이동
            alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
            navigate("/login");
        } catch (err: any) {
            console.error("인증/회원가입 중 오류:", err);
            
            // 응답 구조에 따른 오류 메시지 처리
            const errorMessage = err.response?.data?.message || 
                                err.response?.data?.detail ||
                                "인증 또는 회원가입 중 오류가 발생했습니다.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        
        if (verification.isVerifying) {
            // 인증 모드: 인증번호 확인 및 회원가입
            await handleVerifyAndSignup();
        } else {
            // 기본 모드: 이메일 중복 확인 및 인증번호 발송
            await handleCheckEmailAndSendVerification();
        }
    };

    return (
        <div className="min-h-screen bg-base-100 text-base-content">
            {/* 컨텐츠 */}
            <div className="flex flex-col items-center justify-center pt-20">
                <h2 className="text-3xl font-semibold">
                    {verification.isVerifying ? "이메일 인증" : "회원가입"}
                </h2>
                
                {/* 에러 메시지 표시 */}
                {error && (
                    <div className="alert alert-error my-4 max-w-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{error}</span>
                    </div>
                )}

                <form className="mt-8 w-full max-w-md px-4 space-y-6" onSubmit={handleSubmit}>
                    {!verification.isVerifying ? (
                        // 회원가입 기본 정보 입력 폼
                        <>
                            <div>
                                <label className="block text-sm font-medium">이름</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="이름 입력"
                                    className="w-full mt-1 px-4 py-2 border border-base-300 rounded-none focus:ring-1 focus:ring-primary input input-bordered"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">이메일</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="이메일 입력"
                                    className={`w-full mt-1 px-4 py-2 border border-base-300 rounded-none focus:ring-1 focus:ring-primary input input-bordered ${emailError ? 'input-error' : ''}`}
                                    required
                                    disabled={loading}
                                />
                                {emailError && <p className="text-error text-xs mt-1">{emailError}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">비밀번호</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="비밀번호 입력 (8자 이상)"
                                    className="w-full mt-1 px-4 py-2 border border-base-300 rounded-none focus:ring-1 focus:ring-primary input input-bordered"
                                    required
                                    disabled={loading}
                                    minLength={8}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">비밀번호 확인</label>
                                <input
                                    type="password"
                                    name="passwordConfirm"
                                    value={form.passwordConfirm}
                                    onChange={handleChange}
                                    placeholder="비밀번호 재입력"
                                    className={`w-full mt-1 px-4 py-2 border border-base-300 rounded-none focus:ring-1 focus:ring-primary input input-bordered ${passwordError ? 'input-error' : ''}`}
                                    required
                                    disabled={loading}
                                />
                                {passwordError && <p className="text-error text-xs mt-1">{passwordError}</p>}
                            </div>
                        </>
                    ) : (
                        // 인증번호 입력 폼
                        <div>
                            <p className="mb-4 text-sm">
                                <strong>{form.email}</strong>로 인증번호가 발송되었습니다.<br />
                                이메일을 확인하고 인증번호를 입력해주세요.
                            </p>
                            <label className="block text-sm font-medium">인증번호</label>
                            <input
                                type="text"
                                value={verification.code}
                                onChange={handleVerificationCodeChange}
                                placeholder="인증번호 6자리 입력"
                                className="w-full mt-1 px-4 py-2 border border-base-300 rounded-none focus:ring-1 focus:ring-primary input input-bordered"
                                required
                                disabled={loading}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className={`w-full py-3 mt-4 btn btn-primary ${loading ? 'loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? '처리 중...' : 
                         verification.isVerifying ? '인증 완료 및 회원가입' : '인증번호 받기'}
                    </button>
                </form>

                {/* 로그인으로 돌아가기 버튼 */}
                <div className="mt-4 text-sm opacity-70">
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="hover:underline bg-transparent border-none cursor-pointer"
                        disabled={loading}
                    >
                        이미 계정이 있으신가요? 로그인하기
                    </button>
                </div>

                {/* 이메일 변경 버튼 (인증 모드일 때만 표시) */}
                {verification.isVerifying && (
                    <div className="mt-2 text-sm opacity-70">
                        <button
                            type="button"
                            onClick={() => setVerification(prev => ({ ...prev, isVerifying: false }))}
                            className="hover:underline bg-transparent border-none cursor-pointer"
                            disabled={loading}
                        >
                            이메일 변경하기
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Signup;