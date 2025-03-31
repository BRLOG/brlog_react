import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaGithub, FaCalendarAlt, FaUsers, FaTasks, FaTimes } from 'react-icons/fa';

import brlog_thumbnail from '../../assets/img/projects/brlog-thumbnail.png';
import brlog_1 from '../../assets/img/projects/brlog-1.png';
import brlog_2 from '../../assets/img/projects/brlog-2.png';
import brlog_3 from '../../assets/img/projects/brlog-3.png';
import brlog_4 from '../../assets/img/projects/brlog-4.png';
import brlog_5 from '../../assets/img/projects/brlog-5.png';
import brlog_6 from '../../assets/img/projects/brlog-6.png';
import brlog_7 from '../../assets/img/projects/brlog-7.png';
import kkobok_thumbnail from '../../assets/img/projects/kkobok-thumbnail.png';
import kkobok_1 from '../../assets/img/projects/kkobok-1.png';
import kkobok_2 from '../../assets/img/projects/kkobok-2.png';
import smart_fridge_thumbnail from '../../assets/img/projects/smart-fridge-thumbnail.png';
import smart_fridge_1 from '../../assets/img/projects/smart-fridge-1.png';
import smart_fridge_2 from '../../assets/img/projects/smart-fridge-2.png';
import smart_fridge_3 from '../../assets/img/projects/smart-fridge-3.png';
import smart_fridge_4 from '../../assets/img/projects/smart-fridge-4.png';
import smart_fridge_5 from '../../assets/img/projects/smart-fridge-5.png';
import smart_fridge_6 from '../../assets/img/projects/smart-fridge-6.png';
import tetris_video from '../../assets/img/projects/tetris-video.mp4';
import tetris_thumbnail from '../../assets/img/projects/tetris-thumbnail.png';
import tetris_1 from '../../assets/img/projects/tetris-1.png';
import tetris_2 from '../../assets/img/projects/tetris-2.png';
import tetris_3 from '../../assets/img/projects/tetris-3.png';

interface Project {
    title: string;
    period: string;
    thumbnail: string;
    github: string;
    description: string;
    myRole: string;
    mainFeatures: string[];
    techStack: string[];
    images: string[];
    challenges: string;
    achievements: string;
    hasVideo?: boolean; // 선택적 속성
    videoSrc?: string;  // 선택적 속성
}

