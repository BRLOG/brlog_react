import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    HiOutlineStar,
    HiOutlineCheck,
    HiOutlineInformationCircle
} from 'react-icons/hi';
import {
    RiBold,
    RiItalic,
    RiListOrdered,
    RiListUnordered,
    RiLinkM,
    RiCodeSSlashLine,
    RiHeading,
    RiQuoteText,
    RiImage2Line,
    RiNotionLine
} from 'react-icons/ri';

// API 기본 URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090';

// 카테고리 인터페이스
interface Category {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

const BoardWrite: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth(); // 인증 상태 가져오기

    // 상태 관리
    const [selectedCategory, setSelectedCategory] = useState<string>('development');
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    // 인증 상태 확인 및 리디렉션
    useEffect(() => {
        if (!isAuthenticated) {
            alert('게시글 작성을 위해 로그인이 필요합니다.');
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // 카테고리 목록 가져오기
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${API_URL}/post/categories`);
                const categoriesData = response.data.data.map((category: Category) => ({
                    ...category,
                    icon: getCategoryIcon(category.id), // 아이콘 매핑 함수 추가
                    color: getCategoryColor(category.id) // 색상 매핑 함수 추가
                }));

                console.log('categoriesData?: ', categoriesData)
                setCategories(categoriesData);


            } catch (error) {
                console.error('카테고리 로딩 중 오류:', error);
                setError('카테고리를 불러오는 중 오류가 발생했습니다.');
            }
        };
    
        fetchCategories();
    }, []);

    // 카테고리 아이콘 매핑 함수
    const getCategoryIcon = (categoryId: string) => {
        switch (categoryId) {
            case 'development': return <HiOutlineLightBulb />;
            case 'daily': return <HiOutlineHeart />;
            case 'etc': return <HiOutlineStar />;
            case 'announcements': return <HiOutlineSpeakerphone />;
            case 'help': return <HiOutlineQuestionMarkCircle />;
            default: return <HiOutlineStar />;
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
            default: return 'bg-purple-500';
        }
    };

    // 선택된 카테고리
    console.log('categories?: ', categories)
    // 기본 카테고리 설정
    const defaultCategory = {
        id: 'development',
        name: '개발',
        description: '개발 관련 게시글 공유',
        icon: <HiOutlineLightBulb />,
        color: 'bg-yellow-500'
    };
    const currentCategory = categories.find(cat => cat.id === selectedCategory) || (categories.length > 0 ? categories[0] : defaultCategory);

    // 게시글 등록 처리
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            setError('제목을 입력해주세요.');
            return;
        }

        if (!content.trim()) {
            setError('내용을 입력해주세요.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // API 호출하여 게시글 저장
            const response = await axios.post(`${API_URL}/post`, {
                categoryId: selectedCategory,
                title: title,
                content: content
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            console.log('게시글 등록 응답:', response.data);
            
            // 성공 시 게시판 목록으로 이동
            alert('게시글이 등록되었습니다.');
            navigate('/board');
        } catch (err: any) {
            console.error('게시글 등록 중 오류:', err);
            setError(err.response?.data?.message || '게시글 등록에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 마크다운 서식 적용
    const applyMarkdown = (format: string) => {
        const textarea = document.getElementById('content') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);

        let formattedText = '';
        let cursorPosition = 0;

        switch (format) {
            case 'bold':
                formattedText = `**${selectedText}**`;
                cursorPosition = selectedText ? 0 : 2;
                break;
            case 'italic':
                formattedText = `*${selectedText}*`;
                cursorPosition = selectedText ? 0 : 1;
                break;
            case 'heading':
                formattedText = `\n### ${selectedText}\n`;
                cursorPosition = selectedText ? 0 : 5;
                break;
            case 'link':
                formattedText = `[${selectedText || '링크 텍스트'}](url)`;
                cursorPosition = selectedText ? formattedText.length - 1 : 1;
                break;
            case 'code':
                formattedText = `\`\`\`\n${selectedText || '코드 입력'}\n\`\`\``;
                cursorPosition = selectedText ? 0 : 4;
                break;
            case 'list-ordered':
                formattedText = `\n1. ${selectedText || '항목'}\n2. 항목\n`;
                cursorPosition = selectedText ? 0 : 4;
                break;
            case 'list-unordered':
                formattedText = `\n- ${selectedText || '항목'}\n- 항목\n`;
                cursorPosition = selectedText ? 0 : 3;
                break;
            case 'quote':
                formattedText = `\n> ${selectedText || '인용문'}\n`;
                cursorPosition = selectedText ? 0 : 3;
                break;
            case 'image':
                formattedText = `![${selectedText || '이미지 설명'}](이미지URL)`;
                cursorPosition = selectedText ? 0 : 2;
                break;
            case 'mention':
                formattedText = `@${selectedText || '사용자'}`;
                cursorPosition = selectedText ? 0 : 1;
                break;
            default:
                formattedText = selectedText;
        }

        const newValue = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
        setContent(newValue);

        // 텍스트 선택 시 다시 선택 상태로, 아니면 커서 위치 조정
        setTimeout(() => {
            textarea.focus();
            if (selectedText) {
                textarea.setSelectionRange(start, start + formattedText.length);
            } else {
                textarea.setSelectionRange(start + formattedText.length - cursorPosition, start + formattedText.length - cursorPosition);
            }
        }, 0);
    };

    // 파일 업로드 처리
    const handleFileUpload = async (file: File) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${API_URL}/post/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            // 업로드된 파일 URL을 에디터에 삽입
            const fileUrl = response.data.data.fileUrl;
            const fileType = file.type.startsWith('image/') ? 'image' : 'file';

            if (fileType === 'image') {
                // 이미지 삽입
                applyMarkdown('image');
                const textarea = document.getElementById('content') as HTMLTextAreaElement;
                const insertText = `![${file.name}](${fileUrl})`;
                const cursorPos = textarea.selectionStart;
                setContent(
                    textarea.value.substring(0, cursorPos) + 
                    insertText + 
                    textarea.value.substring(cursorPos)
                );
            } else {
                // 파일 링크 삽입
                const insertText = `[${file.name}](${fileUrl})`;
                const textarea = document.getElementById('content') as HTMLTextAreaElement;
                const cursorPos = textarea.selectionStart;
                setContent(
                    textarea.value.substring(0, cursorPos) + 
                    insertText + 
                    textarea.value.substring(cursorPos)
                );
            }
        } catch (err) {
            console.error('파일 업로드 오류:', err);
            setError('파일 업로드에 실패했습니다.');
        }
    };

    // 드래그 앤 드롭 이벤트 처리
    const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            handleFileUpload(file);
        }
    };

    // 붙여넣기 이벤트 처리 (이미지 붙여넣기용)
    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const items = e.clipboardData.items;
        
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    handleFileUpload(file);
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-base-100">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6 text-base-content">새 게시글 작성하기</h1>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* 왼쪽 글쓰기 영역 */}
                    <div className="w-full lg:w-3/4">
                        <form onSubmit={handleSubmit}>
                            {/* 오류 메시지 표시 */}
                            {error && (
                                <div className="alert alert-error mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* 카테고리 선택 */}
                            <div className="mb-6">
                                <div className="border border-base-300 rounded-lg overflow-hidden">
                                    <div className="p-4 flex items-center gap-3 border-b border-base-300 bg-base-100">
                                        <div className={`w-9 h-9 rounded-md flex items-center justify-center text-white ${currentCategory.color}`}>
                                            {currentCategory.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-base-content">{currentCategory.name}</h3>
                                            <p className="text-sm text-base-content/70">{currentCategory.description}</p>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-base-100 text-sm">
                                        <p className="text-base-content/50">
                                            카테고리가 적절하지 않나요?
                                            <button
                                                type="button"
                                                className="text-primary bg-base-300 ml-1 hover:underline"
                                                onClick={() => (document.getElementById('category-modal') as HTMLDialogElement)?.showModal()}
                                            >
                                                다른 카테고리 선택하기
                                            </button>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* 제목 입력 */}
                            <div className="mb-6">
                                <label htmlFor="title" className="block text-lg font-medium mb-2 text-base-content">제목 추가</label>
                                <input
                                    type="text"
                                    id="title"
                                    className="w-full px-4 py-2 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-base-100 text-base-content"
                                    placeholder="제목을 입력하세요"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {/* 내용 입력 */}
                            <div className="mb-6 border border-base-300 rounded-lg overflow-hidden">
                                <div className="border-b border-base-300 bg-base-200 flex">
                                    <button
                                        type="button"
                                        className={`px-4 py-2 text-sm text-base-content ${activeTab === 'write' ? 'bg-base-100 border-r border-b-0 border-base-300 rounded-t-lg font-medium' : 'text-base-content/70 hover:text-base-content'}`}
                                        onClick={() => setActiveTab('write')}
                                    >
                                        작성
                                    </button>
                                    <button
                                        type="button"
                                        className={`px-4 py-2 text-sm text-base-content ${activeTab === 'preview' ? 'bg-base-100 border-l border-b-0 border-base-300 rounded-t-lg font-medium' : 'text-base-content/70 hover:text-base-content'}`}
                                        onClick={() => setActiveTab('preview')}
                                    >
                                        미리보기
                                    </button>
                                </div>

                                {activeTab === 'write' ? (
                                    <div>
                                        {/* 에디터 툴바 */}
                                        <div className="p-2 border-b border-base-300 flex flex-wrap items-center gap-1">
                                            <button
                                                type="button"
                                                className="p-2 rounded hover:bg-base-200"
                                                title="볼드"
                                                onClick={() => applyMarkdown('bold')}
                                                disabled={loading}
                                            >
                                                <RiBold className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                className="p-2 rounded hover:bg-base-200"
                                                title="이탤릭"
                                                onClick={() => applyMarkdown('italic')}
                                                disabled={loading}
                                            >
                                                <RiItalic className="w-4 h-4" />
                                            </button>
                                            <div className="w-px h-5 bg-base-300 mx-1"></div>
                                            <button
                                                type="button"
                                                className="p-2 rounded hover:bg-base-200"
                                                title="헤딩"
                                                onClick={() => applyMarkdown('heading')}
                                                disabled={loading}
                                            >
                                                <RiHeading className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                className="p-2 rounded hover:bg-base-200"
                                                title="링크"
                                                onClick={() => applyMarkdown('link')}
                                                disabled={loading}
                                            >
                                                <RiLinkM className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                className="p-2 rounded hover:bg-base-200"
                                                title="코드 블록"
                                                onClick={() => applyMarkdown('code')}
                                                disabled={loading}
                                            >
                                                <RiCodeSSlashLine className="w-4 h-4" />
                                            </button>
                                            <div className="w-px h-5 bg-base-300 mx-1"></div>
                                            <button
                                                type="button"
                                                className="p-2 rounded hover:bg-base-200"
                                                title="순서 있는 목록"
                                                onClick={() => applyMarkdown('list-ordered')}
                                                disabled={loading}
                                            >
                                                <RiListOrdered className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                className="p-2 rounded hover:bg-base-200"
                                                title="순서 없는 목록"
                                                onClick={() => applyMarkdown('list-unordered')}
                                                disabled={loading}
                                            >
                                                <RiListUnordered className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                className="p-2 rounded hover:bg-base-200"
                                                title="인용구"
                                                onClick={() => applyMarkdown('quote')}
                                                disabled={loading}
                                            >
                                                <RiQuoteText className="w-4 h-4" />
                                            </button>
                                            <div className="w-px h-5 bg-base-300 mx-1"></div>
                                            <button
                                                type="button"
                                                className="p-2 rounded hover:bg-base-200"
                                                title="이미지"
                                                onClick={() => applyMarkdown('image')}
                                                disabled={loading}
                                            >
                                                <RiImage2Line className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                className="p-2 rounded hover:bg-base-200"
                                                title="멘션"
                                                onClick={() => applyMarkdown('mention')}
                                                disabled={loading}
                                            >
                                                <RiNotionLine className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* 텍스트 에어리어 */}
                                        <textarea
                                            id="content"
                                            className="w-full p-4 min-h-[300px] bg-base-100 text-base-content resize-y focus:outline-none"
                                            placeholder="내용을 작성하세요..."
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            onDrop={handleDrop}
                                            onPaste={handlePaste}
                                            required
                                            disabled={loading}
                                        ></textarea>
                                    </div>
                                ) : (
                                    <div className="p-4 min-h-[300px] bg-base-100 overflow-auto">
                                        {content ? (
                                            <div className="markdown-preview prose prose-sm md:prose lg:prose-lg max-w-none">
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
                                                        td: ({ node, ...props }) => (
                                                            <td className="border border-base-300 px-4 py-2" {...props} />
                                                        ),
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
                                                    {content}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            <div className="text-base-content/50 italic">아직 작성된 내용이 없습니다.</div>
                                        )}
                                    </div>
                                )}

                                <div className="p-3 bg-base-200 border-t border-base-300 flex items-center text-xs text-base-content/70">
                                    <div className="flex items-center gap-1">
                                        <span className="font-mono">Markdown</span>
                                        <span>이 지원됩니다</span>
                                    </div>
                                    <div className="grow"></div>
                                    <div>
                                        첨부 파일은 드래그 앤 드롭 또는 클립보드에서 붙여넣기 가능
                                    </div>
                                </div>
                            </div>

                            {/* 하단 컨트롤 */}
                            <div className="flex items-center justify-end mt-6">
                                <button
                                    type="button"
                                    className="btn btn-outline mr-2"
                                    onClick={() => navigate('/board')}
                                    disabled={loading}
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className={`btn btn-primary ${loading ? 'loading' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? '저장 중...' : '게시글 저장'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* 오른쪽 도움말 영역 */}
                    <div className="w-full lg:w-1/4">
                        <div className="border border-base-300 rounded-lg overflow-hidden bg-base-100">
                            <div className="p-4 border-b border-base-300">
                                <h3 className="font-medium text-base-content">도움말</h3>
                            </div>

                            <div className="p-4">
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2">
                                        <div className="text-primary pt-1">
                                            <HiOutlineCheck className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm text-base-content/50">제목은 명확하고 구체적으로 작성하세요.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="text-primary pt-1">
                                            <HiOutlineCheck className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm text-base-content/50">마크다운을 사용하여 글을 구조화하세요.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="text-primary pt-1">
                                            <HiOutlineCheck className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm text-base-content/50">이미지나 코드 예제를 첨부하면 이해하기 쉽습니다.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="text-primary pt-1">
                                            <HiOutlineCheck className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm text-base-content/50">커뮤니티 가이드라인을 준수해주세요.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="p-4 bg-base-200 border-t border-base-300">
                                <div className="flex items-start gap-2 text-sm">
                                    <div className="text-primary pt-1">
                                        <HiOutlineInformationCircle className="w-4 h-4" />
                                    </div>
                                    <span className="text-base-content/50">
                                        작성한 게시글은 모든 사용자에게 공개됩니다. 개인정보가 포함되지 않도록 주의하세요.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 카테고리 선택 모달 */}
            <dialog id="category-modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4 text-base-content">카테고리 선택</h3>
                    <div className="space-y-3">
                        {categories.map(category => (
                            <div
                                key={category.id}
                                className={`p-3 border rounded-lg flex items-center gap-3 cursor-pointer hover:bg-base-200 ${selectedCategory === category.id ? 'border-primary bg-base-200' : 'border-base-300'
                                    }`}
                                onClick={() => {
                                    setSelectedCategory(category.id);
                                    (document.getElementById('category-modal') as HTMLDialogElement)?.close();
                                }}
                            >
                                <div className={`w-9 h-9 rounded-md flex items-center justify-center text-white ${category.color}`}>
                                    {category.icon}
                                </div>
                                <div>
                                    <h4 className="font-medium text-base-content">{category.name}</h4>
                                    <p className="text-sm text-base-content/70">{category.description}</p>
                                </div>
                                {selectedCategory === category.id && (
                                    <div className="ml-auto">
                                        <HiOutlineCheck className="w-5 h-5 text-primary" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">닫기</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default BoardWrite;