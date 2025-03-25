import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090';

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [referenceImage, setReferenceImage] = useState<File | null>(null);
    const [referencePreview, setReferencePreview] = useState<string | null>(null);
    const [strength, setStrength] = useState(0.7);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 이미지 선택 처리
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setReferenceImage(file);

            // 미리보기 생성
            const reader = new FileReader();
            reader.onload = (e) => {
                setReferencePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // 이미지 생성 요청
    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('이미지 설명을 입력해주세요.');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append('prompt', prompt);

            // 참조 이미지가 있는 경우 추가
            if (referenceImage) {
                formData.append('image', referenceImage);
                formData.append('strength', strength.toString());
            }

            const response = await axios.post(
                `${API_URL}/lab/image/generate`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setImageUrl(response.data.data.imageUrl);
        } catch (error) {
            console.error('이미지 생성 중 오류:', error);
            setError('이미지 생성 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 참조 이미지 제거
    const handleRemoveReferenceImage = () => {
        setReferenceImage(null);
        setReferencePreview(null);
    };

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold">이미지 생성기</h2>
            <p>
                텍스트 설명을 입력하면 AI가 블로그 썸네일이나 삽화를 생성합니다.
                참조 이미지를 추가하면 해당 이미지 스타일을 반영합니다.
            </p>

            <div className="card bg-base-200 shadow-lg">
                <div className="card-body">
                    {/* 참조 이미지 업로드 영역 */}
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text font-medium">참조 이미지 (선택사항)</span>
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="file"
                                className="file-input file-input-bordered w-full"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            {referenceImage && (
                                <button
                                    className="btn btn-square btn-outline"
                                    onClick={handleRemoveReferenceImage}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            )}
                        </div>

                        {/* 참조 이미지 미리보기 */}
                        {referencePreview && (
                            <div className="mt-2">
                                <div className="flex flex-col">
                                    <img
                                        src={referencePreview}
                                        alt="참조 이미지"
                                        className="h-40 object-contain rounded-md"
                                    />

                                    {/* 이미지 영향력 설정 */}
                                    <div className="form-control mt-2">
                                        <label className="label">
                                            <span className="label-text text-sm">참조 이미지 영향력: {strength}</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="0.1"
                                            max="0.9"
                                            step="0.1"
                                            value={strength}
                                            onChange={(e) => setStrength(parseFloat(e.target.value))}
                                            className="range range-primary range-xs"
                                        />
                                        <div className="flex justify-between text-xs px-2 mt-1">
                                            <span>텍스트 중심</span>
                                            <span>이미지 중심</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 텍스트 프롬프트 입력 */}
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text font-medium">이미지 설명</span>
                        </label>
                        <div className="alert alert-warning mb-2 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <span>현재 Stability AI API는 사진을 올릴 경우에는 영어 프롬프트만 지원합니다.</span>
                        </div>
                        <textarea
                            className="textarea textarea-bordered h-24"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="원하는 이미지를 자세히 설명해주세요 (예: 맑은 하늘 아래 산과 강이 있는 풍경, 디지털 아트 스타일)"
                        />
                    </div>

                    <button
                        className="btn btn-primary w-full"
                        onClick={handleGenerate}
                        disabled={loading || !prompt}
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                생성 중...
                            </>
                        ) : '이미지 생성하기'}
                    </button>

                    {error && (
                        <div className="alert alert-error mt-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{error}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* 생성된 이미지 결과 */}
            {imageUrl && (
                <div className="card bg-base-200 shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title text-xl">생성된 이미지</h2>
                        <div className="flex justify-center">
                            <div className="relative">
                                <img
                                    src={imageUrl}
                                    alt="AI 생성 이미지"
                                    className="rounded-lg max-h-96"
                                />
                            </div>
                        </div>
                        <div className="card-actions justify-end mt-4">
                            <a
                                href={imageUrl}
                                download="generated-image.png"
                                className="btn btn-primary"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                다운로드
                            </a>
                            <button
                                className="btn btn-outline"
                                onClick={() => {
                                    // 클립보드에 이미지 URL 복사
                                    navigator.clipboard.writeText(imageUrl)
                                        .then(() => alert('이미지 URL이 클립보드에 복사되었습니다.'))
                                        .catch(() => alert('클립보드 복사에 실패했습니다.'));
                                }}
                            >
                                URL 복사
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageGenerator;