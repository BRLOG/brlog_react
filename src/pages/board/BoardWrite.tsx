import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    HiOutlineGlobe,
    HiOutlineQuestionMarkCircle,
    HiOutlineLightBulb,
    HiOutlineSpeakerphone,
    HiOutlineHeart,
    HiOutlineEye,
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

// 카테고리 인터페이스
interface Category {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

// 카테고리 목록
const categories: Category[] = [
    {
        id: 'general',
        name: '일반',
        description: '다른 곳에 맞지 않는 일반 토론',
        icon: <HiOutlineGlobe className="w-5 h-5" />,
        color: 'bg-blue-500'
    },
    {
        id: 'help',
        name: '도움말',
        description: '질문 및 도움 요청',
        icon: <HiOutlineQuestionMarkCircle className="w-5 h-5" />,
        color: 'bg-orange-500'
    },
    {
        id: 'ideas',
        name: '아이디어',
        description: '새로운 아이디어 및 제안',
        icon: <HiOutlineLightBulb className="w-5 h-5" />,
        color: 'bg-yellow-500'
    },
    {
        id: 'announcements',
        name: '공지사항',
        description: '중요 공지 및 업데이트',
        icon: <HiOutlineSpeakerphone className="w-5 h-5" />,
        color: 'bg-red-500'
    },
    {
        id: 'kind-words',
        name: '응원메시지',
        description: '긍정적인 피드백 및 감사',
        icon: <HiOutlineHeart className="w-5 h-5" />,
        color: 'bg-pink-500'
    },
    {
        id: 'show-and-tell',
        name: '공유하기',
        description: '작업 결과물 또는 경험 공유',
        icon: <HiOutlineEye className="w-5 h-5" />,
        color: 'bg-purple-500'
    }
];

const BoardWrite: React.FC = () => {
    const navigate = useNavigate();

    // 상태 관리
    const [selectedCategory, setSelectedCategory] = useState<string>('general');
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
    const [hasSearched, setHasSearched] = useState<boolean>(false);

    // 선택된 카테고리
    const currentCategory = categories.find(cat => cat.id === selectedCategory) || categories[0];

    // 게시글 등록 처리
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }

        if (!content.trim()) {
            alert('내용을 입력해주세요.');
            return;
        }

        // 여기서 API 호출 등의 작업을 수행
        console.log({
            category: selectedCategory,
            title,
            content
        });

        // 성공 시 게시판 목록으로 이동
        alert('게시글이 등록되었습니다.');
        navigate('/board');
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

