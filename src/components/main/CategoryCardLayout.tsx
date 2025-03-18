import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 임시 로고 아이콘들 (폴백용으로만 사용)
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

// API 기본 URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090';

// 로고 매핑 함수 (이미지가 없을 때 대체용)
const getLogoByIndex = (index: number) => {
    const logos = [
        nvidiaLogo, palantirLogo, appleLogo, cocacolaLogo, berkshireLogo,
        microsoftLogo, amazonLogo, googleLoco, microStrategyLogo, netflixLogo,
        teslaLogo, metaLogo, oracleLogo, unitedHealthLogo, walmartLogo
    ];
    return logos[index % logos.length];
};

// 게시글 인터페이스
interface Post {
    postId: number;
    categoryId: string;
    title: string;
    content: string;
    viewCnt: number;
    likeCnt: number;
    commentCnt: number;
    userNm: string;
    regDt: string;
    modDt: string;
}

// 카테고리 인터페이스
interface Category {
    id: string;
    name: string;
    description: string;
}

// 카드 데이터 인터페이스
interface Card {
    title: string;
    description: string;
    image: string;
    tag: string;
    postId?: number;
}

// 카테고리 데이터 인터페이스
interface CategoryData {
    title: string;
    cards: Card[];
}

// 카드 컴포넌트 Props 인터페이스
interface CardProps extends Card {
    onClick?: () => void;
}

// 카드 캐러셀 Props 인터페이스
interface CardCarouselProps {
    cards: Card[];
}

// 카테고리 섹션 Props 인터페이스
interface CategorySectionProps {
    title: string;
    cards: Card[];
}

// 게시글에서 첫 번째 이미지 URL 추출 함수
const extractFirstImageUrl = (content: string): string | null => {
    // HTML 이미지 태그에서 src 추출 (예: <img src="http://example.com/image.jpg" />)
    const htmlImgMatch = content.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
    if (htmlImgMatch && htmlImgMatch[1]) {
        return htmlImgMatch[1];
    }
    
    // 마크다운 이미지 형식에서 URL 추출 (예: ![alt text](http://example.com/image.jpg))
    const markdownImgMatch = content.match(/!\[.*?\]\((.*?)\)/i);
    if (markdownImgMatch && markdownImgMatch[1]) {
        return markdownImgMatch[1];
    }
    
    // 직접 URL 형식에서 이미지 파일 확장자 추출
    const urlMatch = content.match(/(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp))/i);
    if (urlMatch && urlMatch[1]) {
        return urlMatch[1];
    }
    
    return null;
};