// 프로젝트 데이터
const projectsData: Record<string, Project> = {
    'brlog': {
        title: 'brlog - 블로그(brlog.site)',
        period: '2025.03 - ',
        thumbnail: brlog_thumbnail,
        github: 'https://github.com/BRLOG',
        description: '개인 정리 및 기록들을 남길 수 있는 블로그 사이트를 제작했습니다. 실험실 탭을 통해 구현하고 싶은 기술들을 자유롭게 구현 및 테스트 하는 것을 목표로 합니다.',
        myRole: '프로젝트 전체 제작',
        mainFeatures: [
            '게시글 작성(Markdown) 및 조회',
            '게시글 상세 컨트롤(좋아요, 댓글)',
            'BR탭 - 프로필 정보',
            '실험실',
            ' > GraphQL 연동 및 테스트',
            ' > 토스 결제 연동',
            ' > gemini를 통한 게시글 초안 작성',
            ' > Stability AI를 통한 이미지 생성(image to image, text to image, 프롬프트)',
            ' > 메시지 큐(Message Queue - Kafka, RabbitMQ) 단순 구현',
        ],
        techStack: ['Vite', 'TailwindCSS', 'DaisyUI', 'React', 'TypeScript', 'Spring Boot', 'Java', 'OAuth2', 'Docker', 'Redis', 'MySQL', 'AWS(EC2, RDS)', 'nginx', 'Kafka', 'RabbitMQ', 'graphQL', 'API(gemini-pro, Stability AI, toss payments)'],
        images: [
            brlog_1,
            brlog_2,
            brlog_3,
            brlog_4,
            brlog_5,
            brlog_6,
            brlog_7,
        ],
        challenges: '처음 사용하는 언어, API들에 대해 이해하는 것과 프로젝트에서 구현하는 것이 이 brlog 프로젝트의 목표입니다.',
        achievements: '무엇보다 실험실 탭을 통해 평소 접하기 어려웠던 기술들을 직접 구현하고 적용해보면서 개발자로서의 짜릿한 성취감과 지속적인 재미를 느낄 수 있었습니다. 이론적으로만 알고 있던 개념을 실제로 구현해보는 과정에서 더 깊은 이해를 얻었고, 새로운 기술에 대한 두려움 대신 호기심과 도전 의식을 키울 수 있었습니다. 이러한 경험은 단순한 기술 습득을 넘어 개발자로서의 자신감과 문제 해결 능력을 크게 향상시켰습니다.'
    },
    'kkobok': {
        title: '꼬박꼬밥 - 간편식 쇼핑몰',
        period: '2020.06 - 2020.07 (2개월)',
        thumbnail: kkobok_thumbnail,
        github: 'https://github.com/master966/team1_v2s4m3c',
        description: '간편식 쇼핑몰 웹사이트로 6인 팀 프로젝트입니다. 회원가입, 로그인, 쇼핑몰 기능, 리뷰 및 QnA, 레시피 게시판 등 다양한 기능을 구현했습니다.',
        myRole: '레시피 게시판 제작을 담당했으며, 게시글 CRUD, 카테고리 관리, 별점 및 댓글 기능을 구현했습니다.',
        mainFeatures: [
            '레시피 게시판 (등록, 조회, 수정, 삭제)',
            '카테고리 그룹 및 카테고리 관리',
            '별점 시스템 및 댓글 기능',
            'Ajax 통신을 활용한 동적 페이지 구현',
            '파일 업로드 및 썸네일 이미지 처리'
        ],
        techStack: ['Java', 'Spring', 'MyBatis', 'HTML/CSS', 'JavaScript', 'Oracle', 'Maven'],
        images: [
            kkobok_1,
            kkobok_2
        ],
        challenges: '팀원들과의 협업에서 초반 UI, DB 설계 과정에서 의견 통합이 어려웠지만, 적극적인 소통으로 해결하였습니다. 또한 처음 접해보는 웹 개발 언어와 기술에 적응하며 프로젝트를 완성해 나가는 과정이 큰 도전이었습니다.',
        achievements: '프로젝트를 통해 팀 협업의 중요성을 배우고, 웹 개발의 전체적인 프로세스를 이해할 수 있었습니다. 특히 Ajax를 활용한 비동기 통신 처리와 파일 업로드 기능 구현을 통해 실력이 크게 향상되었습니다.'
    },
    'smart-refrigerator': {
        title: '스마트 냉장고 - 객체 인식 어플',
        period: '2019.09 - 2019.12 (4개월)',
        thumbnail: smart_fridge_thumbnail,
        github: '',
        description: 'TensorFlow Object Detection을 활용한 식품 인식 어플리케이션입니다. 사용자가 식품을 촬영하면 자동으로 인식하여 냉장고 앱에 추가하는 기능을 구현했습니다.',
        myRole: '앱 개발 및 학습 모델 구현을 담당했습니다. Android Studio를 사용하여 모바일 앱을 개발하고, TensorFlow로 객체 인식 모델을 훈련시켰습니다.',
        mainFeatures: [
            '식품 사진 촬영 및 객체 인식',
            '인식된 식품 자동 저장 및 관리',
            'Firebase 인증 통합',
            '로컬 데이터 관리 (SharedPreferences)'
        ],
        techStack: ['Android', 'Java', 'Python', 'TensorFlow', 'Firebase', 'Object Detection'],
        images: [
            smart_fridge_1,
            smart_fridge_2,
            smart_fridge_3,
            smart_fridge_4,
            smart_fridge_5,
            smart_fridge_6,
        ],
        challenges: 'Object Detection API 초기 환경 설정과 모델 훈련을 위한 충분한 데이터셋 확보가 어려웠습니다. 특히 여러 식품 항목을 정확하게 인식시키기 위해 모델 파라미터 조정에 많은 시간이 소요되었습니다.',
        achievements: '이 프로젝트를 통해 머신러닝과 모바일 앱 개발에 대한 깊은 이해를 얻었으며, 실생활에 활용할 수 있는 문제 해결형 앱을 개발하는 경험을 쌓았습니다.'
    },
    'tetris': {
        title: 'MFC 테트리스 게임',
        period: '2017.11 - 2017.12 (4주)',
        thumbnail: tetris_thumbnail,
        hasVideo: true,
        videoSrc: tetris_video,
        github: '',
        description: 'C와 MFC를 활용하여 개발한 테트리스 게임입니다. 다양한 게임 기능과 인터페이스를 구현하였습니다.',
        myRole: '테트리스 알고리즘 설계 및 구현, MFC를 활용한 그래픽 인터페이스 개발을 담당했습니다.',
        mainFeatures: [
            '다음 블록 미리보기 및 블록 홀드 기능',
            '점수 시스템 및 속도 증가 알고리즘',
            'T-Spin, Shadow, Space Drop 등 고급 기능 구현',
            '무한 테트리스 모드'
        ],
        techStack: ['C', 'MFC', '게임 알고리즘', 'Windows API'],
        images: [
            tetris_1,
            tetris_2,
            tetris_3,
        ],
        challenges: '테트리스 게임의 각 기능별 알고리즘을 설계하고, 이를 그래픽 인터페이스와 연결하는 과정이 복잡했습니다. 특히 블록 회전 시 충돌 감지와, T-Spin 기능 구현이 어려웠습니다.',
        achievements: '게임 알고리즘과 그래픽 인터페이스 개발에 대한 기초를 다질 수 있었으며, 복잡한 문제를 논리적으로 해결하는 능력이 향상되었습니다.'
    }
};