    return (
        <div className="min-h-screen bg-base-100">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6 text-base-content">새 토론 시작하기</h1>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* 왼쪽 글쓰기 영역 */}
                    <div className="w-full lg:w-3/4">
                        <form onSubmit={handleSubmit}>
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
                                        <p>
                                            카테고리가 적절하지 않나요?
                                            <button
                                                type="button"
                                                className="text-primary ml-1 hover:underline"
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
                                <label htmlFor="title" className="block text-lg font-medium mb-2">제목 추가</label>
                                <input
                                    type="text"
                                    id="title"
                                    className="w-full px-4 py-2 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-base-100 text-base-content"
                                    placeholder="제목을 입력하세요"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            {/* 내용 입력 */}
                            <div className="mb-6 border border-base-300 rounded-lg overflow-hidden">
                                <div className="border-b border-base-300 bg-base-200 flex">
                                    <button
                                        type="button"
                                        className={`px-4 py-2 text-sm ${activeTab === 'write' ? 'bg-base-100 border-r border-b-0 border-base-300 rounded-t-lg font-medium' : 'text-base-content/70 hover:text-base-content'}`}
                                        onClick={() => setActiveTab('write')}
                                    >
                                        작성
                                    </button>
                                    <button
                                        type="button"
                                        className={`px-4 py-2 text-sm ${activeTab === 'preview' ? 'bg-base-100 border-l border-b-0 border-base-300 rounded-t-lg font-medium' : 'text-base-content/70 hover:text-base-content'}`}
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
                                            >
                                                <RiBold className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                className="p-2 rounded hover:bg-base-200"
                                                title="이탤릭"
                                                onClick={() => applyMarkdown('italic')}
                                            >
                                                <RiItalic className="w-4 h-4" />
                                            </button>
                                            <div className="w-px h-5 bg-base-300 mx-1"></div>
                                            <button
                                                type="button"
                                                className="p-2 rounded hover:bg-base-200"
                                                title="헤딩"
                                                onClick={() => applyMarkdown('heading')}
                                            >
                                                <RiHeading className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                className="p-2 rounded hover:bg-base-200"
                                                title="링크"
                                                onClick={() => applyMarkdown('link')}
                                            >
                                                <RiLinkM className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                className="p-2 rounded hover:bg-base-200"
                                                title="코드 블록"
                                                onClick={() => applyMarkdown('code')}
                                            >
                                                <RiCodeSSlashLine className="w-4 h-4" />
                                            </button>
                                            <div className="w-px h-5 bg-base-300 mx-1"></div>
                                            <button
                                                type="button"
                                                className="p-2 rounded hover:bg-base-200"
                                                title="순서 있는 목록"
                                                onClick={() => applyMarkdown('list-ordered')}
                                            >
                                                <RiListOrdered className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                className="p-2 rounded hover:bg-base-200"
                                                title="순서 없는 목록"
                                                onClick={() => applyMarkdown('list-unordered')}
                                            >
                                                <RiListUnordered className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                className="p-2 rounded hover:bg-base-200"
                                                title="인용구"
                                                onClick={() => applyMarkdown('quote')}
                                            >
                                                <RiQuoteText className="w-4 h-4" />
                                            </button>
                                            <div className="w-px h-5 bg-base-300 mx-1"></div>
                                            <button
                                                type="button"
                                                className="p-2 rounded hover:bg-base-200"
                                                title="이미지"
                                                onClick={() => applyMarkdown('image')}
                                            >
                                                <RiImage2Line className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                className="p-2 rounded hover:bg-base-200"
                                                title="멘션"
                                                onClick={() => applyMarkdown('mention')}
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
                                            required
                                        ></textarea>
                                    </div>
                                ) : (
                                    <div className="p-4 min-h-[300px] bg-base-100 prose max-w-none">
                                        {content ? (
                                            <div className="markdown-preview">
                                                {/* 실제 구현에서는 마크다운 변환 라이브러리 사용 (예: react-markdown) */}
                                                <div className="whitespace-pre-wrap">{content}</div>
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
                            <div className="flex items-center justify-between mt-6">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="search-similar"
                                        className="checkbox checkbox-sm"
                                        checked={hasSearched}
                                        onChange={(e) => setHasSearched(e.target.checked)}
                                    />
                                    <label htmlFor="search-similar" className="ml-2 text-sm text-base-content/80">
                                        유사한 토론 검색을 했습니다
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    토론 시작하기
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* 오른쪽 도움말 영역 */}
                    <div className="w-full lg:w-1/4">
                        <div className="border border-base-300 rounded-lg overflow-hidden bg-base-100">
                            <div className="p-4 border-b border-base-300">
                                <h3 className="font-medium">도움말</h3>
                            </div>

                            <div className="p-4">
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2">
                                        <div className="text-primary pt-1">
                                            <HiOutlineCheck className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm">질문하기 전에 관련 토론이 있는지 검색해보세요.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="text-primary pt-1">
                                            <HiOutlineCheck className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm">제목은 명확하고 구체적으로 작성하세요.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="text-primary pt-1">
                                            <HiOutlineCheck className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm">상세한 내용과 예시 코드를 제공하면 더 좋은 답변을 받을 수 있습니다.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="text-primary pt-1">
                                            <HiOutlineCheck className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm">커뮤니티 가이드라인을 준수해주세요.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="p-4 bg-base-200 border-t border-base-300">
                                <div className="flex items-start gap-2 text-sm">
                                    <div className="text-primary pt-1">
                                        <HiOutlineInformationCircle className="w-4 h-4" />
                                    </div>
                                    <span>
                                        첫 토론을 시작하시나요? 환영합니다! 서로 존중하고 열린 마음으로 소통해주세요.
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
                    <h3 className="font-bold text-lg mb-4">카테고리 선택</h3>
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
                                    <h4 className="font-medium">{category.name}</h4>
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