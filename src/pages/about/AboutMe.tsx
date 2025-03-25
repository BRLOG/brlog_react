import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaLaptopCode, FaPhoneAlt } from 'react-icons/fa';
import { MdLaptop } from 'react-icons/md';
import { FaBookBookmark } from 'react-icons/fa6';
import { PiCertificateDuotone } from 'react-icons/pi';
import meta_card from '../../assets/img/meta_card.png';
import { Link } from 'react-router-dom';

import './AboutMe.css';
import { RiProjectorLine } from 'react-icons/ri';

const AboutMe: React.FC = () => {
    const [activeSection, setActiveSection] = useState('about');
    const videoRef = useRef<HTMLVideoElement>(null);

    // 비디오 컨트롤을 위한 이벤트 핸들러
    const handleMouseEnter = () => {
        if (videoRef.current) {
            videoRef.current.play();
        }
    };
    
    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0; // 비디오를 처음으로 되돌립니다
        }
    };

    // 네비게이션 항목 정의
    const navItems = [
        { id: 'about', icon: <FaUser />, label: 'ABOUT ME' },
        { id: 'contact', icon: <FaPhoneAlt />, label: 'CONTACT' },
        { id: 'education', icon: <FaBookBookmark />, label: 'EDUCATION' },
        { id: 'certificate', icon: <PiCertificateDuotone />, label: 'CERTIFICATE' },
        { id: 'skills', icon: <FaLaptopCode />, label: 'SKILLS' },
        { id: 'career', icon: <MdLaptop />, label: 'CAREER' },
        { id: 'projects', icon: <RiProjectorLine />, label: 'PROJECTS' }
    ];

    // 해당 섹션으로 스크롤하는 함수
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(id);
        }
    };

    // 스크롤 이벤트 리스너로 현재 보고 있는 섹션 감지
    useEffect(() => {
        const handleScroll = () => {
            const sections = navItems.map(item => document.getElementById(item.id));
            let currentSection = 'about';

            sections.forEach(section => {
                if (section) {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= 150 && rect.bottom >= 150) {
                        currentSection = section.id;
                    }
                }
            });

            setActiveSection(currentSection);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // 초기 로드 시 현재 섹션 설정

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="bg-base-100 relative max-w-[1200px] mx-auto py-20 px-4 text-neutral-700 leading-relaxed font-['Noto_Sans_KR']">
            {/* 우측 고정 네비게이션 메뉴 */}
            <div className="hidden lg:flex flex-col fixed right-8 top-1/2 -translate-y-1/2 z-50">
                <div className="bg-base-100 shadow-lg rounded-lg p-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={`flex items-center justify-center p-2 mb-2 rounded-full w-10 h-10 group relative transition-all duration-300 ${activeSection === item.id
                                    ? 'bg-primary text-primary-content hover:text-base-content'
                                    : 'hover:bg-base-200 text-base-content'
                                }`}
                        >
                            <span>{item.icon}</span>
                            <span className="absolute right-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap bg-base-100 shadow-md px-2 py-1 rounded-md text-sm">
                                {item.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-24 mb-24 border-b border-base-content/20">
                {/* ABOUT ME 섹션 */}
                <section id="about">
                    <h2 className="flex items-center text-2xl font-bold mb-10 title-text">
                        <FaUser className="mr-2" /> ABOUT ME
                    </h2>
                    <p className="mb-2 text-base-content">안녕하세요.</p>
                    <p className="mb-2 text-base-content">도전정신과 책임감의 의미를 아는 웹 개발자 안병렬입니다.</p>
                    <p className="mb-2 text-base-content">'노력하면 못할 건 없다.'는 신념을 갖고</p>
                    <p className="mb-2 text-base-content">항상 겸손하며 배려의 자세로 개발에 임하고 있습니다.</p>
                    <p className="mb-2 text-base-content">매사 책임감을 다하여 많이 듣고, 볼 수 있도록 두 발로 뛰겠습니다.</p>
                </section>

                {/* CONTACT 섹션 */}
                <section id="contact">
                    <h2 className="flex items-center text-2xl font-bold mb-6 title-text">
                        <FaPhoneAlt className="mr-2" /> CONTACT
                    </h2>

                    {/* <img src={meta_card} alt="명함" className="w-80 h-48 border border-base-content mb-2" /> */}

                    <div className="flex mb-2">
                        <span className="w-24 font-medium text-base-content">Email</span>
                        <a href="mailto:ahnbl0305@gmail.com" className="text-primary no-underline hover:underline">ahnbl0305@gmail.com</a>
                    </div>
                    <div className="flex pb-6">
                        <span className="w-24 font-medium text-base-content">Github</span>
                        <a href="https://github.com/abl0305" target="_blank" rel="noopener noreferrer" className="text-primary no-underline hover:underline">https://github.com/abl0305</a>
                    </div>
                </section>
            </div>

            {/* EDUCATION 섹션 */}
            <section id="education" className="mb-12">
                <h2 className="flex items-center text-2xl font-bold mb-10 title-text">
                    <FaBookBookmark className="mr-2" /> EDUCATION
                </h2>
                <div className="pb-4 mb-4">
                    <div className="text-base-content mb-1">2013 - 2020</div>
                    <div className="text-base-content/60 font-medium mb-1">강남대학교 컴퓨터공학과(미디어공학 복수전공)</div>
                    <div className="text-base-content/60">3.47 / 4.5</div>
                </div>

                <div className="pb-24 mb-24 border-b border-base-content/20">
                    <div className="text-base-content mb-1">2020.02 - 2020.07</div>
                    <div className="text-base-content/60 font-medium mb-1">솔데스크 교육이수</div>
                    <div className="text-base-content/60">오픈소스 자바 파이썬 R을 활용한 빅데이터 분석과정 B</div>
                </div>
            </section>

            {/* CERTIFICATE 섹션 */}
            <section id="certificate" className="mb-12">
                <h2 className="flex items-center text-2xl font-bold mb-10 title-text">
                    <PiCertificateDuotone className="mr-2" /> CERTIFICATE
                </h2>
                <div className="pb-4 mb-4">
                    <div className="text-base-content mb-1">2020.07</div>
                    <div className="text-base-content/60 font-medium mb-1">리눅스마스터 2급</div>
                    <div className="text-base-content/60">한국정보통신진흥협회</div>
                </div>

                <div className="pb-24 mb-24 border-b border-base-content/20">
                    <div className="text-base-content mb-1">2019.06</div>
                    <div className="text-base-content/60 font-medium mb-1">정보처리기사</div>
                    <div className="text-base-content/60">한국산업인력공단</div>
                </div>
            </section>

            {/* SKILLS 섹션 */}
            <section id="skills" className="mb-12">
                <h2 className="flex items-center text-2xl font-bold mb-10 title-text">
                    <FaLaptopCode className="mr-2" /> SKILLS
                </h2>
                <div className="mb-6">
                    <h3 className="text-base-content text-2xl font-semibold mb-2">Backend</h3>
                    <h5 className="text-base-content/70 text-base font-semibold mb-2">언어 및 프레임워크</h5>
                    <ul className="text-base-content/60 list-disc pl-5">
                        <li className="mb-1">언어: Java, Python</li>
                        <li className="mb-1">프레임워크: Spring Boot, Spring Cloud Eureka, Spring Cloud Gateway</li>
                        <li className="mb-1">데이터 접근: JPA, Mybatis</li>
                        <li className="mb-1">API 개발: REST API, GraphQL</li>
                        <li className="mb-1">템플릿 엔진: Thymeleaf</li>
                    </ul>
                    <h5 className="text-base-content/70 text-base font-semibold mb-2">데이터베이스</h5>
                    <ul className="text-base-content/60 list-disc pl-5">
                        <li className="mb-1">관계형 DB: MySQL, MSSQL, Oracle, PostgreSQL</li>
                        <li className="mb-1">캐싱/NoSQL: Redis, Firebase(Authentication)</li>
                    </ul>
                    <h5 className="text-base-content/70 text-base font-semibold mb-2">문서 처리</h5>
                    <ul className="text-base-content/60 list-disc pl-5">
                        <li className="mb-1">엑셀 처리 라이브러리: Apache POI, JXL(WritableSheet), GCExcel</li>
                        <li className="mb-1">문서 제작/처리 도구: JasperReport + iReport, OpenCSV, iText(PDF)</li>
                    </ul>
                    <h5 className="text-base-content/70 text-base font-semibold mb-2">기타</h5>
                    <ul className="text-base-content/60 list-disc pl-5">
                        <li className="mb-1">보안: Spring Security</li>
                        <li className="mb-1">인증/인가: OAuth2, JWT</li>
                    </ul>
                </div>

                <div className="mb-6">
                <h3 className="text-base-content text-2xl font-semibold mb-2">Frontend</h3>
                    <ul className="text-base-content/60 list-disc pl-5">
                        <li className="mb-1">마크업/스타일링: HTML/CSS, TailwindCSS, Bootstrap, DaisyUI, Semantic UI, AXISJ, </li>
                        <li className="mb-1">언어: Javascript (ES6+), TypeScript</li>
                        <li className="mb-1">라이브러리/프레임워크: React, Next.js, JQuery</li>
                        <li className="mb-1">빌드도구: Vite</li>
                        <li className="mb-1">UI 컴포넌트/그리드: AUIGrid, DevExtreme, SpreadJS</li>
                    </ul>
                </div>

                <div className="mb-6">
                <h3 className="text-base-content text-2xl font-semibold mb-2">DevOps & Infra</h3>
                    <ul className="text-base-content/60 list-disc pl-5">
                        <li className="mb-1">클라우드: AWS(EC2, RDS, S3)</li>
                        <li className="mb-1">컨테이너화: Docker</li>
                        <li className="mb-1">CI/CD: Jenkins</li>
                        <li className="mb-1">웹서버/프록시: Nginx</li>
                        <li className="mb-1">아티팩트 저장소: Nexus</li>
                        <li className="mb-1">모니터링: Pinpoint</li>
                    </ul>
                </div>

                <div className="mb-6">
                <h3 className="text-base-content text-2xl font-semibold mb-2">버전 관리 및 협업 도구</h3>
                    <ul className="text-base-content/60 list-disc pl-5">
                        <li className="mb-1">버전 관리: Git, GitHub, SVN</li>
                        <li className="mb-1">협업 도구: Notion</li>
                        <li className="mb-1">API 테스트: Postman</li>
                    </ul>
                </div>

                <div className="pb-24 mb-24 border-b border-base-content/20">
                <h3 className="text-base-content text-2xl font-semibold mb-2">기타 도구/플랫폼</h3>
                    <ul className="text-base-content/60 list-disc pl-5">
                        <li className="mb-1">모바일 개발: Android Studio</li>
                        <li className="mb-1">데이터 분석: Python, Anaconda</li>
                    </ul>
                </div>
            </section>

            {/* CAREER 섹션 */}
            <section id="career" className="mb-12">
                <h2 className="flex items-center text-2xl font-bold mb-10 title-text">
                    <MdLaptop className="mr-2" /> CAREER
                </h2>

                <div className="pb-6 mb-6 border-b border-base-content/20">
                    <div className="text-base-content mb-1">2021.09 - 현재</div>
                    <div className="text-base-content/60 font-medium mb-1">로그인네트웍</div>
                    <div className="text-base-content/40 mb-6">웹 개발자</div>
                    <ul className="text-base-content/60 list-disc pl-5">
                        <li className="mb-1 text-base-content/80">물류 프로그램 유지 보수 및 고객, 팀 요청 사항 개발</li>
                            * &nbsp;배차, 청구, 수금, 지급 관리(배차 건 단위, 화물단위)<br/>
                            * &nbsp;인수증, 내역서 등의 출력물 관리<br/>
                            * &nbsp;대용량 건 업로드(엑셀보드)<br/>
                            * &nbsp;세금계산서 관리<br/>
                            * &nbsp;물류 통관 업체 특성 상 대용량 데이터 조회, 처리가 많음에 따라<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;SQL 튜닝 및 각 프로젝트들 로그 축소 및 실행 계획, 로그 축소 등의 데이터 관리<br/>
                        <li className="mb-1 text-base-content/80">통관 프로그램 유지 보수 및 고객, 팀 요청 사항 개발</li>
                        <li className="mb-1 text-base-content/80">특송 프로그램 메인 개발 및 유지 보수</li>
                            * &nbsp;엑셀 대량 업로드(Apache poi) 처리<br/>
                            * &nbsp;택배사 접수(REST API, CJ, 경동, 한진, 우리)<br/>
                            * &nbsp;접수, 입고, 출고 관리, QnA 게시판<br/>
                            * &nbsp;운송장 출력(Apache poi)<br/>
                        <li className="mb-1 text-base-content/80">통합 프로그램 메인 개발(화주 포워더 물류 통관)</li>
                            * &nbsp;관세사(DB TO DB), 관세청(API) 데이터 동기화<br/>
                            * &nbsp;통합 플랫폼 선적 데이터 관리 페이지 개발<br/>
                        <li className="mb-1 text-base-content/80">사용 언어</li>
                            * &nbsp;프론트엔드 - HTML5, CSS3, Javascript<br/>
                            * &nbsp;백엔드 - Spring, Spring Boot, MSSQL<br/>
                            * &nbsp;컴포넌트 - AUIGrid<br/>
                            * &nbsp;프레임워크 - Spring Boot, semantic ui, mybatis<br/>
                            * &nbsp;빌드환경 - gradle, maven<br/>
                            * &nbsp;Spring Cloud Eureka, Spring Cloud Gateway<br/>
                            * &nbsp;기타 환경 - Jenkins, AWS, NEXUS, SVN<br/>
                    </ul>
                </div>

                <div className="pb-24 mb-24 border-b border-base-content/20">
                    <div className="text-base-content mb-1">2020.10 - 2021.03</div>
                    <div className="text-base-content/60 font-medium mb-1">갈렙에이비씨</div>
                    <div className="text-base-content/40 mb-6">R&D 연구소 웹개발자</div>
                    <ul className="text-base-content/60 list-disc pl-5">
                        <li className="mb-1 text-base-content/80">병원에서 사용하는 원가계산 솔루션 개발 및 유지보수</li>
                        <li className="mb-1 text-base-content/80">기존 VB 소스로 제작되어 있던 솔루션을 웹으로 전환</li>
                        <li className="mb-1 text-base-content/80">사용 언어</li>
                            * 프론트엔드 - HTML5, CSS3, Javascript<br/>
                            * 백엔드 - Spring, Spring Boot, Oracle, PostgreSQL<br/>
                            * 컴포넌트 - devExtreme 컴포넌트의 tree, grid<br/>
                    </ul>
                </div>
            </section>

            {/* PROJECTS 섹션 */}
            <section id="projects" className="mb-12">
                <h2 className="flex items-center text-2xl font-bold mb-10 title-text">
                    <RiProjectorLine className="mr-2" /> PROJECTS
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-24 mb-24 border-b border-base-content/20">
                    
                    {/* 프로젝트 1: BRLOG 프로젝트 */}
                    <Link to="/projects/brlog" className="group">
                        <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                            <figure className="relative overflow-hidden h-[500px] bg-base-100">
                                <img 
                                    src="src/assets/img/projects/brlog-thumbnail.png" 
                                    alt="BRLOG 프로젝트" 
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-white font-semibold">상세보기</span>
                                </div>
                            </figure>
                            <div className="card-body p-4">
                                <h3 className="card-title text-lg text-base-content">BRLOG - 블로그</h3>
                                <p className="text-sm text-base-content/60">2025.03 - </p>
                            </div>
                        </div>
                    </Link>

                    {/* 프로젝트 2: 간편식 쇼핑몰 */}
                    <Link to="/projects/kkobok" className="group">
                        <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                            <figure className="relative overflow-hidden h-[500px] bg-base-100">
                                <img 
                                    src="src/assets/img/projects/kkobok-thumbnail.png" 
                                    alt="꼬박꼬밥 프로젝트" 
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-white font-semibold">상세보기</span>
                                </div>
                            </figure>
                            <div className="card-body p-4">
                                <h3 className="card-title text-lg text-base-content">꼬박꼬밥 - 간편식 쇼핑몰</h3>
                                <p className="text-sm text-base-content/60">2020.06 - 2020.07</p>
                            </div>
                        </div>
                    </Link>

                    {/* 프로젝트 3: 음식 객체 인식 냉장고 어플 */}
                    <Link to="/projects/smart-refrigerator" className="group">
                        <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                            <figure className="relative overflow-hidden h-[500px] bg-base-100">
                                <img 
                                    src="src/assets/img/projects/smart-fridge-thumbnail.png" 
                                    alt="스마트 냉장고 프로젝트" 
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-white font-semibold">상세보기</span>
                                </div>
                            </figure>
                            <div className="card-body p-4">
                                <h3 className="card-title text-lg text-base-content">스마트 냉장고 - 객체 인식 어플</h3>
                                <p className="text-sm text-base-content/60">2019.09 - 2019.12</p>
                            </div>
                        </div>
                    </Link>
              
                    {/* 프로젝트 4: MFC 테트리스 */}
                    <Link to="/projects/tetris" className="group">
                        <div 
                            className="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300 h-full"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <figure className="relative overflow-hidden h-[500px] bg-base-100">
                                <video 
                                    ref={videoRef}
                                    src="src/assets/img/projects/tetris-video.mp4" 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    muted
                                    loop
                                    playsInline
                                />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-white font-semibold">상세보기</span>
                                </div>
                            </figure>
                            <div className="card-body p-4">
                                <h3 className="card-title text-lg text-base-content">MFC 테트리스 게임</h3>
                                <p className="text-sm text-base-content/60">2017.11 - 2017.12</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default AboutMe;