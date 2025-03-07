import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import FeatureCarousel from './components/main/FeatureCarousel';
import CategoryCardLayout from './components/main/CategoryCardLayout'; 
import Login from "./pages/login/Login";
import Signup from "./pages/login/Signup";
import NavigationBar from "./components/common/NavigationBar"; 
import { ThemeProvider } from './contexts/ThemeContext';

// 메인 레이아웃 컴포넌트
interface MainLayoutProps {
    children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <>
            <NavigationBar />
            <div className="min-h-screen bg-base-100 flex flex-col">
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
    return (
        <ThemeProvider>
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
        </ThemeProvider>
    );
}

export default App;
