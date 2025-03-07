import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 테마 타입 정의
export type Theme = 'light' | 'dark' | 'forest' | 'system';

// 실제로 적용된 테마 타입 (system이 아닌 실제 테마)
export type ResolvedTheme = 'light' | 'dark' | 'forest';

// 테마 컨텍스트 인터페이스 정의
interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    resolvedTheme: ResolvedTheme; // 실제로 적용된 테마
}

// 테마 컨텍스트 생성
const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    setTheme: () => { },
    resolvedTheme: 'light',
});

// 테마 제공자 props 인터페이스
interface ThemeProviderProps {
    children: ReactNode;
}

// 테마 제공자 컴포넌트
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        // localStorage에서 테마 불러오기 (기본값: system)
        const savedTheme = localStorage.getItem('theme');
        return (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'forest' || savedTheme === 'system')
            ? savedTheme as Theme
            : 'system';
    });

    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
        const savedTheme = localStorage.getItem('theme');
        // forest 테마 추가
        if (savedTheme === 'forest') return 'forest';
        if (savedTheme === 'light') return 'light';
        if (savedTheme === 'dark') return 'dark';
        
        // system 테마의 경우 OS 설정 기반으로 결정
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    // 테마 설정 함수
    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    // 시스템 테마 변경 감지
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = () => {
            if (theme === 'system') {
                const newResolvedTheme = mediaQuery.matches ? 'dark' : 'light';
                setResolvedTheme(newResolvedTheme);
                document.documentElement.setAttribute('data-theme', newResolvedTheme);
            }
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    // 테마 적용
    useEffect(() => {
        const root = document.documentElement;

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.setAttribute('data-theme', systemTheme);
            setResolvedTheme(systemTheme);
        } else {
            root.setAttribute('data-theme', theme);
            // theme가 'forest'면 그대로 'forest'로 설정
            setResolvedTheme(theme as ResolvedTheme);
        }

        // data-theme이 변경되면 CSS 변수가 즉시 업데이트되도록 강제
        document.body.style.cssText = document.body.style.cssText;
    }, [theme]);

    const contextValue = { theme, setTheme, resolvedTheme };

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};

// 테마 훅 내보내기
export const useTheme = (): ThemeContextType => useContext(ThemeContext);
