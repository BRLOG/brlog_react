import React, { useState, useEffect } from 'react';

const ScrollToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    // 스크롤 위치에 따라 버튼 표시 여부 결정
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) { // 스크롤이 300px 이상일 때 버튼 표시
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    // 상단으로 스크롤 이동하는 함수
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // 부드러운 스크롤 효과
        });
    };

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 bg-base-content text-primary-content p-3 rounded-full shadow-lg hover:bg-primary-focus transition-all duration-300 z-50"
                    aria-label="맨 위로 스크롤"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                        />
                    </svg>
                </button>
            )}
        </>
    );
};

export default ScrollToTop;