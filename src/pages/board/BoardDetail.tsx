import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

import {
    HiOutlineGlobe,
    HiOutlineQuestionMarkCircle,
    HiOutlineLightBulb,
    HiOutlineSpeakerphone,
    HiOutlineHeart,
    HiOutlineEye,
    HiOutlineChevronUp,
    HiOutlineChatAlt,
    HiOutlineCalendar,
    HiOutlineClock,
    HiOutlineReply,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineExternalLink,
    HiChevronLeft,
    HiOutlineRefresh
} from 'react-icons/hi';

// API 기본 URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090';

// 한 번에 로드할 댓글 수
const COMMENTS_PER_PAGE = 10;

// 게시글 타입 정의
interface Post {
    postId: number;
    title: string;
    content: string;
    userNm: string;
    userId: string;
    categoryId: string;
    viewCnt: number;
    likeCnt: number;
    commentCnt: number;
    isNotice: boolean;
    status: string;
    regDt: string;
    modDt: string;
    profileImgUrl?: string;
}

// 댓글 타입 정의
interface Comment {
    commentId: number;
    postId: number;
    userId: string;
    userNm: string;
    content: string;
    likeCnt: number;
    regDt: string;
    modDt: string;
    profileImgUrl?: string;
}

// 카테고리 타입 정의
interface Category {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

// 현재 시간을 ISO 문자열 형식으로 반환하는 함수
const getCurrentTimeISO = (): string => {
    return new Date().toISOString();
};

const BoardDetail: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    // 상태 관리
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState<string>('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [commentLoading, setCommentLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isLiked, setIsLiked] = useState<boolean>(false);

    // 무한 스크롤을 위한 상태 변수
    const [offset, setOffset] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const observer = useRef<IntersectionObserver | null>(null);
    const lastCommentElementRef = useRef<HTMLDivElement | null>(null);

    // 댓글 새로고침 함수
    const refreshComments = async () => {
        try {
            // 모든 댓글을 다시 불러올 때는 offset을 0으로 리셋
            setOffset(0);
            const commentResponse = await axios.get(`${API_URL}/post/${postId}/comments`, {
                params: {
                    offset: 0,
                    size: COMMENTS_PER_PAGE
                }
            });

            const commentsData = commentResponse.data.data || [];
            setComments(commentsData);

            // 불러온 댓글 수가 요청한 수보다 적으면 더 이상 댓글이 없다고 판단
            setHasMore(commentsData.length === COMMENTS_PER_PAGE);
        } catch (err) {
            console.error('댓글 새로고침 오류:', err);
        }
    };

    // 추가 댓글 로드 함수
    const loadMoreComments = useCallback(async () => {
        if (!hasMore || loadingMore) return;

        try {
            setLoadingMore(true);

            const nextOffset = offset + COMMENTS_PER_PAGE;
            const commentResponse = await axios.get(`${API_URL}/post/${postId}/comments`, {
                params: {
                    offset: nextOffset,
                    size: COMMENTS_PER_PAGE
                }
            });

            const newComments = commentResponse.data.data || [];

            if (newComments.length > 0) {
                setComments(prevComments => [...prevComments, ...newComments]);
                setOffset(nextOffset);
            }

            // 불러온 댓글 수가 요청한 수보다 적으면 더 이상 댓글이 없다고 판단
            setHasMore(newComments.length === COMMENTS_PER_PAGE);
        } catch (err) {
            console.error('추가 댓글 불러오기 오류:', err);
        } finally {
            setLoadingMore(false);
        }
    }, [postId, offset, hasMore, loadingMore]);

    // Intersection Observer 설정
    useEffect(() => {
        // 마지막 댓글 요소를 관찰하는 함수
        const lastCommentObserver = new IntersectionObserver(
            (entries) => {
                // 마지막 댓글이 화면에 보이면 추가 댓글 로드
                if (entries[0].isIntersecting && hasMore) {
                    loadMoreComments();
                }
            },
            { threshold: 0.5 } // 요소가 50% 이상 보일 때 콜백 실행
        );

        // 현재 마지막 댓글 요소 관찰 시작
        if (lastCommentElementRef.current) {
            lastCommentObserver.observe(lastCommentElementRef.current);
        }

        // 컴포넌트 언마운트 시 Observer 해제
        return () => {
            if (lastCommentElementRef.current) {
                lastCommentObserver.unobserve(lastCommentElementRef.current);
            }
        };
    }, [loadMoreComments, hasMore, comments.length]);

    // 게시글 및 댓글 가져오기
    useEffect(() => {
        let isMounted = true; // 언마운트 감지 플래그
        // 새로운 요청이 시작될 때마다 이전 요청을 취소할 수 있도록 AbortController 인스턴스 생성
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchPostAndComments = async () => {
            setLoading(true);
            try {
                // 카테고리 정보 가져오기
                const categoryResponse = await axios.get(`${API_URL}/post/categories`, {
                    signal: signal
                });
                const categoriesData = categoryResponse.data.data.map((category: any) => ({
                    ...category,
                    icon: getCategoryIcon(category.id),
                    color: getCategoryColor(category.id)
                }));

                // 게시글 상세 정보 가져오기
                const postResponse = await axios.get(`${API_URL}/post/${postId}`, {
                    signal: signal
                });

                // 댓글 정보 가져오기 (첫 offset만)
                const commentResponse = await axios.get(`${API_URL}/post/${postId}/comments`, {
                    params: {
                        offset: 0,
                        size: COMMENTS_PER_PAGE
                    },
                    signal: signal
                });

                // 언마운트된 경우 상태 업데이트 건너뛰기
                if (!isMounted) return;

                setCategories(categoriesData);
                setPost(postResponse.data.data);

                const commentsData = commentResponse.data.data || [];
                setComments(commentsData);

                // 불러온 댓글 수가 요청한 수보다 적으면 더 이상 댓글이 없다고 판단
                setHasMore(commentsData.length === COMMENTS_PER_PAGE);

                // 좋아요 상태 확인 (로그인한 경우)
                if (isAuthenticated) {
                    const likeStatusResponse = await axios.get(`${API_URL}/post/${postId}/like/check?userId=${user?.userId}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                        }
                    });
                    setIsLiked(likeStatusResponse.data.data.liked);
                }

                setError(null);
            } catch (err) {
                if (isMounted) {
                    console.error('데이터 불러오기 오류:', err);
                    setError('게시글을 불러오는 중 오류가 발생했습니다.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchPostAndComments();

        return () => {
            isMounted = false;
            controller.abort(); // 진행 중이던 모든 요청 취소
        };
    }, [postId, isAuthenticated]);

    // 카테고리 아이콘 매핑 함수
    const getCategoryIcon = (categoryId: string) => {
        switch (categoryId) {
            case 'development': return <HiOutlineLightBulb />;
            case 'daily': return <HiOutlineHeart />;
            case 'etc': return <HiOutlineEye />;
            case 'announcements': return <HiOutlineSpeakerphone />;
            case 'help': return <HiOutlineQuestionMarkCircle />;
            default: return <HiOutlineGlobe />;
        }
    };

    // 카테고리 색상 매핑 함수
    const getCategoryColor = (categoryId: string) => {
        switch (categoryId) {
            case 'development': return 'bg-yellow-500';
            case 'daily': return 'bg-pink-500';
            case 'etc': return 'bg-purple-500';
            case 'announcements': return 'bg-red-500';
            case 'help': return 'bg-orange-500';
            default: return 'bg-gray-500';
        }
    };

    // 카테고리 이름 가져오기
    const getCategoryName = (categoryId: string) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : categoryId;
    };

    // 날짜 포맷 함수
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    // 댓글 추가 처리
    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!commentText.trim()) return;
        if (!isAuthenticated) {
            alert('댓글을 작성하려면 로그인이 필요합니다.');
            return;
        }

        setCommentLoading(true);
        try {
            const response = await axios.post(`${API_URL}/post/${postId}/comment`, {
                content: commentText,
                userId: user?.userId,
                postId: Number(postId)
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            // 새 댓글 추가 (클라이언트에서 필요한 정보 보충)
            const currentTime = getCurrentTimeISO();
            const newComment: Comment = {
                ...response.data.data,
                userNm: user?.userNm || '익명',
                profileImgUrl: user?.profileImgUrl,
                regDt: response.data.data.regDt || currentTime,
                modDt: response.data.data.modDt || currentTime
            };

            // 댓글 목록의 앞부분에 새 댓글 추가
            setComments([newComment, ...comments]);
            setCommentText('');

            // 게시글의 댓글 수 업데이트
            if (post) {
                setPost({
                    ...post,
                    commentCnt: post.commentCnt + 1
                });
            }
        } catch (err) {
            console.error('댓글 등록 오류:', err);
            alert('댓글 등록에 실패했습니다.');
            // 오류 발생 시 최신 댓글 목록 다시 가져오기
            await refreshComments();
        } finally {
            setCommentLoading(false);
        }
    };

    // 좋아요 토글 처리
    const handleLikeToggle = async () => {
        if (!isAuthenticated) {
            alert('좋아요를 하려면 로그인이 필요합니다.');
            return;
        }

        try {
            if (isLiked) {
                // 좋아요 취소
                await axios.delete(`${API_URL}/post/${postId}/like?userId=${user?.userId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });

                if (post) {
                    setPost({
                        ...post,
                        likeCnt: post.likeCnt - 1
                    });
                }
            } else {
                // 좋아요 추가
                await axios.post(`${API_URL}/post/${postId}/like?userId=${user?.userId}`, {
                    userId: user?.userId,
                    postId: Number(postId)
                }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });

                if (post) {
                    setPost({
                        ...post,
                        likeCnt: post.likeCnt + 1
                    });
                }
            }

            // 좋아요 상태 토글
            setIsLiked(!isLiked);
        } catch (err) {
            console.error('좋아요 처리 오류:', err);
            alert('좋아요 처리에 실패했습니다.');
        }
    };

    // 게시글 삭제 처리
    const handleDeletePost = async () => {
        if (!post || !isAuthenticated || user?.userId !== post.userId) {
            alert('게시글 삭제 권한이 없습니다.');
            return;
        }

        if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            return;
        }

        try {
            await axios.delete(`${API_URL}/post/${postId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            alert('게시글이 삭제되었습니다.');
            navigate('/board'); // 목록으로 이동
        } catch (err) {
            console.error('게시글 삭제 오류:', err);
            alert('게시글 삭제에 실패했습니다.');
        }
    };

    // 댓글 삭제 처리
    const handleDeleteComment = async (commentId: number) => {
        if (!isAuthenticated) {
            alert('댓글 삭제 권한이 없습니다.');
            return;
        }

        if (!window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
            return;
        }

        try {
            const baseUrl = new URL(`${API_URL}/post/${commentId}/comment`);
            baseUrl.searchParams.append('postId', String(postId));
            console.log('요청 URL:', baseUrl.toString());

            await axios.delete(baseUrl.toString(), {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            // 댓글 목록에서 제거
            setComments(comments.filter(comment => comment.commentId !== commentId));

            // 게시글의 댓글 수 업데이트
            if (post) {
                setPost({
                    ...post,
                    commentCnt: post.commentCnt - 1
                });
            }

            alert('댓글이 삭제되었습니다.');
        } catch (err) {
            console.error('댓글 삭제 오류:', err);
            alert('댓글 삭제에 실패했습니다.');
        }
    };

    // 댓글 더 불러오기 버튼 클릭 핸들러
    const handleLoadMoreCommentsClick = () => {
        loadMoreComments();
    };

    // 로딩 중 표시
    if (loading) {
        return (
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    // 게시글이 없는 경우
    if (!post) {
        return (
            <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center">
                <p className="text-xl mb-4">게시글을 찾을 수 없습니다.</p>
                <Link to="/board" className="btn btn-primary">
                    게시판으로 돌아가기
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100">
            <div className="container mx-auto px-4 py-8">
                {/* 상단 네비게이션 */}
                <div className="mb-6">
                    <button
                        className="flex items-center text-base-content hover:text-primary"
                        onClick={() => navigate('/board')}
                    >
                        <HiChevronLeft className="mr-1" />
                        게시판으로 돌아가기
                    </button>
                </div>

                <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden mb-6">
                    {/* 게시글 헤더 */}
                    <div className="p-6 border-b border-base-300">
                        {/* 카테고리 표시 */}
                        <div className="flex items-center mb-4">
                            <div className={`w-6 h-6 rounded-md flex items-center justify-center text-white ${getCategoryColor(post.categoryId)}`}>
                                {getCategoryIcon(post.categoryId)}
                            </div>
                            <span className="ml-2 text-sm font-medium text-base-content/70">
                                {getCategoryName(post.categoryId)}
                            </span>

                            {post.isNotice && (
                                <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                    공지
                                </span>
                            )}
                        </div>

                        {/* 제목 */}
                        <h1 className="text-2xl font-bold text-base-content mb-4">{post.title}</h1>

                        {/* 작성자 정보 및 메타데이터 */}
                        <div className="flex flex-wrap items-center justify-between">
                            <div className="flex items-center mb-2 sm:mb-0">
                                <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                                    {post?.profileImgUrl ? (
                                        <img
                                            src={post.profileImgUrl}
                                            alt={post.userNm || '프로필'}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full text-xs bg-primary text-primary-content flex items-center justify-center">
                                            {post?.userNm?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <span className="font-medium text-base-content">{post.userNm}</span>
                                    <div className="flex items-center text-xs text-base-content/70">
                                        <HiOutlineCalendar className="mr-1" />
                                        <span>{formatDate(post.regDt)}</span>
                                        {post.modDt !== post.regDt && (
                                            <>
                                                <span className="mx-1">·</span>
                                                <HiOutlineClock className="mr-1" />
                                                <span>수정됨: {formatDate(post.modDt)}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center text-base-content/70">
                                    <HiOutlineEye className="mr-1" />
                                    <span>{post.viewCnt}</span>
                                </div>
                                <div className="flex items-center text-base-content/70">
                                    <HiOutlineChatAlt className="mr-1" />
                                    <span>{post.commentCnt}</span>
                                </div>
                                <button
                                    className={`flex items-center ${isLiked ? 'text-red-500' : 'text-base-content/70'}`}
                                    onClick={handleLikeToggle}
                                >
                                    <HiOutlineHeart className="mr-1" />
                                    <span>{post.likeCnt}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 게시글 본문 */}
                    <div className="p-6 border-b border-base-300">
                        <div className="prose max-w-none text-base-content">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    // @ts-ignore TypeScript 타입 오류 무시
                                    code({ node, inline, className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || '');
                                        return !inline && match ? (
                                            <SyntaxHighlighter
                                                // @ts-ignore TypeScript 타입 오류 무시
                                                style={vscDarkPlus}
                                                language={match[1]}
                                                PreTag="div"
                                                {...props}
                                            >
                                                {String(children).replace(/\n$/, '')}
                                            </SyntaxHighlighter>
                                        ) : (
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        );
                                    },
                                    // 테이블 렌더링 개선
                                    table: ({ node, ...props }) => (
                                        <div className="overflow-x-auto my-4">
                                            <table className="table-auto border-collapse border border-base-300 w-full" {...props} />
                                        </div>
                                    ),
                                    th: ({ node, ...props }) => (
                                        <th className="border border-base-300 px-4 py-2 bg-base-200 font-medium" {...props} />
                                    ),
                                    td: ({ node, ...props }) => <td className="border border-base-300 px-4 py-2" {...props} />,
                                    // 링크 스타일
                                    a: ({ node, ...props }) => (
                                        <a className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
                                    ),
                                    // 이미지 스타일
                                    img: ({ node, ...props }) => (
                                        <img className="max-w-full my-4 rounded-md" {...props} />
                                    ),
                                    // 헤더 스타일
                                    h1: ({ node, ...props }) => (
                                        <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />
                                    ),
                                    h2: ({ node, ...props }) => (
                                        <h2 className="text-xl font-bold mt-5 mb-3" {...props} />
                                    ),
                                    h3: ({ node, ...props }) => (
                                        <h3 className="text-lg font-bold mt-4 mb-2" {...props} />
                                    ),
                                    // 리스트 스타일
                                    ul: ({ node, ...props }) => (
                                        <ul className="list-disc pl-6 my-4" {...props} />
                                    ),
                                    ol: ({ node, ...props }) => (
                                        <ol className="list-decimal pl-6 my-4" {...props} />
                                    ),
                                    // 인용구 스타일
                                    blockquote: ({ node, ...props }) => (
                                        <blockquote className="border-l-4 border-gray-300 pl-4 py-2 my-4 bg-gray-50/10" {...props} />
                                    ),
                                }}
                            >
                                {post.content}
                            </ReactMarkdown>
                        </div>
                    </div>

                    {/* 게시글 하단 액션 버튼 */}
                    <div className="p-4 bg-base-200 flex items-center justify-between">
                        <button
                            className={`flex items-center px-3 py-1.5 rounded-md ${isLiked ? 'bg-red-100 text-red-800' : 'bg-base-300 text-base-content'}`}
                            onClick={handleLikeToggle}
                        >
                            <HiOutlineHeart className="mr-1" />
                            <span>{isLiked ? '좋아요 취소' : '좋아요'}</span>
                        </button>

                        {/* 작성자인 경우에만 수정/삭제 버튼 표시 */}
                        {isAuthenticated && user?.userId === post.userId && (
                            <div className="flex gap-2">
                                <Link
                                    to={`/board/edit/${post.postId}`}
                                    className="flex items-center px-3 py-1.5 bg-base-300 text-base-content rounded-md"
                                >
                                    <HiOutlinePencil className="mr-1" />
                                    <span>수정</span>
                                </Link>
                                <button
                                    className="flex items-center px-3 py-1.5 bg-red-100 text-red-800 rounded-md"
                                    onClick={handleDeletePost}
                                >
                                    <HiOutlineTrash className="mr-1" />
                                    <span>삭제</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* 댓글 영역 */}
                <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-base-300">
                        <h2 className="text-lg font-semibold text-base-content">
                            댓글 <span className="text-primary">{post.commentCnt}</span>
                        </h2>
                    </div>

                    {/* 댓글 목록 */}
                    <div className="divide-y divide-base-300">
                        {comments.length > 0 ? (
                            <>
                                {comments.map((comment, index) => (
                                    <div
                                        key={comment.commentId}
                                        className="p-4"
                                        // 마지막 댓글 요소에 참조 설정
                                        ref={index === comments.length - 1 ? lastCommentElementRef : null}
                                    >
                                        <div className="flex items-start">
                                            <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                                                {comment?.profileImgUrl ? (
                                                    <img
                                                        src={comment.profileImgUrl}
                                                        alt={comment.userNm || '프로필'}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full text-xs bg-primary text-primary-content flex items-center justify-center">
                                                        {comment?.userNm?.charAt(0).toUpperCase() || 'U'}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="font-medium text-base-content">{comment.userNm}</span>
                                                        <span className="ml-2 text-xs text-base-content/70">{formatDate(comment.regDt)}</span>
                                                    </div>

                                                    {/* 자신의 댓글인 경우에만 삭제 버튼 표시 */}
                                                    {isAuthenticated && user?.userId === comment.userId && (
                                                        <button
                                                            className="text-base-content/50 hover:text-red-500"
                                                            onClick={() => handleDeleteComment(comment.commentId)}
                                                        >
                                                            <HiOutlineTrash />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="mt-1 text-base-content whitespace-pre-wrap">
                                                    {comment.content}
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
                                {hasMore && !loadingMore && (
                                    <div className="p-4 flex justify-center">
                                        <button
                                            className="btn btn-outline btn-sm flex items-center gap-1"
                                            onClick={handleLoadMoreCommentsClick}
                                        >
                                            <HiOutlineRefresh className="w-4 h-4" />
                                            댓글 더 불러오기
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="p-8 text-center text-base-content/70">
                                아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
                            </div>
                        )}
                    </div>

                    {/* 댓글 작성 폼 */}
                    <div className="p-4 bg-base-200 border-t border-base-300">
                        {isAuthenticated ? (
                            <form onSubmit={handleCommentSubmit}>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full overflow-hidden">
                                        {user?.profileImgUrl ? (
                                            <img
                                                src={user.profileImgUrl}
                                                alt={user?.userNm || '프로필'}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full text-xs bg-primary text-primary-content flex items-center justify-center">
                                                {user?.userNm?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow">
                                        <textarea
                                            className="w-full p-3 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-base-100 text-base-content resize-y min-h-[80px]"
                                            placeholder="댓글을 작성하세요"
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            required
                                            disabled={commentLoading}
                                        ></textarea>
                                        <div className="flex justify-end mt-2">
                                            <button
                                                type="submit"
                                                className={`btn btn-primary ${commentLoading ? 'loading' : ''}`}
                                                disabled={commentLoading || !commentText.trim()}
                                            >
                                                <HiOutlineReply className="mr-1" />
                                                댓글 작성
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="flex items-center justify-center p-4 bg-base-100 rounded-md">
                                <p className="text-base-content/80 mr-2">댓글을 작성하려면 로그인이 필요합니다.</p>
                                <Link to="/login" className="btn btn-primary btn-sm">
                                    로그인하기
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BoardDetail;