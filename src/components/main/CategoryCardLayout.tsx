import React, { useState } from 'react';

// 임시 로고 아이콘들
import nvidiaLogo from '../../assets/img/logo/nvidia-logo.png';
import palantirLogo from '../../assets/img/logo/palantir-logo.png';
import appleLogo from '../../assets/img/logo/apple-logo.png';
import cocacolaLogo from '../../assets/img/logo/cocacola-logo.png';
import berkshireLogo from '../../assets/img/logo/berkshireHathaway-logo.png';

import microsoftLogo from '../../assets/img/logo/microsoft-logo.png';
import amazonLogo from '../../assets/img/logo/amazon-logo.png';
import googleLoco from '../../assets/img/logo/google-logo.png';
import microStrategyLogo from '../../assets/img/logo/microStrategy-logo.png';
import netflixLogo from '../../assets/img/logo/netflix-logo.png';

import teslaLogo from '../../assets/img/logo/tesla-logo.png';
import metaLogo from '../../assets/img/logo/meta-logo.png';
import oracleLogo from '../../assets/img/logo/oracle-logo.png';
import unitedHealthLogo from '../../assets/img/logo/unitedHealth-logo.png';
import walmartLogo from '../../assets/img/logo/walmart-logo.png';

// 카드 데이터 인터페이스
interface Card {
    title: string;
    description: string;
    image: string;
    tag: string;
}

// 카테고리 데이터 인터페이스
interface Category {
    title: string;
    cards: Card[];
}

// 카드 컴포넌트 Props 인터페이스
interface CardProps extends Card {}

// 카드 캐러셀 Props 인터페이스
interface CardCarouselProps {
    cards: Card[];
}

// 카테고리 섹션 Props 인터페이스
interface CategorySectionProps {
    title: string;
    cards: Card[];
}

// 개별 카드 컴포넌트
const Card: React.FC<CardProps> = ({ title, description, image, tag }) => {
    return (
        <div className="bg-accent flex-shrink-0 w-full sm:w-[calc(100%/3-16px)] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="h-48 overflow-hidden flex justify-center"> {/* flex justify-center 추가 */}
                <img src={image} alt={title} className="h-full transition-transform duration-500 hover:scale-105" /> {/* w-full object-cover 삭제 */}
            </div>
            <div className="p-5">
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full mb-2">
                    {tag}
                </span>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
                <p className="text-gray-600">{description}</p>
            </div>
        </div>
    );
};

// 카드 캐러셀 컴포넌트
const CardCarousel: React.FC<CardCarouselProps> = ({ cards }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const cardsPerView: number = 3;
    const maxIndex: number = Math.max(0, cards.length - cardsPerView);

    const handlePrev = (): void => {
        setCurrentIndex(prev => Math.max(0, prev - cardsPerView));
    };

    const handleNext = (): void => {
        setCurrentIndex(prev => Math.min(maxIndex, prev + cardsPerView));
    };

    return (
        <div className="relative">
            <div className=""> {/* overflow-hidden 삭제 */}
                <div 
                    className="flex gap-4 transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * (100 / cards.length)}%)` }}
                >
                    {cards.map((card, index) => (
                        <Card key={index} {...card} />
                    ))}
                </div>
            </div>
            
            {/* 이전 버튼 */}
            {currentIndex > 0 && (
                <button 
                    onClick={handlePrev} 
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-gray-700 z-10 hover:bg-gray-100"
                    aria-label="이전 카드"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
            )}
            
            {/* 다음 버튼 */}
            {currentIndex < maxIndex && (
                <button 
                    onClick={handleNext} 
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-gray-700 z-10 hover:bg-gray-100"
                    aria-label="다음 카드"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>
            )}
        </div>
    );
};

// 카테고리 섹션 컴포넌트
const CategorySection: React.FC<CategorySectionProps> = ({ title, cards }) => {
    return (
        <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-base-content">{title}</h2>
            <CardCarousel cards={cards} />
        </div>
    );
};

// 메인 컴포넌트
const CategoryCardLayout: React.FC = () => {
    // 샘플 데이터 - 실제 데이터로 교체 필요
    const categories: Category[] = [
        {
            title: "개발",
            cards: [
                {
                    title: "React 팁과 트릭",
                    description: "React 앱 개발 시 효율성을 높이는 10가지 팁을 소개합니다.",
                    image: nvidiaLogo,
                    tag: "nvidia"
                },
                {
                    title: "TypeScript 시작하기",
                    description: "TypeScript의 기본 개념과 JavaScript에서 마이그레이션하는 방법",
                    image: palantirLogo,
                    tag: "palantir"
                },
                {
                    title: "Node.js 성능 최적화",
                    description: "Node.js 애플리케이션의 성능을 향상시키는 테크닉",
                    image: appleLogo,
                    tag: "apple"
                },
                {
                    title: "CSS Grid 고급 기법",
                    description: "CSS Grid를 활용한 복잡한 레이아웃 구현 방법",
                    image: cocacolaLogo,
                    tag: "cocacola"
                },
                {
                    title: "GraphQL vs REST API",
                    description: "두 API 방식의 장단점과 적절한 사용 시나리오",
                    image: berkshireLogo,
                    tag: "berkshireHathaway"
                }
            ]
        },
        {
            title: "일상",
            cards: [
                {
                    title: "개발자를 위한 건강 팁",
                    description: "장시간 코딩 시 건강을 지키는 방법과 간단한 운동",
                    image: microsoftLogo,
                    tag: "microsoft"
                },
                {
                    title: "재택근무 생산성 향상법",
                    description: "재택근무 시 집중력과 생산성을 높이는 환경 조성 팁",
                    image: amazonLogo,
                    tag: "amazon"
                },
                {
                    title: "개발자 번아웃 극복하기",
                    description: "개발자들이 자주 겪는 번아웃 증상과 회복 방법",
                    image: googleLoco,
                    tag: "google"
                },
                {
                    title: "테크 컨퍼런스 참가 팁",
                    description: "기술 컨퍼런스에서 최대한의 가치를 얻는 방법",
                    image: microStrategyLogo,
                    tag: "microStrategy"
                },
                {
                    title: "개발자 책상 셋업",
                    description: "생산성과 편안함을 높이는 최적의 작업 환경 구성법",
                    image: netflixLogo,
                    tag: "netflix"
                }
            ]
        },
        {
            title: "기타",
            cards: [
                {
                    title: "AI와 기계학습 기초",
                    description: "비개발자도 이해할 수 있는 AI와 기계학습의 핵심 개념",
                    image: teslaLogo,
                    tag: "tesla"
                },
                {
                    title: "블록체인 실용사례",
                    description: "암호화폐 외의 블록체인 기술 활용 사례 모음",
                    image: metaLogo,
                    tag: "meta"
                },
                {
                    title: "오픈소스 기여하기",
                    description: "오픈소스 프로젝트에 기여하는 방법과 팁",
                    image: oracleLogo,
                    tag: "oracle"
                },
                {
                    title: "기술 블로그 시작하기",
                    description: "개발자로서 기술 블로그를 운영하는 이점과 시작 방법",
                    image: unitedHealthLogo,
                    tag: "unitedHealth"
                },
                {
                    title: "도커 컨테이너 기초",
                    description: "도커를 이용한 애플리케이션 컨테이너화 입문",
                    image: walmartLogo,
                    tag: "walmart"
                }
            ]
        }
    ];

    return (
        <div className="container mx-auto px-4 py-12">
            {categories.map((category, index) => (
                <CategorySection key={index} title={category.title} cards={category.cards} />
            ))}
        </div>
    );
};

export default CategoryCardLayout;