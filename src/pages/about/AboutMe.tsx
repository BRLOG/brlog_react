import React, { useState, useEffect } from 'react';
import { FaUser, FaLaptopCode, FaPhoneAlt } from 'react-icons/fa';
import { MdLaptop } from 'react-icons/md';
import { FaBookBookmark } from 'react-icons/fa6';
import { PiCertificateDuotone } from 'react-icons/pi';
import meta_card from '../../assets/img/meta_card.png';

import './AboutMe.css';

const AboutMe: React.FC = () => {
    const [activeSection, setActiveSection] = useState('about');

    // 네비게이션 항목 정의
    const navItems = [
        { id: 'about', icon: <FaUser />, label: 'ABOUT ME' },
        { id: 'contact', icon: <FaPhoneAlt />, label: 'CONTACT' },
        { id: 'education', icon: <FaBookBookmark />, label: 'EDUCATION' },
        { id: 'certificate', icon: <PiCertificateDuotone />, label: 'CERTIFICATE' },
        { id: 'skills', icon: <FaLaptopCode />, label: 'SKILLS' },
        { id: 'career', icon: <MdLaptop />, label: 'CAREER' }
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
        <div className="relative max-w-[1200px] mx-auto py-20 px-4 text-neutral-700 leading-relaxed font-['Noto_Sans_KR']">
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

                    <img src={meta_card} alt="명함" className="w-80 h-48 border border-base-content mb-2" />

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
                    <div className="text-base-content mb-1">2013-2020</div>
                    <div className="text-base-content/60 font-medium mb-1">강남대학교 컴퓨터공학과(미디어공학 복수전공)</div>
                    <div className="text-base-content/60">3.47 / 4.5</div>
                </div>

                <div className="pb-24 mb-24 border-b border-base-content/20">
                    <div className="text-base-content mb-1">2019</div>
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
                    <h3 className="text-base-content text-lg font-semibold mb-2">Backend</h3>
                    <ul className="text-base-content/60 list-disc pl-5">
                        <li className="mb-1">Node.js (Express)</li>
                        <li className="mb-1">Javascript (ES6+), Typescript</li>
                        <li className="mb-1">MySQL, Sequelize, AWS RDS</li>
                        <li className="mb-1">AWS EC2, AWS S3</li>
                    </ul>
                </div>

                <div className="mb-6">
                    <h3 className="text-base-content text-lg font-semibold mb-2">Frontend</h3>
                    <ul className="text-base-content/60 list-disc pl-5">
                        <li className="mb-1">HTML5, CSS3, Javascript (ES6+), Typescript</li>
                        <li className="mb-1">React, Next.js</li>
                        <li className="mb-1">TailwindCSS</li>
                    </ul>
                </div>

                <div className="pb-24 mb-24 border-b border-base-content/20">
                    <h3 className="text-base-content text-lg font-semibold mb-2">Tools</h3>
                    <ul className="text-base-content/60 list-disc pl-5">
                        <li className="mb-1">Git, GitHub</li>
                        <li className="mb-1">Slack, Notion, Jetbrain Space</li>
                        <li className="mb-1">Webstorm, VSCode, Vim</li>
                        <li className="mb-1">Postman</li>
                        <li className="mb-1">Sentry</li>
                    </ul>
                </div>
            </section>

            {/* CAREER 섹션 */}
            <section id="career" className="mb-12">
                <h2 className="flex items-center text-2xl font-bold mb-10 title-text">
                    <MdLaptop className="mr-2" /> CAREER
                </h2>

                <div className="pb-6 mb-6 border-b border-base-content/20">
                    <div className="text-base-content mb-1">2023.01 - 현재</div>
                    <div className="text-base-content/60 font-medium mb-1">ABC 기업</div>
                    <div className="text-base-content/40 mb-2">웹 개발자</div>
                    <ul className="text-base-content/40 list-disc pl-5">
                        <li className="mb-1">React와 Node.js를 사용한 웹 애플리케이션 개발</li>
                        <li className="mb-1">AWS 인프라 설정 및 관리</li>
                        <li className="mb-1">데이터베이스 설계 및 최적화</li>
                    </ul>
                </div>

                <div className="pb-24 mb-24 border-b border-base-content/20">
                    <div className="text-base-content mb-1">2022.03 - 2022.12</div>
                    <div className="text-base-content/60 font-medium mb-1">XYZ 스타트업</div>
                    <div className="text-base-content/40 mb-2">프론트엔드 개발자 인턴</div>
                    <ul className="text-base-content/40 list-disc pl-5">
                        <li className="mb-1">React를 사용한 사용자 인터페이스 개발</li>
                        <li className="mb-1">컴포넌트 라이브러리 구축</li>
                        <li className="mb-1">웹 성능 최적화</li>
                    </ul>
                </div>
            </section>
        </div>
    );
}

export default AboutMe;