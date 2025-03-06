import React, { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import FeatureCarousel from './components/main/FeatureCarousel';
import CategoryCardLayout from './components/main/CategoryCardLayout'; 
import Login from "./pages/login/Login";
import Signup from "./pages/login/Signup";

import logo_brlog from './assets/img/brlog3.png';

// 테마 타입 정의
type Theme = 'light' | 'dark' | 'system';

// 테마 컨텍스트 인터페이스 정의
interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

// 테마 컨텍스트 생성
const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    setTheme: () => {},
});

// 테마 훅 내보내기
export const useTheme = (): ThemeContextType => useContext(ThemeContext);

// 네비게이션 바 컴포넌트
const NavigationBar: React.FC = () => {
    const { theme, setTheme } = useTheme();
    
    return (
        <nav className="w-full bg-base-100 border-gray-300 shadow-md relative">
            <div className="container mx-auto flex justify-between items-center px-6 py-4"> 
                {/* 로고 */}
                <div className="text-lg font-semibold">
                    <img src={logo_brlog} alt="로고" className="h-8 w-auto"/>
                </div>

                {/* 메뉴 */}
                <div className="flex space-x-24 text-lg text-gray-400">
                    <Link to="/" className="text-gray-400 hover:text-gray-700">Home</Link>
                    <Link to="#" className="text-gray-400 hover:text-gray-700">게시판</Link>
                    <Link to="#" className="text-gray-400 hover:text-gray-700">BR</Link>
                </div>

                {/* 오른쪽 영역: 로그인 버튼 + 테마 변경 */}
                <div className="flex items-center space-x-4">
                    {/* 로그인 버튼 */}
                    <Link 
                        to="/login" 
                        className="btn btn-outline hover:bg-gray-100 transition-colors"
                    >
                        로그인
                    </Link>
                
                    {/* 테마 변경 드롭다운 */}
                    <div className="dropdown dropdown-end relative">
                        <label tabIndex={0} className="btn btn-outline">
                            Theme
                        </label>
                        <ul 
                            tabIndex={0} 
                            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 right-0 z-50"
                        >
                            <li><button onClick={() => setTheme("light")}>☀ Light</button></li>
                            <li><button onClick={() => setTheme("dark")}>🌙 Dark</button></li>
                            <li><button onClick={() => setTheme("system")}>💻 System</button></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

// 메인 레이아웃 컴포넌트
interface MainLayoutProps {
    children?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <>
            <NavigationBar />
            <div className="min-h-screen flex flex-col">
                <FeatureCarousel />
                <main className="container mx-auto px-6 py-8 overflow-hidden">
                    {children}
                </main>
            </div>
        </>
    );
};

// 인증 레이아웃 (로그인/회원가입용)
const AuthLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <>
            <NavigationBar />
            <div className="min-h-screen">
                {children}
            </div>
        </>
    );
};

// 앱 컴포넌트
const App: React.FC = () => {
    const [theme, setTheme] = useState<Theme>(() => {
        // localStorage에서 테마 불러오기 (기본값: system)
        const savedTheme = localStorage.getItem("theme");
        return (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') 
            ? savedTheme as Theme
            : 'system';
    });

    useEffect(() => {
        const root = document.documentElement;

        if (theme === "system") {
            // OS 다크모드 감지
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            root.setAttribute("data-theme", systemTheme);
        } else {
            root.setAttribute("data-theme", theme);
        }

        // localStorage에 테마 저장
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <Router>
                <Routes>
                    {/* 메인 페이지 */}
                    <Route 
                        path="/" 
                        element={
                            <MainLayout>
                                <CategoryCardLayout />
                            </MainLayout>
                        } 
                    />
                    
                    {/* 로그인 페이지 */}
                    <Route 
                        path="/login" 
                        element={
                            <AuthLayout>
                                <Login />
                            </AuthLayout>
                        } 
                    />
                    
                    {/* 회원가입 페이지 */}
                    <Route 
                        path="/signup" 
                        element={
                            <AuthLayout>
                                <Signup />
                            </AuthLayout>
                        } 
                    />
                </Routes>
            </Router>
        </ThemeContext.Provider>
    );
}

export default App;