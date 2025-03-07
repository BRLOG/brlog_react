import React, { useState, useEffect } from 'react';

import slide1 from '../../assets/img/slide/slide1.png';
import slide2 from '../../assets/img/slide/slide2.png';
import slide3 from '../../assets/img/slide/slide3.png';

// 슬라이드 데이터 인터페이스
interface Slide {
    id: number;
    image: string;
    tag: string;
    title: string;
}

const FeatureCarousel: React.FC = () => {
    // 슬라이드 데이터 배열
    const slides: Slide[] = [
        {
            id: 1,
            image: slide1,
            tag: "Deep Learning",
            title: "생체 분자 과학을 위한 대규모 파운데이션 모델, 이제 NVIDIA BioNeMo를 통해 사용 가능"
        },
        {
            id: 2,
            image: slide2,
            tag: "Generative AI",
            title: "통신 업계의 AI 트렌드에 관한 NVIDIA 설문 조사"
        },
        {
            id: 3,
            image: slide3,
            tag: "Generative AI",
            title: "중요 인프라 보호를 위해 NVIDIA 사이버 보안 AI 체택한 선도적인 파트너"
        }
    ];

    const [activeSlide, setActiveSlide] = useState<number>(0);
    const totalSlides: number = slides.length;

    // 슬라이드 변경 함수
    const goToSlide = (index: number): void => {
        setActiveSlide(index);
    };

    // 이전 슬라이드로 이동
    const prevSlide = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    // 다음 슬라이드로 이동
    const nextSlide = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        setActiveSlide((prev) => (prev + 1) % totalSlides);
    };

    // 자동 슬라이드 전환
    useEffect(() => {
        const timer = setTimeout(() => {
            setActiveSlide((prev) => (prev + 1) % totalSlides);
        }, 5000); // 5초마다 슬라이드 변경

        return () => clearTimeout(timer);
    }, [activeSlide, totalSlides]);

    return (
        <div className="w-full bg-base-100">
            <div className="relative overflow-hidden h-[500px]">
                {/* 슬라이드 컨테이너 */}
                <div 
                    className="flex transition-transform duration-1000 h-full"
                    style={{ width: `${slides.length * 100}%`, transform: `translateX(-${activeSlide * (100 / slides.length)}%)` }}
                >
                    {slides.map((slide, index) => (
                        <div 
                            key={slide.id} 
                            className="relative w-full h-full" 
                            style={{ width: `${100 / slides.length}%` }}
                        >
                            <div 
                                className="w-full h-full bg-cover bg-center"
                                style={{ backgroundImage: `url(${slide.image})` }}
                            >
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-8">
                                    <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-sm inline-block w-fit mb-3">
                                        {slide.tag}
                                    </span>
                                    <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-8 max-w-3xl">
                                        {slide.title}
                                    </h2>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 이전/다음 버튼 */}
                <button
                    onClick={prevSlide}
                    className="absolute left-5 top-1/2 -translate-y-1/2 btn btn-circle bg-black/30 border-none text-white hover:bg-black/50"
                    aria-label="이전 슬라이드"
                >
                    ❮
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-5 top-1/2 -translate-y-1/2 btn btn-circle bg-black/30 border-none text-white hover:bg-black/50"
                    aria-label="다음 슬라이드"
                >
                    ❯
                </button>

                {/* 인디케이터 점 */}
                {/* <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={(e) => {
                                e.preventDefault();
                                goToSlide(index);
                            }}
                            className={`w-3 h-3 rounded-full ${
                                activeSlide === index ? 'bg-white' : 'bg-white/50'
                            }`}
                            aria-label={`슬라이드 ${index + 1}로 이동`}
                        />
                    ))}
                </div> */}
            </div>
        </div>
    );
};

export default FeatureCarousel;