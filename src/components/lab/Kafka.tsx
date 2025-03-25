import React, { useState, useEffect } from 'react';

const KafkaExperiment: React.FC = () => {
    // 상태 관리
    const [topics, setTopics] = useState(['users', 'orders', 'notifications']);
    const [selectedTopic, setSelectedTopic] = useState('users');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<{ topic: string, content: string, timestamp: string }[]>([]);
    const [isProducing, setIsProducing] = useState(false);
    const [isConsuming, setIsConsuming] = useState(false);

    // 임의의 메시지 자동 소비 (실제로는 Kafka 연결 필요)
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isConsuming) {
            interval = setInterval(() => {
                // 실제 환경에서는 Kafka Consumer API를 통해 메시지를 수신
                if (Math.random() > 0.7 && messages.length > 0) {
                    const randomIndex = Math.floor(Math.random() * messages.length);
                    const consumedMsg = messages[randomIndex];

                    // 메시지 처리 상태 표시 (실제로는 처리 로직 구현)
                    console.log(`메시지 소비: ${consumedMsg.content} (토픽: ${consumedMsg.topic})`);
                }
            }, 2000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isConsuming, messages]);

    // 메시지 생산 함수
    const produceMessage = () => {
        if (!message.trim()) return;

        // 실제 환경에서는 Kafka Producer API를 통해 메시지를 발행
        const newMessage = {
            topic: selectedTopic,
            content: message,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, newMessage]);
        setMessage('');
    };

    // 새 토픽 추가
    const addTopic = (topic: string) => {
        if (!topic.trim() || topics.includes(topic)) return;
        setTopics(prev => [...prev, topic]);
    };

    return (
        <div className="space-y-6">
            <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Kafka 스트리밍 플랫폼</h2>
                    <p>
                        분산 이벤트 스트리밍 플랫폼인 Kafka를 통해 실시간 데이터 파이프라인과
                        스트리밍 애플리케이션을 구축하는 실험입니다.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 생산자(Producer) 패널 */}
                <div className="card bg-base-200 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title flex justify-between">
                            메시지 생산자 (Producer)
                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text mr-2">활성화</span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        checked={isProducing}
                                        onChange={() => setIsProducing(!isProducing)}
                                    />
                                </label>
                            </div>
                        </h2>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">토픽 선택</span>
                            </label>
                            <select
                                className="select select-bordered w-full"
                                value={selectedTopic}
                                onChange={(e) => setSelectedTopic(e.target.value)}
                            >
                                {topics.map(topic => (
                                    <option key={topic} value={topic}>{topic}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">메시지 내용</span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered h-24"
                                placeholder="JSON 형식의 메시지를 입력하세요..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                disabled={!isProducing}
                            ></textarea>
                        </div>

                        <div className="card-actions justify-end">
                            <button
                                className="btn btn-primary"
                                onClick={produceMessage}
                                disabled={!isProducing || !message.trim()}
                            >
                                메시지 발행
                            </button>
                        </div>
                    </div>
                </div>

                {/* 소비자(Consumer) 패널 */}
                <div className="card bg-base-200 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title flex justify-between">
                            메시지 소비자 (Consumer)
                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text mr-2">활성화</span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        checked={isConsuming}
                                        onChange={() => setIsConsuming(!isConsuming)}
                                    />
                                </label>
                            </div>
                        </h2>

                        <div className="alert shadow-lg">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <div>
                                    <h3 className="font-bold">소비자 그룹: app-service-group</h3>
                                    <div className="text-xs">파티션 수: 3, 복제 팩터: 2</div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto max-h-64 overflow-y-auto">
                            <table className="table w-full table-compact">
                                <thead>
                                    <tr>
                                        <th>토픽</th>
                                        <th>메시지</th>
                                        <th>타임스탬프</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {messages.map((msg, idx) => (
                                        <tr key={idx}>
                                            <td>{msg.topic}</td>
                                            <td className="truncate max-w-[150px]">{msg.content}</td>
                                            <td>{new Date(msg.timestamp).toLocaleTimeString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* 관리 패널 */}
            <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Kafka 관리</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-bold mb-2">토픽 관리</h3>
                            <div className="join">
                                <input
                                    className="input input-bordered join-item"
                                    placeholder="새 토픽 이름"
                                    id="new-topic"
                                />
                                <button
                                    className="btn btn-primary join-item"
                                    onClick={() => {
                                        const input = document.getElementById('new-topic') as HTMLInputElement;
                                        addTopic(input.value);
                                        input.value = '';
                                    }}
                                >
                                    추가
                                </button>
                            </div>

                            <div className="mt-2 flex flex-wrap gap-2">
                                {topics.map(topic => (
                                    <div key={topic} className="badge badge-lg">{topic}</div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold mb-2">클러스터 상태</h3>
                            <div className="stats stats-vertical shadow w-full">
                                <div className="stat">
                                    <div className="stat-title">브로커</div>
                                    <div className="stat-value">3</div>
                                    <div className="stat-desc">2 정상, 1 복구 중</div>
                                </div>

                                <div className="stat">
                                    <div className="stat-title">메시지 처리량</div>
                                    <div className="stat-value">1.2K/s</div>
                                    <div className="stat-desc">↗︎ 전일 대비 15%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KafkaExperiment;