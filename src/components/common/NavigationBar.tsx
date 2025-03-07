import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext'; 
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