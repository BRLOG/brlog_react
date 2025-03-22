import React from 'react';
import { HiOutlineDatabase, HiOutlineChartBar } from 'react-icons/hi';

interface DatabaseProps {
    // 필요한 props가 있다면 여기에 정의
}

const Database: React.FC<DatabaseProps> = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">데이터베이스 최적화 실험실</h2>
            <p className="mb-4">
                MySQL과 Redis를 활용하여 블로그 성능을 최적화하는 다양한 기법을 실험합니다.
            </p>
            <div className="stats shadow mb-4">
                <div className="stat">
                    <div className="stat-figure text-primary">
                        <HiOutlineDatabase className="w-8 h-8" />
                    </div>
                    <div className="stat-title">쿼리 실행 시간</div>
                    <div className="stat-value text-primary">254ms</div>
                    <div className="stat-desc">최적화 후 31ms</div>
                </div>
                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <HiOutlineChartBar className="w-8 h-8" />
                    </div>
                    <div className="stat-title">캐시 히트율</div>
                    <div className="stat-value text-secondary">89%</div>
                    <div className="stat-desc">전주 대비 14% 증가</div>
                </div>
            </div>
            <div className="mockup-code bg-base-300 text-base-content">
                <pre data-prefix="1"><code>// Redis 캐싱 구현 예제</code></pre>
                <pre data-prefix="2"><code>@Cacheable(value = "posts", key = "#id")</code></pre>
                <pre data-prefix="3"><code>public Post getPostById(Long id) {'{'}</code></pre>
                <pre data-prefix="4"><code>    return postRepository.findById(id)</code></pre>
                <pre data-prefix="5"><code>        .orElseThrow(() {'=>'} new PostNotFoundException(id));</code></pre>
                <pre data-prefix="6"><code>{'}'}</code></pre>
            </div>
        </div>
    );
};

export default Database;