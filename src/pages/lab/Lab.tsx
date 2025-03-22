import React, { useState } from 'react';
import {
    HiOutlineBeaker,
    HiOutlineCode,
    HiOutlineDatabase,
    HiOutlineTerminal,
    HiOutlineChip
} from 'react-icons/hi';

// 실험 컴포넌트 임포트
import GraphQLExperiment from '../../components/lab/GraphQL';
import AIExperiment from '../../components/lab/AI';
import DatabaseExperiment from '../../components/lab/Database';
import CLIExperiment from '../../components/lab/CLI';
import { ExperimentType } from '../../components/lab/types';

const Lab: React.FC = () => {
    // 현재 선택된 실험
    const [activeExperiment, setActiveExperiment] = useState<string>('graphql');

    // 실험 목록 정의
    const experiments: (ExperimentType & { component: React.ReactNode })[] = [
        {
            id: 'graphql',
            name: 'GraphQL 실험',
            icon: <HiOutlineCode className="w-5 h-5" />,
            description: 'GraphQL을 활용한 API 구현 및 테스트',
            component: <GraphQLExperiment />
        },
        {
            id: 'ai',
            name: 'AI 통합',
            icon: <HiOutlineChip className="w-5 h-5" />,
            description: '인공지능 API를 활용한 콘텐츠 생성',
            component: <AIExperiment />
        },
        {
            id: 'database',
            name: '데이터베이스 최적화',
            icon: <HiOutlineDatabase className="w-5 h-5" />,
            description: 'MySQL 및 Redis를 활용한 성능 최적화 기법',
            component: <DatabaseExperiment />
        },
        {
            id: 'terminal',
            name: 'CLI 도구',
            icon: <HiOutlineTerminal className="w-5 h-5" />,
            description: '블로그 관리를 위한 커맨드라인 도구',
            component: <CLIExperiment />
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
                        <div className="w-full md:w-72 lg:w-80 flex-shrink-0 p-4 bg-base-100 border-r border-base-300 h-full overflow-y-auto">
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
                                {currentExperiment.component}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Lab;