const ProjectDetail: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const project = projectsData[projectId as keyof typeof projectsData];
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);

    // 이미지 모달을 위한 상태 추가
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // 페이지 로드 시 상단으로 스크롤
        window.scrollTo(0, 0);
    }, [projectId]);

    // 이미지 모달 열기 함수
    const openImageModal = (imageSrc: string) => {
        setSelectedImage(imageSrc);
        setIsModalOpen(true);
        // 모달이 열릴 때 스크롤 방지
        document.body.style.overflow = 'hidden';
    };

    // 이미지 모달 닫기 함수
    const closeImageModal = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
        // 모달이 닫힐 때 스크롤 복원
        document.body.style.overflow = 'auto';
    };

    const handleBackToPortfolio = () => {
        navigate('/about');
        // 페이지 이동 후 약간의 지연 시간을 주고 스크롤
        setTimeout(() => {
            const projectsSection = document.getElementById('projects');
            if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    if (!project) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-primary/40">
                    <h1 className="text-2xl font-bold mb-4">프로젝트를 찾을 수 없습니다</h1>
                    <button onClick={handleBackToPortfolio} className="btn btn-ghost gap-2">
                        <FaArrowLeft /> 포트폴리오로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* 상단 네비게이션 */}
            <div className="mb-8">
                <button onClick={handleBackToPortfolio} className="btn btn-ghost gap-2">
                    <FaArrowLeft /> 포트폴리오로 돌아가기
                </button>
            </div>

            {/* 프로젝트 헤더 */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold mb-2 text-base-content">{project.title}</h1>
                <div className="flex flex-wrap items-center gap-4 mb-4 text-base-content/60">
                    <div className="flex items-center gap-1">
                        <FaCalendarAlt />
                        <span>{project.period}</span>
                    </div>
                    {project.github && (
                        <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary hover:underline"
                        >
                            <FaGithub />
                            <span>GitHub</span>
                        </a>
                    )}
                </div>
            </div>

            {/* 프로젝트 이미지/비디오 */}
            <div className="mb-10">
                {project.hasVideo ? (
                    <video
                        ref={videoRef}
                        src={project.videoSrc}
                        className="w-full object-contain h-[500px] rounded-lg shadow-lg mb-4"
                        muted
                        loop
                        playsInline
                        autoPlay
                        controls
                    />
                ) : (
                    <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full object-contain h-[500px] rounded-lg shadow-lg mb-4 cursor-pointer"
                        onClick={() => openImageModal(project.thumbnail)}
                    />
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.images.map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`${project.title} 스크린샷 ${idx + 1}`}
                            className="w-full object-contain h-[300px] rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => openImageModal(img)}
                        />
                    ))}
                </div>
            </div>

            {/* 프로젝트 개요 */}
            <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-primary/40">프로젝트 개요</h2>
                <p className="mb-4 text-base-content/80 leading-relaxed whitespace-pre-line">
                    {project.description}
                </p>
            </div>

            {/* 담당 역할 */}
            <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-primary/40">담당 역할</h2>
                <p className="mb-4 text-base-content/80 leading-relaxed whitespace-pre-line">
                    {project.myRole}
                </p>
            </div>

            {/* 주요 기능 */}
            <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-primary/40">주요 기능</h2>
                <ul className="list-disc pl-5 space-y-2 text-base-content/80">
                    {project.mainFeatures.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                    ))}
                </ul>
            </div>

            {/* 기술 스택 */}
            <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-primary/40">사용 기술</h2>
                <div className="flex flex-wrap gap-2 text-base-content/80">
                    {project.techStack.map((tech, idx) => (
                        <span
                            key={idx}
                            className="badge badge-lg badge-outline p-3"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            </div>

            {/* 도전 과제 */}
            <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-primary/40">도전 과제</h2>
                <p className="mb-4 text-base-content/80 leading-relaxed whitespace-pre-line">
                    {project.challenges}
                </p>
            </div>

            {/* 성과 */}
            <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-primary/40">성과 및 배운 점</h2>
                <p className="mb-4 text-base-content/80 leading-relaxed whitespace-pre-line">
                    {project.achievements}
                </p>
            </div>

            {/* 이미지 모달 */}
            {isModalOpen && selectedImage && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    onClick={closeImageModal}
                >
                    <div
                        className="relative w-full h-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedImage}
                            alt="확대된 이미지"
                            className="w-auto h-auto max-w-[90vw] max-h-[90vh] object-contain"
                            style={{ minWidth: '50vw', minHeight: '50vh' }} // 최소 크기 설정
                        />
                        <button
                            className="absolute top-3 right-3 text-white bg-black/50 hover:bg-black/70 p-2 rounded-full transition-colors"
                            onClick={closeImageModal}
                            aria-label="닫기"
                        >
                            <FaTimes size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetail;