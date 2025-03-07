import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BsSearch } from 'react-icons/bs';
import {
    HiOutlineSpeakerphone,
    HiOutlineGlobe,
    HiOutlineQuestionMarkCircle,
    HiOutlineLightBulb,
    HiOutlineHeart,
    HiOutlineEye,
    HiOutlineChevronUp
} from 'react-icons/hi';

// 게시글 타입 정의
interface Discussion {
    id: number;
    title: string;
    author: string;
    authorImage: string;
    category: 'general' | 'help' | 'announcements' | 'ideas' | 'kind-words' | 'show-and-tell';
    timeAgo: string;
    commentCount: number;
    status: 'answered' | 'unanswered';
    upvotes: number;
    participants: string[];
}

// 임시 데이터
const sampleDiscussions: Discussion[] = [
    {
        id: 1,
        title: 'Tailwind CSS v3.0 업그레이드 문제 - Config 파일 오류',
        author: 'user1',
        authorImage: 'https://via.placeholder.com/30',
        category: 'help',
        timeAgo: '3일 전',
        commentCount: 5,
        status: 'unanswered',
        upvotes: 1,
        participants: ['https://via.placeholder.com/24', 'https://via.placeholder.com/24']
    },
    {
        id: 2,
        title: 'React에서 Tailwind 사용 시 동적 클래스 적용 방법',
        author: 'user2',
        authorImage: 'https://via.placeholder.com/30',
        category: 'general',
        timeAgo: '34분 전',
        commentCount: 0,
        status: 'unanswered',
        upvotes: 1,
        participants: ['https://via.placeholder.com/24']
    },
    {
        id: 3,
        title: 'DaisyUI 테마 변경 시 이슈',
        author: 'user3',
        authorImage: 'https://via.placeholder.com/30',
        category: 'help',
        timeAgo: '9시간 전',
        commentCount: 2,
        status: 'unanswered',
        upvotes: 1,
        participants: ['https://via.placeholder.com/24', 'https://via.placeholder.com/24']
    },
    {
        id: 4,
        title: 'TypeScript와 Tailwind 함께 사용하기',
        author: 'user4',
        authorImage: 'https://via.placeholder.com/30',
        category: 'help',
        timeAgo: '2주 전',
        commentCount: 5,
        status: 'unanswered',
        upvotes: 1,
        participants: ['https://via.placeholder.com/24', 'https://via.placeholder.com/24']
    },
    {
        id: 5,
        title: 'Vite 빌드 시 TailwindCSS 최적화 방법',
        author: 'user5',
        authorImage: 'https://via.placeholder.com/30',
        category: 'help',
        timeAgo: '6시간 전',
        commentCount: 1,
        status: 'unanswered',
        upvotes: 1,
        participants: ['https://via.placeholder.com/24']
    },
];

// 카테고리 아이콘 선택 함수
const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'announcements':
            return <HiOutlineSpeakerphone className="w-5 h-5" />;
        case 'general':
            return <HiOutlineGlobe className="w-5 h-5" />;
        case 'help':
            return <HiOutlineQuestionMarkCircle className="w-5 h-5" />;
        case 'ideas':
            return <HiOutlineLightBulb className="w-5 h-5" />;
        case 'kind-words':
            return <HiOutlineHeart className="w-5 h-5" />;
        case 'show-and-tell':
            return <HiOutlineEye className="w-5 h-5" />;
        default:
            return <HiOutlineGlobe className="w-5 h-5" />;
    }
};

// 기여자 데이터
interface Contributor {
    id: number;
    name: string;
    avatar: string;
    contributions: number;
}

const topContributors: Contributor[] = [
    { id: 1, name: 'wongin', avatar: 'https://via.placeholder.com/24', contributions: 28 },
    { id: 2, name: 'philipp-spiess', avatar: 'https://via.placeholder.com/24', contributions: 8 },
    { id: 3, name: 'adamwathan', avatar: 'https://via.placeholder.com/24', contributions: 5 },
    { id: 4, name: 'Inventoris', avatar: 'https://via.placeholder.com/24', contributions: 2 },
    { id: 5, name: 'dicasH', avatar: 'https://via.placeholder.com/24', contributions: 2 },
];

// 메인 게시판 컴포넌트
const Board: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');

    // 필터링된 토론 목록
    const filteredDiscussions = sampleDiscussions.filter(discussion => {
        if (selectedCategory !== 'all' && discussion.category !== selectedCategory) {
            return false;
        }
        if (searchQuery && !discussion.title.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        return true;
    });

    return (
        <div className="min-h-screen bg-base-100">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* 왼쪽 사이드바 */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-base-100 rounded-lg border border-base-300">
                            <h2 className="text-lg font-semibold p-4 border-b border-base-300">카테고리</h2>

                            <ul className="p-2">
                                <li className={`p-2 rounded-md flex items-center gap-2 cursor-pointer ${selectedCategory === 'all' ? 'bg-base-200' : 'hover:bg-base-200'}`}
                                    onClick={() => setSelectedCategory('all')}>
                                    <div className="w-6 h-6 bg-primary opacity-80 rounded-md flex items-center justify-center text-white">
                                        <HiOutlineGlobe className="w-4 h-4" />
                                    </div>
                                    <span>모든 게시글</span>
                                </li>

                                <li className={`p-2 rounded-md flex items-center gap-2 cursor-pointer ${selectedCategory === 'announcements' ? 'bg-base-200' : 'hover:bg-base-200'}`}
                                    onClick={() => setSelectedCategory('announcements')}>
                                    <div className="w-6 h-6 bg-red-500 opacity-80 rounded-md flex items-center justify-center text-white">
                                        <HiOutlineSpeakerphone className="w-4 h-4" />
                                    </div>
                                    <span>공지사항</span>
                                </li>

                                <li className={`p-2 rounded-md flex items-center gap-2 cursor-pointer ${selectedCategory === 'general' ? 'bg-base-200' : 'hover:bg-base-200'}`}
                                    onClick={() => setSelectedCategory('general')}>
                                    <div className="w-6 h-6 bg-blue-500 opacity-80 rounded-md flex items-center justify-center text-white">
                                        <HiOutlineGlobe className="w-4 h-4" />
                                    </div>
                                    <span>일반</span>
                                </li>

                                <li className={`p-2 rounded-md flex items-center gap-2 cursor-pointer ${selectedCategory === 'help' ? 'bg-base-200' : 'hover:bg-base-200'}`}
                                    onClick={() => setSelectedCategory('help')}>
                                    <div className="w-6 h-6 bg-orange-500 opacity-80 rounded-md flex items-center justify-center text-white">
                                        <HiOutlineQuestionMarkCircle className="w-4 h-4" />
                                    </div>
                                    <span>도움말</span>
                                </li>

                                <li className={`p-2 rounded-md flex items-center gap-2 cursor-pointer ${selectedCategory === 'ideas' ? 'bg-base-200' : 'hover:bg-base-200'}`}
                                    onClick={() => setSelectedCategory('ideas')}>
                                    <div className="w-6 h-6 bg-yellow-500 opacity-80 rounded-md flex items-center justify-center text-white">
                                        <HiOutlineLightBulb className="w-4 h-4" />
                                    </div>
                                    <span>아이디어</span>
                                </li>

                                <li className={`p-2 rounded-md flex items-center gap-2 cursor-pointer ${selectedCategory === 'kind-words' ? 'bg-base-200' : 'hover:bg-base-200'}`}
                                    onClick={() => setSelectedCategory('kind-words')}>
                                    <div className="w-6 h-6 bg-pink-500 opacity-80 rounded-md flex items-center justify-center text-white">
                                        <HiOutlineHeart className="w-4 h-4" />
                                    </div>
                                    <span>응원메시지</span>
                                </li>

                                <li className={`p-2 rounded-md flex items-center gap-2 cursor-pointer ${selectedCategory === 'show-and-tell' ? 'bg-base-200' : 'hover:bg-base-200'}`}
                                    onClick={() => setSelectedCategory('show-and-tell')}>
                                    <div className="w-6 h-6 bg-purple-500 opacity-80 rounded-md flex items-center justify-center text-white">
                                        <HiOutlineEye className="w-4 h-4" />
                                    </div>
                                    <span>공유하기</span>
                                </li>
                            </ul>
                        </div>

                        {/* 기여자 목록 */}
                        <div className="bg-base-100 rounded-lg border border-base-300 mt-6">
                            <h2 className="text-lg font-semibold p-4 border-b border-base-300">활발한 기여자</h2>
                            <div className="p-2">
                                {topContributors.map(contributor => (
                                    <div key={contributor.id} className="flex items-center justify-between p-2 hover:bg-base-200 rounded-md">
                                        <div className="flex items-center gap-2">
                                            <img src={contributor.avatar} alt={contributor.name} className="w-6 h-6 rounded-full" />
                                            <span className="text-base-content">{contributor.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-base-content/70">
                                            <span>{contributor.contributions}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 오른쪽 토론 목록 */}
                    <div className="flex-grow">
                        {/* 상단 검색 및 필터 */}
                        <div className="bg-base-100 rounded-lg border border-base-300 p-4 mb-4">
                            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                                {/* 검색창 */}
                                <div className="relative w-full md:w-64">
                                    <input
                                        type="text"
                                        placeholder="게시글 검색"
                                        className="input input-bordered w-full pl-10"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                                </div>

                                <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                                    {/* 정렬 드롭다운 */}
                                    <div className="dropdown dropdown-end">
                                        <label tabIndex={0} className="btn btn-outline">
                                            정렬: 최신순
                                        </label>
                                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-1 border border-base-300">
                                            <li><a>최신순</a></li>
                                            <li><a>추천순</a></li>
                                            <li><a>댓글순</a></li>
                                        </ul>
                                    </div>

                                    {/* 상태 필터 */}
                                    <div className="dropdown dropdown-end">
                                        <label tabIndex={0} className="btn btn-outline">
                                            필터: 전체
                                        </label>
                                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-1 border border-base-300">
                                            <li><a>전체</a></li>
                                            <li><a>미해결</a></li>
                                            <li><a>해결됨</a></li>
                                        </ul>
                                    </div>

                                    {/* 새 게시글 버튼 */}
                                    <Link to="/board/new" className="btn btn-primary">
                                        새 게시글
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* 토론 목록 */}
                        <div className="bg-base-100 rounded-lg border border-base-300">
                            <h2 className="text-lg font-semibold p-4 border-b border-base-300">게시글</h2>

                            <div className="divide-y divide-base-300">
                                {filteredDiscussions.map(discussion => (
                                    <div key={discussion.id} className="p-4 hover:bg-base-200">
                                        <div className="flex">
                                            {/* 투표 버튼 */}
                                            <div className="flex flex-col items-center mr-4 w-8">
                                                <button className="p-1 hover:bg-base-300 rounded">
                                                    <HiOutlineChevronUp className="w-5 h-5" />
                                                </button>
                                                <span className="text-sm">{discussion.upvotes}</span>
                                            </div>

                                            {/* 카테고리 아이콘 */}
                                            <div className="mr-4">
                                                <div className={`w-8 h-8 rounded-md flex items-center justify-center text-white ${discussion.category === 'general' ? 'bg-blue-500' :
                                                        discussion.category === 'help' ? 'bg-orange-500' :
                                                            discussion.category === 'announcements' ? 'bg-red-500' :
                                                                discussion.category === 'ideas' ? 'bg-yellow-500' :
                                                                    discussion.category === 'kind-words' ? 'bg-pink-500' :
                                                                        'bg-purple-500'
                                                    }`}>
                                                    {getCategoryIcon(discussion.category)}
                                                </div>
                                            </div>

                                            {/* 토론 내용 */}
                                            <div className="flex-grow">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="font-medium text-base-content mb-1">
                                                            <Link to={`/board/${discussion.id}`} className="hover:underline">
                                                                {discussion.title}
                                                            </Link>
                                                        </h3>
                                                        <div className="text-sm text-base-content/70">
                                                            <span>{discussion.author}</span>
                                                            <span className="mx-1">·</span>
                                                            <span>{discussion.timeAgo}</span>
                                                            <span className="mx-1">·</span>
                                                            <span className="capitalize">{discussion.category === 'help' ? '도움말' :
                                                                discussion.category === 'general' ? '일반' :
                                                                    discussion.category === 'announcements' ? '공지사항' :
                                                                        discussion.category === 'ideas' ? '아이디어' :
                                                                            discussion.category === 'kind-words' ? '응원메시지' : '공유하기'}</span>
                                                            <span className="mx-1">·</span>
                                                            <span>{discussion.status === 'answered' ? '해결됨' : '미해결'}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center">
                                                        {/* 참여자 아바타 */}
                                                        <div className="flex -space-x-2 mr-2">
                                                            {discussion.participants.map((participant, index) => (
                                                                <img
                                                                    key={index}
                                                                    src={participant}
                                                                    alt="participant"
                                                                    className="w-6 h-6 rounded-full border-2 border-base-100"
                                                                />
                                                            ))}
                                                        </div>

                                                        {/* 댓글 수 */}
                                                        <div className="text-sm text-base-content/70">
                                                            <span>{discussion.commentCount}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {filteredDiscussions.length === 0 && (
                                    <div className="p-8 text-center text-base-content/70">
                                        검색 결과가 없습니다.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Board;