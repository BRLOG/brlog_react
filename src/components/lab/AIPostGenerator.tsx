import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

// API 기본 URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090';

const AIPostGenerator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [keywords, setKeywords] = useState('');
    const [generating, setGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const [suggestedTitle, setSuggestedTitle] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    const navigate = useNavigate();

    const handleGenerate = async () => {
        if (!topic) {
            alert('주제를 입력해주세요.');
            return;
        }

        try {
            setGenerating(true);
            const response = await axios.post(`${API_URL}/lab/ai/generate-post`, {
                topic,
                keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
            });

            setGeneratedContent(response.data.data.content);
            setEditedContent(response.data.data.content);
            setSuggestedTitle(response.data.data.suggestedTitle);
        } catch (error) {
            console.error('AI 콘텐츠 생성 중 오류 발생:', error);
            alert('콘텐츠 생성 중 오류가 발생했습니다.');
        } finally {
            setGenerating(false);
        }
    };

    const handleSaveAsDraft = () => {
        try {
            // 게시글 작성 페이지로 이동하면서 데이터 전달
            navigate('/board/new', {
                state: {
                    title: suggestedTitle || topic,
                    content: editedContent,
                    tags: keywords.split(',').map(k => k.trim()).filter(k => k),
                }
            });
        } catch (error) {
            console.error('페이지 이동 중 오류 발생:', error);
            alert('초안 이동 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold">AI 게시글 초안 작성</h2>
            <p>
                주제와 키워드를 입력하면 AI가 블로그 게시글 초안을 자동으로 생성합니다.
                생성된 내용을 검토하고 편집한 후 게시글로 저장할 수 있습니다.
            </p>
            {/* 입력 폼 카드 */}
            <div className="card bg-base-200 shadow-lg">
                <div className="card-body">
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text font-medium">주제</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="예: Spring Boot와 React로 블로그 만들기"
                        />
                    </div>

                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text font-medium">키워드 (쉼표로 구분)</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            placeholder="예: Spring Boot, React, 풀스택, 웹개발"
                        />
                    </div>

                    <button
                        className="btn btn-primary w-full"
                        onClick={handleGenerate}
                        disabled={generating || !topic}
                    >
                        {generating ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                생성 중...
                            </>
                        ) : '초안 생성하기'}
                    </button>
                </div>
            </div>

            {/* 생성된 콘텐츠 */}
            {generatedContent && (
                <div className="card bg-base-200 shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title text-xl">생성된 초안</h2>

                        <div className="tabs tabs-boxed mb-4">
                            <a
                                className={`tab ${!showPreview ? 'tab-active' : ''}`}
                                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => setShowPreview(false)}
                            >
                                편집
                            </a>
                            <a
                                className={`tab ${showPreview ? 'tab-active' : ''}`}
                                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => setShowPreview(true)}
                            >
                                미리보기
                            </a>
                        </div>

                        {showPreview ? (
                            <div className="prose max-w-none bg-base-100 p-4 rounded-lg min-h-[400px] overflow-auto">
                                <ReactMarkdown>{editedContent}</ReactMarkdown>
                            </div>
                        ) : (
                            <textarea
                                className="textarea textarea-bordered w-full min-h-[400px]"
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                            />
                        )}

                        <button
                            className="btn btn-success mt-4 w-full"
                            onClick={handleSaveAsDraft}
                        >
                            초안으로 저장하기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIPostGenerator;