import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext'; 
import { useAuth } from '../../contexts/AuthContext';
import logo_brlog from '../../assets/img/brlog3.png'; 

// 테마 아이콘 선택 함수
const getThemeIcon = (currentTheme: string, resolvedTheme: string) => {
    if (currentTheme === 'system') {
        return resolvedTheme === 'light' ? '☀' : '🌙';
    } else if (currentTheme === 'forest') {
        return '🌲';
    } else {
        return currentTheme === 'light' ? '☀' : '🌙';
    }
};

const NavigationBar: React.FC = () => {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const location = useLocation(); // 현재 경로 가져오기
    const { isAuthenticated, user, logout, loading } = useAuth(); // 인증 상태 가져오기
    
    // 로그아웃 처리
    const handleLogout = async () => {
        await logout();
        // 로그아웃 후 홈으로 이동
        window.location.href = '/';
    };

    return (
        <nav className="w-full bg-base-100 border-gray-300 shadow-md relative">
            <div className="container mx-auto flex justify-between items-center px-6 py-4"> 
                {/* 로고 */}
                <div className="text-lg font-semibold">
                    <img src={logo_brlog} alt="로고" className="h-8 w-auto"/>
                </div>

                {/* 메뉴 */}
                <div className="flex space-x-24 text-base">
                
                    <Link to="/" className={`hover:text-accent-content transition-colors ${ location.pathname === '/' ? 'text-accent-content font-semibold' : 'text-base-content/70' }`}>Home</Link>
                    <Link to="/board" className={`hover:text-accent-content transition-colors ${ location.pathname.startsWith('/board') ? 'text-accent-content font-semibold' : 'text-base-content/70' }`}>게시판</Link>
                    <Link to="#" className="text-base-content/70 hover:text-accent-content transition-colors">BR</Link>
                </div>

                {/* 오른쪽 영역: 로그인/사용자 메뉴 + 테마 변경 */}
                <div className="flex items-center space-x-4">
                    {/* 로그인 상태에 따라 다른 UI 표시 */}
                    {loading ? (
                        // 로딩 중일 때
                        <span className="loading loading-spinner loading-sm"></span>
                    ) : isAuthenticated ? (
                        // 로그인된 경우 - 사용자 드롭다운 메뉴
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost avatar flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center">
                                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <span className="hidden md:inline">{user?.username || '사용자'}</span>
                            </label>
                            <ul tabIndex={0} className="mt-3 z-50 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-300">
                                <li>
                                    <Link to="/profile" className="justify-between">
                                        내 프로필
                                        <span className="badge badge-primary badge-sm">New</span>
                                    </Link>
                                </li>
                                <li><Link to="/settings">설정</Link></li>
                                <li><button onClick={handleLogout}>로그아웃</button></li>
                            </ul>
                        </div>
                    ) : (
                        // 로그인되지 않은 경우 - 로그인 버튼
                        <Link 
                            to="/login" 
                            className="btn btn-outline hover:bg-base-200 transition-colors"
                        >
                            로그인
                        </Link>
                    )}
                
                    {/* 테마 변경 드롭다운 */}
                    <div className="dropdown dropdown-end relative">
                        <label tabIndex={0} className="btn btn-outline">
                            {getThemeIcon(theme, resolvedTheme)} Theme
                        </label>
                        <ul 
                            tabIndex={0} 
                            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 right-0 z-50"
                        >
                            <li className={theme === 'light' ? 'bg-base-200' : ''}>
                                <button onClick={() => setTheme("light")}>☀ Light</button>
                            </li>
                            <li className={theme === 'dark' ? 'bg-base-200' : ''}>
                                <button onClick={() => setTheme("dark")}>🌙 Dark</button>
                            </li>
                            <li className={theme === 'forest' ? 'bg-base-200' : ''}>
                                <button onClick={() => setTheme("forest")}>🌲 Forest</button>
                            </li>
                            <li className={theme === 'system' ? 'bg-base-200' : ''}>
                                <button onClick={() => setTheme("system")}>💻 System</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavigationBar;