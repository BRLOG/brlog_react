import React from 'react';
import { HiOutlineChip } from 'react-icons/hi';

interface AIProps {
    // 필요한 props 정의
}

const AI: React.FC<AIProps> = () => {
    return (
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
    );
};

export default AI;