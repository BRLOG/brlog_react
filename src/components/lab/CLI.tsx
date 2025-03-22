import React from 'react';
import { HiOutlineTerminal } from 'react-icons/hi';

interface CLIProps {
    // 필요한 props가 있다면 여기에 정의
}

const CLI: React.FC<CLIProps> = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">CLI 도구 실험실</h2>
            <p className="mb-4">
                블로그 콘텐츠 관리를 더 효율적으로 할 수 있는 커맨드라인 인터페이스 도구를 개발합니다.
            </p>
            <div className="mockup-code bg-base-300 text-base-content mb-4">
                <pre data-prefix="$"><code>blog-cli new-post "TypeScript 제네릭 활용하기"</code></pre>
                <pre data-prefix=">" className="text-success"><code>새 포스트가 생성되었습니다. ID: 245</code></pre>
                <pre data-prefix="$"><code>blog-cli publish 245</code></pre>
                <pre data-prefix=">" className="text-success"><code>포스트가 발행되었습니다!</code></pre>
            </div>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>명령어</th>
                            <th>설명</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>blog-cli new-post</code></td>
                            <td>새 블로그 포스트 생성</td>
                        </tr>
                        <tr>
                            <td><code>blog-cli publish</code></td>
                            <td>포스트 발행하기</td>
                        </tr>
                        <tr>
                            <td><code>blog-cli stats</code></td>
                            <td>블로그 통계 보기</td>
                        </tr>
                        <tr>
                            <td><code>blog-cli backup</code></td>
                            <td>블로그 데이터 백업</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CLI;