import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import FeatureCarousel from './components/main/FeatureCarousel';
import CategoryCardLayout from './components/main/CategoryCardLayout';
import Login from "./pages/login/Login";
import Signup from "./pages/login/Signup";
import OAuth2Redirect from './components/auth/OAuth2Redirect';
import NavigationBar from "./components/common/NavigationBar";
import Board from "./pages/board/Board";
import BoardWrite from "./pages/board/BoardWrite";
import BoardDetail from "./pages/board/BoardDetail";
import BoardEdit from "./pages/board/BoardEdit";
import Profile from "./pages/profile/Profile";
import AboutMe from "./pages/about/AboutMe";
import ProjectDetail from "./pages/about/ProjectDetail";
import Lab from "./pages/lab/Lab";
import ScrollToTop from "./components/common/ScrollToTop"; 
import PaymentSuccess from "./pages/lab/PaymentSuccess"; // 결제 성공 페이지
import PaymentFail from "./pages/lab/PaymentFail"; // 결제 실패 페이지

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';

// 보호된 라우트 컴포넌트
interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    // 로딩 중일 때는 로딩 표시
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    // 인증되지 않았다면 로그인 페이지로 리디렉션
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

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
                <ScrollToTop />
            </div>
        </>
    );
};

// 기본 레이아웃 (게시판, ..)
const DefaultLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <>
            <NavigationBar />
            <div className="bg-base-100">
                {children}
                <ScrollToTop />
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
                <ScrollToTop />
            </div>
        </>
    );
};

// 앱 컴포넌트
const App: React.FC = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <NotificationProvider>
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

                            {/* 게시판 페이지 */}
                            <Route
                                path="/board"
                                element={
                                    <DefaultLayout>
                                        <Board />
                                    </DefaultLayout>
                                }
                            />

                            {/* 게시글 작성 페이지 */}
                            <Route
                                path="/board/new"
                                element={
                                    <ProtectedRoute>
                                        <DefaultLayout>
                                            <BoardWrite />
                                        </DefaultLayout>
                                    </ProtectedRoute>
                                }
                            />

                            {/* 게시글 상세 페이지 */}
                            <Route
                                path="/board/:postId"
                                element={
                                    <DefaultLayout>
                                        <BoardDetail />
                                    </DefaultLayout>
                                }
                            />

                            {/* 게시글 수정 페이지 */}
                            <Route
                                path="/board/edit/:postId"
                                element={
                                    <ProtectedRoute>
                                        <DefaultLayout>
                                            <BoardEdit />
                                        </DefaultLayout>
                                    </ProtectedRoute>
                                }
                            />

                            {/* 프로필 페이지 */}
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <DefaultLayout>
                                            <Profile />
                                        </DefaultLayout>
                                    </ProtectedRoute>
                                }
                            />

                            {/* LAB 페이지 */}
                            <Route
                                path="/lab"
                                element={
                                    <DefaultLayout>
                                        <Lab />
                                    </DefaultLayout>
                                }
                            />

                            {/* 결제 성공 페이지 */}
                            <Route
                                path="/front/lab/payment/success"
                                element={
                                    <DefaultLayout>
                                        <PaymentSuccess />
                                    </DefaultLayout>
                                }
                            />

                            {/* 결제 실패 페이지 */}
                            <Route
                                path="/front/lab/payment/fail"
                                element={
                                    <DefaultLayout>
                                        <PaymentFail />
                                    </DefaultLayout>
                                }
                            />

                            {/* BR 탭 (ABOUT ME) 페이지 */}
                            <Route
                                path="/about"
                                element={
                                    <DefaultLayout>
                                        <AboutMe />
                                    </DefaultLayout>
                                }
                            />

                            {/* BR 탭 프로젝트 상세 페이지 */}
                            <Route
                                path="/projects/:projectId"
                                element={
                                    <DefaultLayout>
                                        <ProjectDetail />
                                    </DefaultLayout>
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

                            <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
                        </Routes>
                    </Router>
                </NotificationProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;