// 마크다운 및 HTML 태그를 일반 텍스트로 변환하는 함수
const convertMarkdownToText = (markdown: string): string => {
    // HTML 태그 제거
    let text = markdown.replace(/<[^>]*>/g, '');
    
    // 마크다운 이미지 및 링크 제거
    text = text.replace(/!\[.*?\]\(.*?\)/g, ''); // 이미지 제거
    text = text.replace(/\[([^\]]+)\]\(.*?\)/g, '$1'); // 링크는 텍스트만 유지
    
    // 헤더 기호(#) 제거
    text = text.replace(/^#+\s*/gm, '');
    
    // 볼드, 이탤릭 기호 제거
    text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
    text = text.replace(/(\*|_)(.*?)\1/g, '$2');
    
    // 코드 블록 및 인라인 코드 제거
    text = text.replace(/```[\s\S]*?```/g, '');
    text = text.replace(/`([^`]+)`/g, '$1');
    
    // 여러 줄 바꿈 정리
    text = text.replace(/\n{3,}/g, '\n\n');
    
    return text.trim();
};

// 개별 카드 컴포넌트
const Card: React.FC<CardProps> = ({ title, description, image, tag, postId, onClick }) => {

    const isCustomImage = !image.includes('logo/'); // 로고 폴더의 이미지가 아닌 경우 (사용자 업로드 이미지로 판단)

    // 게시글 상세 페이지로 이동하는 함수
    const handleCardClick = () => {
        if (postId && onClick) {
            onClick();
        }
    };

    return (
        <div 
            className="bg-base-300 flex-shrink-0 w-full sm:w-[calc(100%/3-16px)] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={handleCardClick}
        >
            {isCustomImage ? (
                // 사용자 업로드 이미지인 경우 - 전체 영역 채우기
                <div className="h-48 overflow-hidden flex justify-center">
                    <img 
                        src={image} 
                        alt={title} 
                        className="h-full w-full transition-transform duration-500 hover:scale-105" 
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; // 무한 루프 방지
                            target.src = getLogoByIndex(postId || 0);
                        }}
                    />
                </div>
            ) : (
                // 기업 로고인 경우 - 패딩 적용 및 비율 유지
                <div className="h-48 overflow-hidden flex justify-center p-4">
                    <img 
                        src={image} 
                        alt={title} 
                        className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-105" 
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; // 무한 루프 방지
                            target.src = getLogoByIndex(postId || 0);
                        }}
                    />
                </div>
            )}
            
            <div className="p-5">
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full mb-2">
                    {tag}
                </span>
                <h3 className="text-xl font-bold mb-2 text-base-content/80">{title}</h3>
                <p className="text-base-content/45">{description}</p>
            </div>
        </div>
    );
};

// 카드 캐러셀 컴포넌트
const CardCarousel: React.FC<CardCarouselProps> = ({ cards }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const cardsPerView: number = 3;
    const maxIndex: number = Math.max(0, cards.length - cardsPerView);

    // 카드가 1개 이하면 캐러셀 기능 비활성화
    if (cards.length <= 1) {
        return (
            <div className="flex gap-4">
                {cards.map((card, index) => (
                    <Card 
                        key={index} 
                        {...card} 
                        onClick={() => {
                            if (card.postId) {
                                window.location.href = `/board/${card.postId}`;
                            }
                        }}
                    />
                ))}
            </div>
        );
    }

    const handlePrev = (): void => {
        setCurrentIndex(prev => Math.max(0, prev - cardsPerView));
    };

    const handleNext = (): void => {
        setCurrentIndex(prev => Math.min(maxIndex, prev + cardsPerView));
    };

    return (
        <div className="relative">
            <div className="">
                <div 
                    className="flex gap-4 transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * (100 / cards.length)}%)` }}
                >
                    {cards.map((card, index) => (
                        <Card 
                            key={index} 
                            {...card} 
                            onClick={() => {
                                if (card.postId) {
                                    window.location.href = `/board/${card.postId}`;
                                }
                            }}
                        />
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
    // 카드가 없는 경우 섹션 숨기기
    if (cards.length === 0) {
        return null;
    }

    return (
        <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-base-content">{title}</h2>
            <CardCarousel cards={cards} />
        </div>
    );
};

// 샘플 데이터 - 카테고리별 게시글이 없을 때 사용
const sampleCategories: CategoryData[] = [
    {
        title: "개발",
        cards: [
            {
                title: "React 팁과 트릭",
                description: "React 앱 개발 시 효율성을 높이는 10가지 팁을 소개합니다.",
                image: nvidiaLogo,
                tag: "frontend"
            },
            {
                title: "TypeScript 시작하기",
                description: "TypeScript의 기본 개념과 JavaScript에서 마이그레이션하는 방법",
                image: palantirLogo,
                tag: "typescript"
            },
            {
                title: "Node.js 성능 최적화",
                description: "Node.js 애플리케이션의 성능을 향상시키는 테크닉",
                image: appleLogo,
                tag: "backend"
            },
            {
                title: "CSS Grid 고급 기법",
                description: "CSS Grid를 활용한 복잡한 레이아웃 구현 방법",
                image: cocacolaLogo,
                tag: "css"
            },
            {
                title: "GraphQL vs REST API",
                description: "두 API 방식의 장단점과 적절한 사용 시나리오",
                image: berkshireLogo,
                tag: "api"
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
                tag: "건강"
            },
            {
                title: "재택근무 생산성 향상법",
                description: "재택근무 시 집중력과 생산성을 높이는 환경 조성 팁",
                image: amazonLogo,
                tag: "생산성"
            },
            {
                title: "개발자 번아웃 극복하기",
                description: "개발자들이 자주 겪는 번아웃 증상과 회복 방법",
                image: googleLoco,
                tag: "정신건강"
            },
            {
                title: "테크 컨퍼런스 참가 팁",
                description: "기술 컨퍼런스에서 최대한의 가치를 얻는 방법",
                image: microStrategyLogo,
                tag: "컨퍼런스"
            },
            {
                title: "개발자 책상 셋업",
                description: "생산성과 편안함을 높이는 최적의 작업 환경 구성법",
                image: netflixLogo,
                tag: "환경구성"
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
                tag: "AI"
            },
            {
                title: "블록체인 실용사례",
                description: "암호화폐 외의 블록체인 기술 활용 사례 모음",
                image: metaLogo,
                tag: "블록체인"
            },
            {
                title: "오픈소스 기여하기",
                description: "오픈소스 프로젝트에 기여하는 방법과 팁",
                image: oracleLogo,
                tag: "오픈소스"
            },
            {
                title: "기술 블로그 시작하기",
                description: "개발자로서 기술 블로그를 운영하는 이점과 시작 방법",
                image: unitedHealthLogo,
                tag: "블로깅"
            },
            {
                title: "도커 컨테이너 기초",
                description: "도커를 이용한 애플리케이션 컨테이너화 입문",
                image: walmartLogo,
                tag: "도커"
            }
        ]
    }
];

// 메인 컴포넌트
const CategoryCardLayout: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    // 카테고리 및 게시글 데이터 로드
    useEffect(() => {
        const fetchCategoriesAndPosts = async () => {
            try {
                setLoading(true);
                
                let cnt = 0;

                // 카테고리 목록 가져오기
                const categoriesResponse = await axios.get(`${API_URL}/post/categories`);
                const fetchedCategories: Category[] = categoriesResponse.data.data;
                setCategories(fetchedCategories);
                
                // 각 카테고리별 게시글 데이터 가져오기
                const categoryDataPromises = fetchedCategories.map(async (category) => {
                    // 카테고리별 게시글 목록 가져오기
                    const sortBy = "likes";
                    const postsResponse = await axios.get(
                        `${API_URL}/post/list?categoryId=${category.id}&sortBy=${sortBy}&size=5`
                    );
                    
                    const posts: Post[] = postsResponse.data.data.posts || [];
                    
                    // 게시글이 없는 경우 샘플 데이터를 사용
                    if (posts.length === 0) {
                        const sampleCategory = sampleCategories.find(
                            sample => sample.title === category.name || mapCategoryIdToTitle(category.id) === sample.title
                        );
                        
                        return {
                            title: category.name,
                            cards: sampleCategory ? sampleCategory.cards : []
                        };
                    }
                    
                    // 게시글을 카드 형식으로 변환
                    
                    const cards: Card[] = posts.map((post, index) => {
                        // 게시글 내용에서 이미지 URL 추출
                        const imageUrl = extractFirstImageUrl(post.content);
                        
                        return {
                            title: post.title,
                            // 마크다운을 텍스트로 변환하여 표시
                            description: truncateContent(convertMarkdownToText(post.content), 100),
                            // 이미지가 있으면 사용, 없으면 기본 로고 사용
                            image: imageUrl || getLogoByIndex(cnt++),
                            //image: imageUrl || targetCard[index].map(v => v.image),
                            
                            tag: post.userNm || "익명",
                            postId: post.postId
                        };
                    });
                    
                    return {
                        title: category.name,
                        cards
                    };
                });
                
                // 모든 카테고리 데이터를 병렬로 가져오기
                const fetchedCategoryData = await Promise.all(categoryDataPromises);
                setCategoryData(fetchedCategoryData);
                
            } catch (err) {
                console.error('데이터 로딩 오류:', err);
                setError('카테고리 및 게시글 데이터를 불러오는 중 오류가 발생했습니다.');
                // 오류 발생 시 샘플 데이터로 대체
                setCategoryData(sampleCategories);
            } finally {
                setLoading(false);
            }
        };
        
        fetchCategoriesAndPosts();
    }, []);

    // 카테고리 ID와 타이틀 매핑 (샘플 데이터 사용 시 필요)
    const mapCategoryIdToTitle = (categoryId: string): string => {
        switch (categoryId) {
            case 'development': return '개발';
            case 'daily': return '일상';
            case 'etc': return '기타';
            default: return categoryId;
        }
    };
    
    // 게시글 내용 길이 제한 함수
    const truncateContent = (content: string, maxLength: number): string => {
        if (content.length <= maxLength) return content;
        
        // 최대 길이로 자르고 말줄임표 추가
        return content.substring(0, maxLength) + '...';
    };

    // 로딩 중 표시
    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[400px]">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    // 오류 메시지 표시
    if (error && categoryData.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="alert alert-error">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            {categoryData.map((category, index) => (
                <CategorySection key={index} title={category.title} cards={category.cards} />
            ))}
        </div>
    );
};

export default CategoryCardLayout;