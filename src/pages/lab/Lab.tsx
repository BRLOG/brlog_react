import React, { useState } from 'react';
import {
    HiOutlineBeaker,
    HiOutlineCode,
    HiOutlineDatabase,
    HiOutlineChartBar,
    HiOutlineTerminal,
    HiOutlineChip
} from 'react-icons/hi';

// 실험 타입 정의
interface Experiment {
    id: string;
    name: string;
    icon: React.ReactNode;
    description: string;
    content: React.ReactNode;
}

const Lab: React.FC = () => {
    // 현재 선택된 실험
    const [activeExperiment, setActiveExperiment] = useState<string>('graphql');

    // 실험 목록 정의
    const experiments: Experiment[] = [
        {
            id: 'graphql',
            name: 'GraphQL 실험',
            icon: <HiOutlineCode className="w-5 h-5" />,
            description: 'GraphQL을 활용한 API 구현 및 테스트',
            content: (
                <div>
                    <h2 className="text-2xl font-bold mb-4">GraphQL 실험실</h2>
                    <p className="mb-4">
                        GraphQL은 Facebook에서 개발한 쿼리 언어로, API를 위한 효율적이고 강력한 대안입니다.
                        이 실험에서는 GraphQL의 기본 개념과 React에서의 활용법을 탐구합니다.
                    </p>
                    <div className="mockup-code bg-base-300 text-base-content mb-4">
                        <pre data-prefix="$"><code>npm install apollo-client graphql</code></pre>
                        <pre data-prefix=">" className="text-success"><code>installing...</code></pre>
                        <pre data-prefix=">" className="text-success"><code>Done!</code></pre>
                    </div>
                    <p>GraphQL의 주요 장점:</p>
                    <ul className="list-disc pl-6 mb-4">
                        <li>클라이언트가 필요한 데이터만 요청할 수 있습니다.</li>
                        <li>단일 요청으로 여러 리소스를 가져올 수 있습니다.</li>
                        <li>타입 시스템을 통해 API의 형태를 명확하게 알 수 있습니다.</li>
                    </ul>
                </div>
            )
        },
        {
            id: 'ai',
            name: 'AI 통합',
            icon: <HiOutlineChip className="w-5 h-5" />,
            description: '인공지능 API를 활용한 콘텐츠 생성',
            content: (
                <div>
                    <h2 className="text-2xl font-bold mb-4">AI 통합 실험실</h2>
                    <p className="mb-4">
                        최신 AI 기술을 블로그와 통합하여 콘텐츠 생성, 추천 시스템, 자동 태깅 등을 구현합니다.
                    </p>
                    <div className="alert alert-info mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>이 실험은 현재 개발 중입니다. 곧 더 많은 기능이 추가될 예정입니다.</span>
                    </div>
                    <div className="card bg-base-200 shadow-md mb-4">
                        <div className="card-body">
                            <h3 className="card-title">AI 콘텐츠 생성기</h3>
                            <p>주제를 입력하면 AI가 블로그 포스트 초안을 작성해 드립니다.</p>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">블로그 주제</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="예: 리액트 hooks의 장점"
                                    className="input input-bordered w-full mb-4"
                                />
                                <button className="btn btn-primary">생성하기</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'database',
            name: '데이터베이스 최적화',
            icon: <HiOutlineDatabase className="w-5 h-5" />,
            description: 'MySQL 및 Redis를 활용한 성능 최적화 기법',
            content: (
                <div>
                    <h2 className="text-2xl font-bold mb-4">데이터베이스 최적화 실험실</h2>
                    <p className="mb-4">
                        MySQL과 Redis를 활용하여 블로그 성능을 최적화하는 다양한 기법을 실험합니다.
                    </p>
                    <div className="stats shadow mb-4">
                        <div className="stat">
                            <div className="stat-figure text-primary">
                                <HiOutlineDatabase className="w-8 h-8" />
                            </div>
                            <div className="stat-title">쿼리 실행 시간</div>
                            <div className="stat-value text-primary">254ms</div>
                            <div className="stat-desc">최적화 후 31ms</div>
                        </div>
                        <div className="stat">
                            <div className="stat-figure text-secondary">
                                <HiOutlineChartBar className="w-8 h-8" />
                            </div>
                            <div className="stat-title">캐시 히트율</div>
                            <div className="stat-value text-secondary">89%</div>
                            <div className="stat-desc">전주 대비 14% 증가</div>
                        </div>
                    </div>
                    <div className="mockup-code bg-base-300 text-base-content">
                        <pre data-prefix="1"><code>// Redis 캐싱 구현 예제</code></pre>
                        <pre data-prefix="2"><code>@Cacheable(value = "posts", key = "#id")</code></pre>
                        <pre data-prefix="3"><code>public Post getPostById(Long id) {'{'}</code></pre>
                        <pre data-prefix="4"><code>    return postRepository.findById(id)</code></pre>
                        <pre data-prefix="5"><code>        .orElseThrow(() {'=>'} new PostNotFoundException(id));</code></pre>
                        <pre data-prefix="6"><code>{'}'}</code></pre>
                    </div>
                </div>
            )
        },
        {
            id: 'terminal',
            name: 'CLI 도구',
            icon: <HiOutlineTerminal className="w-5 h-5" />,
            description: '블로그 관리를 위한 커맨드라인 도구',
            content: (
                <div>
                    <h2 className="text-2xl font-bold mb-4">CLI 도구 실험실</h2>
                    <p className="mb-4">
                        블로그 콘텐츠 관리를 더 효율적으로 할 수 있는 커맨드라인 인터페이스 도구를 개발합니다.
                    </p>
                    <div className="mockup-code bg-base-300 text-base-content mb-4">
                        <pre data-prefix="$"><code>blog-cli new-post "TypeScript 제네릭 활용하기"</code></pre>
                        <pre data-prefix=">" className="text-success"><code>새 포스트가 생성되었습니다. ID: 245</code></pre>
                        <pre data-prefix="$"><code>blog-cli publish 245</code></pre>
                        <pre data-prefix=">" className="text-success"><code>포스트가 발행되었습니다!</code></pre>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>명령어</th>
                                    <th>설명</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><code>blog-cli new-post</code></td>
                                    <td>새 블로그 포스트 생성</td>
                                </tr>
                                <tr>
                                    <td><code>blog-cli publish</code></td>
                                    <td>포스트 발행하기</td>
                                </tr>
                                <tr>
                                    <td><code>blog-cli stats</code></td>
                                    <td>블로그 통계 보기</td>
                                </tr>
                                <tr>
                                    <td><code>blog-cli backup</code></td>
                                    <td>블로그 데이터 백업</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )
        },
        {
            id: 'experiments',
            name: '기타 실험',
            icon: <HiOutlineBeaker className="w-5 h-5" />,
            description: '다양한 웹 기술 실험장',
            content: (
                <div>
                    <h2 className="text-2xl font-bold mb-4">기타 실험실</h2>
                    <p className="mb-4">
                        다양한 웹 기술과 라이브러리를 실험하고 테스트하는 공간입니다.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="card bg-base-200 shadow-md">
                            <div className="card-body">
                                <h3 className="card-title">WebAssembly 실험</h3>
                                <p>Rust로 작성한 코드를 WebAssembly로 컴파일하여 웹에서 활용하는 방법을 탐구합니다.</p>
                                <div className="card-actions justify-end">
                                    <button className="btn btn-primary btn-sm">자세히 보기</button>
                                </div>
                            </div>
                        </div>
                        <div className="card bg-base-200 shadow-md">
                            <div className="card-body">
                                <h3 className="card-title">Web Components</h3>
                                <p>프레임워크에 독립적인 재사용 가능한 웹 컴포넌트를 만들고 활용합니다.</p>
                                <div className="card-actions justify-end">
                                    <button className="btn btn-primary btn-sm">자세히 보기</button>
                                </div>
                            </div>
                        </div>
                        <div className="card bg-base-200 shadow-md">
                            <div className="card-body">
                                <h3 className="card-title">CSS Grid 레이아웃</h3>
                                <p>CSS Grid를 활용한 복잡한 레이아웃 구현 방법을 실험합니다.</p>
                                <div className="card-actions justify-end">
                                    <button className="btn btn-primary btn-sm">자세히 보기</button>
                                </div>
                            </div>
                        </div>
                        <div className="card bg-base-200 shadow-md">
                            <div className="card-body">
                                <h3 className="card-title">서버리스 함수</h3>
                                <p>AWS Lambda나 Vercel Function을 활용한 서버리스 아키텍처를 실험합니다.</p>
                                <div className="card-actions justify-end">
                                    <button className="btn btn-primary btn-sm">자세히 보기</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    // 현재 선택된 실험 찾기
    const currentExperiment = experiments.find(exp => exp.id === activeExperiment) || experiments[0];

    return (
        <div className="bg-base-100">
            <div className="container mx-auto px-4 py-8">
                {/* 윈도우 목업 */}
                <div className="mockup-window border border-base-300 bg-base-200 h-[calc(100vh-150px)]">
                    <div className="flex flex-col md:flex-row h-full">
                        {/* 좌측 메뉴 */}
                        <div className="w-full md:w-80 lg:w-80 flex-shrink-0 p-4 bg-base-100 border-r border-base-300 h-full overflow-y-auto">
                            <ul className="menu menu-vertical p-0 gap-2">
                                {experiments.map((experiment) => (
                                    <li key={experiment.id}>
                                        <button
                                            className={activeExperiment === experiment.id ? 'active' : ''}
                                            onClick={() => setActiveExperiment(experiment.id)}
                                        >
                                            {experiment.icon}
                                            <span>{experiment.name}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 구분선 - 모바일에서는 보이지 않음 */}
                        <div className="divider divider-horizontal hidden md:flex"></div>

                        {/* 우측 내용 영역 */}
                        <div className="flex-grow flex-1 w-full p-6 overflow-auto bg-base-100 h-full">
                            <div className="text-sm breadcrumbs mb-4">
                                <ul>
                                    <li><a>실험실</a></li>
                                    <li>{currentExperiment.name}</li>
                                </ul>
                            </div>
                            <div className="max-w-full">
                                {currentExperiment.content}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Lab;