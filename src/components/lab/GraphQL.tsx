import React, { useState } from 'react';
import axios from 'axios';
import { HiOutlineCode } from 'react-icons/hi';

// API 기본 URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090';

interface GraphQLProps {
    // 필요한 props 정의
}

const GraphQL: React.FC<GraphQLProps> = () => {
    // 상태 관리
    const [query, setQuery] = useState<string>(`query {
  posts {
    posts {
      postId
      title
      content
      likeCnt
      commentCnt
    }
    totalCount
  }
}`);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // GraphQL 쿼리 실행 함수
    const executeQuery = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_URL}/lab/graphql`, {
                query,
                variables: {}
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            setResult(response.data.data);
        } catch (err: any) {
            console.error('GraphQL 쿼리 오류:', err);
            setError(err.response?.data?.message || '쿼리 실행 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">GraphQL 실험실</h2>
            <p className="mb-4">
                GraphQL은 Facebook에서 개발한 쿼리 언어로, API를 위한 효율적이고 강력한 대안입니다.
                아래에서 GraphQL 쿼리를 직접 작성하고 실행해볼 수 있습니다.
            </p>

            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">쿼리 예제</h3>
                <div className="mockup-code bg-base-300 text-base-content mb-4">
                    <pre data-prefix="$">
                        <code>
                            {`query {
  posts {
    posts {
      postId
      title
      content
      likeCnt
      commentCnt
    }
    totalCount
  }
}`}
                        </code>
                    </pre>
                </div>

                <h3 className="text-lg font-semibold mb-2">뮤테이션 예제</h3>
                <div className="mockup-code bg-base-300 text-base-content mb-4">
                    <pre data-prefix="$">
                        <code>
                            {`mutation {
  createPost(
    title: "GraphQL 테스트"
    content: "GraphQL을 사용한 첫 번째 게시글입니다."
    categoryId: "development"
  ) {
    postId
    title
    userNm
  }
}`}
                        </code>
                    </pre>
                </div>
            </div>

            <div className="card bg-base-200 shadow-md mb-6">
                <div className="card-body">
                    <h3 className="card-title">GraphQL 쿼리 실행기</h3>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">GraphQL 쿼리</span>
                        </label>
                        <textarea
                            className="textarea textarea-bordered h-40 font-mono"
                            placeholder="여기에 GraphQL 쿼리를 입력하세요..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        ></textarea>
                    </div>
                    <button
                        className="btn btn-primary mt-4"
                        onClick={executeQuery}
                        disabled={isLoading}
                    >
                        {isLoading ? '실행 중...' : '쿼리 실행'}
                    </button>

                    {error && (
                        <div className="alert alert-error mt-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {result && (
                        <div className="mt-4">
                            <h4 className="font-semibold mb-2">결과:</h4>
                            <div className="mockup-code bg-base-300 text-base-content">
                                <pre className="overflow-auto max-h-72"><code>{JSON.stringify(result, null, 2)}</code></pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>GraphQL을 사용하면 필요한 데이터만 정확히 요청할 수 있고, 여러 리소스를 단일 요청으로 가져올 수 있습니다.</span>
            </div>
        </div>
    );
};

export default GraphQL;