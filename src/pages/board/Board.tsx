import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BsSearch } from 'react-icons/bs';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import {
    HiOutlineSpeakerphone,
    HiOutlineGlobe,
    HiOutlineQuestionMarkCircle,
    HiOutlineLightBulb,
    HiOutlineHeart,
    HiOutlineEye,
    HiOutlineStar,
    HiOutlineChevronUp,
    HiOutlineChatAlt,
    HiOutlineRefresh
} from 'react-icons/hi';

// API 기본 URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090';

// 한 번에 로드할 게시글 수
const POSTS_PER_PAGE = 10;

// 게시글 타입 정의
interface Post {
    postId: number;
    title: string;
    userNm: string;
    categoryId: string;
    regDt: string;
    commentCnt: number;
    likeCnt: number;
    content?: string;
    viewCnt?: number;
    userId?: string;
    status?: string;
    modDt?: string;
    isNotice?: boolean;
    profileImgUrl?: string; 
}

// 카테고리 타입 정의
interface Category {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
}

// 기여자 타입 정의
interface Contributor {
    id: number;
    name: string;
    avatar: string;
    contributions: number;
}

// 메인 게시판 컴포넌트
const Board: React.FC = () => {
    const { isAuthenticated } = useAuth(); // 인증 상태 가져오기
    const [posts, setPosts] = useState<Post[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [contributors, setContributors] = useState<Contributor[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<string>('recent');
    
    // 무한 스크롤을 위한 상태 변수
    const [offset, setOffset] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const observer = useRef<IntersectionObserver | null>(null);
    const lastPostElementRef = useRef<HTMLDivElement | null>(null);
    
    // 클라이언트 사이드 검색 상태
    const [isSearchMode, setIsSearchMode] = useState<boolean>(false);

    // 검색에 따른 게시글 필터링
    useEffect(() => {
        if (!searchQuery.trim()) {
            // 검색어가 없으면 필터링하지 않음
            setFilteredPosts(posts);
            setIsSearchMode(false);
            return;
        }
        
        // 검색어가 있으면 클라이언트 사이드 필터링 적용
        setIsSearchMode(true);
        
        const lowercaseQuery = searchQuery.toLowerCase();
        const filtered = posts.filter(post => 
            post.title.toLowerCase().includes(lowercaseQuery) || 
            (post.content && post.content.toLowerCase().includes(lowercaseQuery))
        );
        
        setFilteredPosts(filtered);
    }, [searchQuery, posts]);

    // 추가 게시글 로드 함수
    const loadMorePosts = useCallback(async () => {
        if (!hasMore || loadingMore) return;
        
        try {
            setLoadingMore(true);
            
            const nextOffset = offset + POSTS_PER_PAGE;
            
            // 게시글 가져오기
            const url = `${API_URL}/post/list`;
            
            // URL 파라미터 구성
            const params: Record<string, string | number> = {
                offset: nextOffset,
                size: POSTS_PER_PAGE
            };
            
            // 카테고리 필터 적용
            if (selectedCategory !== 'all') {
                params.categoryId = selectedCategory;
            }
            
            // 정렬 옵션 적용 (컨트롤러에 맞는 형식으로 변환)
            if (sortBy) {
                switch(sortBy) {
                    case 'recent':
                        params.sortBy = 'regDt DESC';
                        break;
                    case 'likes':
                        params.sortBy = 'likeCnt DESC';
                        break;
                    case 'comments':
                        params.sortBy = 'commentCnt DESC';
                        break;
                    default:
                        params.sortBy = 'regDt DESC';
                }
            }
            
            // 인증 여부에 따라 다른 옵션 사용
            const config = {
                params,
                headers: {
                    'X-Public-Request': 'true'
                }
            };
            
            const postResponse = await axios.get(url, config);
            const responseData = postResponse.data.data;
            
            // API 응답 형식에 따라 게시글 배열 추출
            const newPosts = responseData.posts || [];
            
            if (newPosts.length > 0) {
                setPosts(prevPosts => [...prevPosts, ...newPosts]);
                setOffset(nextOffset);
            }
            
            // 불러온 게시글 수가 요청한 수보다 적으면 더 이상 게시글이 없다고 판단
            setHasMore(newPosts.length === POSTS_PER_PAGE);
        } catch (err) {
            console.error('추가 게시글 불러오기 오류:', err);
        } finally {
            setLoadingMore(false);
        }
    }, [selectedCategory, sortBy, offset, hasMore, loadingMore]);

    // Intersection Observer 설정
    useEffect(() => {
        // 마지막 게시글 요소를 관찰하는 함수
        const lastPostObserver = new IntersectionObserver(
            (entries) => {
                // 마지막 게시글이 화면에 보이면 추가 게시글 로드
                if (entries[0].isIntersecting && hasMore) {
                    loadMorePosts();
                }
            },
            { threshold: 0.5 } // 요소가 50% 이상 보일 때 콜백 실행
        );
        
        // 현재 마지막 게시글 요소 관찰 시작
        if (lastPostElementRef.current) {
            lastPostObserver.observe(lastPostElementRef.current);
        }
        
        // 컴포넌트 언마운트 시 Observer 해제
        return () => {
            if (lastPostElementRef.current) {
                lastPostObserver.unobserve(lastPostElementRef.current);
            }
        };
    }, [loadMorePosts, hasMore, filteredPosts.length]);

    // 데이터 초기 로드
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            // 검색, 카테고리 변경, 정렬 변경 시 offset 초기화
            setOffset(0);
            setPosts([]);
            setFilteredPosts([]);
            setHasMore(true);
            
            try {
                // 카테고리 가져오기
                const categoryResponse = await axios.get(`${API_URL}/post/categories`);
                setCategories(categoryResponse.data.data);
    
                // 게시글 가져오기
                const url = `${API_URL}/post/list`;
                
                // URL 파라미터 구성
                const params: Record<string, string | number> = {
                    offset: 0,
                    size: POSTS_PER_PAGE
                };
                
                // 카테고리 필터 적용
                if (selectedCategory !== 'all') {
                    params.categoryId = selectedCategory;
                }
                
                // 정렬 옵션 적용 (컨트롤러에 맞는 형식으로 변환)
                if (sortBy) {
                    switch(sortBy) {
                        case 'recent':
                            params.sortBy = 'regDt DESC';
                            break;
                        case 'likes':
                            params.sortBy = 'likeCnt DESC';
                            break;
                        case 'comments':
                            params.sortBy = 'commentCnt DESC';
                            break;
                        default:
                            params.sortBy = 'regDt DESC';
                    }
                }
                
                // 인증 여부에 따라 다른 옵션 사용
                const config = {
                    params,
                    headers: {
                        'X-Public-Request': 'true'
                    }
                };
                
                const postResponse = await axios.get(url, config);
                const responseData = postResponse.data.data;
                
                // API 응답 형식에 따라 게시글 배열 추출
                const postsData = responseData.posts || [];
                
                setPosts(postsData);
                
                // 불러온 게시글 수가 요청한 수보다 적으면 더 이상 게시글이 없다고 판단
                setHasMore(postsData.length === POSTS_PER_PAGE);
    
                // 기여자 가져오기 - 공개 요청으로 처리
                const contributorResponse = await axios.get(`${API_URL}/post/contributors`, {
                    headers: {
                        'X-Public-Request': 'true'
                    }
                });

                setContributors(contributorResponse.data.data);
                setError(null);
            } catch (err) {
                console.error('데이터 불러오기 오류:', err);
                setError('데이터를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };
    
        fetchInitialData();
    }, [selectedCategory, sortBy]);

    // 검색 기능 - 클라이언트 사이드에서 필터링 수행
    const handleSearch = () => {
        // 검색어가 변경될 때마다 useEffect에서 자동으로 필터링
        // 별도의 API 호출 없이 현재 불러온 데이터에서 필터링
    };

    // 검색어 입력 시 엔터 키 처리
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // 더 불러오기 버튼 클릭 핸들러
    const handleLoadMorePostsClick = () => {
        loadMorePosts();
    };

    // 카테고리 아이콘 선택 함수
    const getCategoryIcon = (categoryId: string) => {
        switch (categoryId) {
            case 'development':
                return <HiOutlineLightBulb className="w-5 h-5" />;
            case 'daily':
                return <HiOutlineHeart className="w-5 h-5" />;
            case 'etc':
                return <HiOutlineStar className="w-5 h-5" />;
            case 'announcements':
                return <HiOutlineSpeakerphone className="w-5 h-5" />;
            case 'help':
                return <HiOutlineQuestionMarkCircle className="w-5 h-5" />;
            default:
                return <HiOutlineStar className="w-5 h-5" />;
        }
    };

    // 카테고리 색상 선택 함수
    const getCategoryColor = (categoryId: string) => {
        switch (categoryId) {
            case 'development':
                return 'bg-yellow-500';
            case 'daily':
                return 'bg-pink-500';
            case 'etc':
                return 'bg-purple-500';
            case 'announcements':
                return 'bg-red-500';
            case 'help':
                return 'bg-orange-500';
            default:
                return 'bg-purple-500';
        }
    };

    // 카테고리 이름 가져오기
    const getCategoryName = (categoryId: string) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : categoryId;
    };

    // 정렬 옵션 변경 처리
    const handleSortChange = (sortOption: string) => {
        setSortBy(sortOption);
    };

    // 로딩 중 표시
    if (loading && posts.length === 0) {
        return (
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* 왼쪽 사이드바 - sticky 적용 */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="sticky top-24">
                            {/* 카테고리 */}
                            <div className="bg-base-100 rounded-lg border border-base-300 mb-6">
                                <h2 className="text-lg font-semibold p-4 border-b border-base-300 text-base-content">카테고리</h2>

                                <ul className="p-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                                    <li 
                                        className={`p-2 rounded-md flex items-center gap-2 cursor-pointer ${selectedCategory === 'all' ? 'bg-base-200' : 'hover:bg-base-200'}`}
                                        onClick={() => setSelectedCategory('all')}
                                    >
                                        <div className="w-6 h-6 bg-primary opacity-80 rounded-md flex items-center justify-center text-white">
                                            <HiOutlineGlobe className="w-4 h-4" />
                                        </div>
                                        <span className="text-base-content">모든 게시글</span>
                                    </li>

                                    {categories.map(category => (
                                        <li 
                                            key={category.id}
                                            className={`p-2 rounded-md flex items-center gap-2 cursor-pointer ${selectedCategory === category.id ? 'bg-base-200' : 'hover:bg-base-200'}`}
                                            onClick={() => setSelectedCategory(category.id)}
                                        >
                                            <div className={`w-6 h-6 ${getCategoryColor(category.id)} opacity-80 rounded-md flex items-center justify-center text-white`}>
                                                {getCategoryIcon(category.id)}
                                            </div>
                                            <span className="text-base-content">{category.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* 기여자 목록 */}
                            <div className="bg-base-100 rounded-lg border border-base-300">
                                <h2 className="text-lg font-semibold p-4 border-b border-base-300 text-base-content">활발한 기여자</h2>
                                <div className="p-2 max-h-[calc(100vh-400px)] overflow-y-auto">
                                    {contributors.map(contributor => (
                                        <div key={contributor.id} className="flex items-center justify-between p-2 hover:bg-base-200 rounded-md">
                                            <div className="flex items-center gap-2">
                                                {contributor?.avatar ? (
                                                    <img 
                                                        src={contributor.avatar} 
                                                        alt={contributor.name} 
                                                        className="w-6 h-6 rounded-full"
                                                    />
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full text-xs bg-primary text-primary-content flex items-center justify-center">
                                                        {contributor?.name?.charAt(0).toUpperCase() || 'U'}
                                                    </div>
                                                )}
                                                <span className="text-base-content">{contributor.name}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-base-content/70">
                                                <span className="text-base-content">{contributor.contributions}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 오른쪽 게시글 목록 */}
                    <div className="flex-grow">
                        {/* 상단 검색 및 필터 */}
                        <div className="bg-base-100 rounded-lg border border-base-300 p-4 mb-4 sticky top-24 z-10">
                            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                                {/* 검색창 */}
                                <div className="relative w-full md:w-64">
                                    <input
                                        type="text"
                                        placeholder="게시글 검색"
                                        className="input input-bordered w-full pl-10"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                    />
                                    <BsSearch 
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 cursor-pointer" 
                                        onClick={handleSearch}
                                    />
                                </div>

                                <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                                    {/* 정렬 드롭다운 */}
                                    <div className="dropdown dropdown-end">
                                        <label tabIndex={0} className="btn btn-outline">
                                            정렬: {sortBy === 'recent' ? '최신순' : 
                                                sortBy === 'likes' ? '좋아요순' : 
                                                sortBy === 'comments' ? '댓글순' : '최신순'}
                                        </label>
                                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-1 border border-base-300 z-20">
                                            <li><a onClick={() => handleSortChange('recent')}>최신순</a></li>
                                            <li><a onClick={() => handleSortChange('likes')}>좋아요순</a></li>
                                            <li><a onClick={() => handleSortChange('comments')}>댓글순</a></li>
                                        </ul>
                                    </div>

                                    {/* 새 게시글 버튼 - 로그인 상태에 따라 다르게 표시 */}
                                    {isAuthenticated ? (
                                        <Link to="/board/new" className="btn btn-primary">
                                            새 게시글
                                        </Link>
                                    ) : (
                                        <div className="dropdown dropdown-end">
                                            <label tabIndex={0} className="btn btn-primary">
                                                새 게시글
                                            </label>
                                            <div tabIndex={0} className="dropdown-content z-20 card card-compact w-64 p-2 shadow bg-base-100 mt-1 text-base-content border border-base-300">
                                                <div className="card-body">
                                                    <h3 className="card-title text-sm">로그인이 필요합니다</h3>
                                                    <p className="text-xs">게시글을 작성하려면 로그인이 필요합니다.</p>
                                                    <div className="card-actions justify-end">
                                                        <Link to="/login" className="btn btn-primary btn-sm">로그인</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 게시글 목록 */}
                        <div className="bg-base-100 rounded-lg border border-base-300">
                            <h2 className="text-lg font-semibold p-4 border-b border-base-300 text-base-content">게시글</h2>

                            {error && (
                                <div className="p-4 text-center text-error">
                                    <p>{error}</p>
                                </div>
                            )}

                            <div className="divide-y divide-base-300">
                                {filteredPosts.length > 0 ? (
                                    <>
                                        {filteredPosts.map((post, index) => (
                                            <div 
                                                key={post.postId} 
                                                className="p-4 hover:bg-base-200"
                                                // 마지막 게시글 요소에 참조 설정
                                                ref={index === filteredPosts.length - 1 ? lastPostElementRef : null}
                                            >
                                                <div className="flex">
                                                    {/* 좋아요 버튼 */}
                                                    <div className="flex flex-col items-center mr-4 w-8">
                                                        <button className="p-1 hover:bg-base-300 rounded">
                                                            <HiOutlineChevronUp className="w-5 h-5" />
                                                        </button>
                                                        <span className="text-sm">{post.likeCnt}</span>
                                                    </div>

                                                    {/* 카테고리 아이콘 */}
                                                    <div className="mr-4">
                                                        <div className={`w-8 h-8 rounded-md flex items-center justify-center text-white ${getCategoryColor(post.categoryId)}`}>
                                                            {getCategoryIcon(post.categoryId)}
                                                        </div>
                                                    </div>

                                                    {/* 게시글 내용 */}
                                                    <div className="flex-grow">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <h3 className="font-medium text-base-content mb-1">
                                                                    <Link to={`/board/${post.postId}`} className="hover:underline">
                                                                        {post.title}
                                                                    </Link>
                                                                </h3>
                                                                <div className="text-sm text-base-content/70">
                                                                    <span>{post.userNm}</span>
                                                                    <span className="mx-1">·</span>
                                                                    <span>{post.regDt}</span>
                                                                    <span className="mx-1">·</span>
                                                                    <span className="capitalize">{getCategoryName(post.categoryId)}</span>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                {/* 프로필 이미지 */}
                                                                <div className="w-6 h-6 rounded-full overflow-hidden">
                                                                    {post?.profileImgUrl ? (
                                                                        <img 
                                                                            src={post.profileImgUrl} 
                                                                            alt={post?.userNm || '프로필'} 
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full text-xs bg-primary text-primary-content flex items-center justify-center">
                                                                            {post?.userNm?.charAt(0).toUpperCase() || 'U'}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                
                                                                {/* 댓글 수 */}
                                                                <div className="flex items-center text-sm text-base-content/70">
                                                                    <HiOutlineChatAlt className="w-4 h-4 mr-1" />
                                                                    <span>{post.commentCnt}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        
                                        {/* 로딩 표시기 */}
                                        {loadingMore && (
                                            <div className="p-4 flex justify-center">
                                                <div className="loading loading-spinner loading-md"></div>
                                            </div>
                                        )}
                                        
                                        {/* 더 불러오기 버튼 (자동 로드 실패 시 수동 로드용) */}
                                        {hasMore && !loadingMore && !isSearchMode && (
                                            <div className="p-4 flex justify-center">
                                                <button 
                                                    className="btn btn-outline btn-sm flex items-center gap-1"
                                                    onClick={handleLoadMorePostsClick}
                                                >
                                                    <HiOutlineRefresh className="w-4 h-4" />
                                                    게시글 더 불러오기
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="p-8 text-center text-base-content/70">
                                        {isSearchMode 
                                            ? '검색 결과가 없습니다.' 
                                            : '게시글이 없습니다.'}
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