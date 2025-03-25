import React, { useState, useEffect } from 'react';

// Exchange 타입 정의
type ExchangeType = 'direct' | 'topic' | 'fanout' | 'headers';

// 큐 인터페이스 정의
interface Queue {
    name: string;
    messages: number;
    consumers: number;
}

// 메시지 인터페이스 정의
interface Message {
    id: string;
    content: string;
    exchange: string;
    routingKey: string;
    timestamp: string;
    status: 'pending' | 'delivered' | 'failed';
}

const RabbitMQExperiment: React.FC = () => {
    // 상태 관리
    const [exchanges, setExchanges] = useState<{ name: string, type: ExchangeType }[]>([
        { name: 'amq.direct', type: 'direct' },
        { name: 'amq.topic', type: 'topic' },
        { name: 'amq.fanout', type: 'fanout' },
        { name: 'app.notifications', type: 'topic' },
    ]);

    const [queues, setQueues] = useState<Queue[]>([
        { name: 'user-registrations', messages: 0, consumers: 2 },
        { name: 'email-notifications', messages: 0, consumers: 1 },
        { name: 'order-processing', messages: 0, consumers: 3 },
    ]);

    const [messages, setMessages] = useState<Message[]>([]);

    // UI 상태
    const [selectedExchange, setSelectedExchange] = useState('amq.direct');
    const [routingKey, setRoutingKey] = useState('user.created');
    const [messageContent, setMessageContent] = useState('');
    const [isPublishing, setIsPublishing] = useState(false);
    const [isConsuming, setIsConsuming] = useState(false);

    // 활성화된 바인딩
    const [bindings, setBindings] = useState<{ exchange: string, queue: string, pattern: string }[]>([
        { exchange: 'amq.direct', queue: 'user-registrations', pattern: 'user.created' },
        { exchange: 'amq.topic', queue: 'email-notifications', pattern: 'notification.#' },
        { exchange: 'app.notifications', queue: 'email-notifications', pattern: 'user.*.notification' },
        { exchange: 'amq.fanout', queue: 'order-processing', pattern: '' },
    ]);

    // 소비 시뮬레이션
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isConsuming) {
            interval = setInterval(() => {
                setMessages(prev => {
                    // 처리되지 않은 메시지 찾기
                    const pendingIndex = prev.findIndex(msg => msg.status === 'pending');

                    if (pendingIndex >= 0) {
                        const updated = [...prev];
                        // 90% 확률로 성공, 10% 확률로 실패
                        updated[pendingIndex].status = Math.random() < 0.9 ? 'delivered' : 'failed';
                        return updated;
                    }

                    return prev;
                });

                // 큐의 메시지 수 업데이트
                setQueues(prev =>
                    prev.map(queue => ({
                        ...queue,
                        messages: Math.max(0, queue.messages - (Math.random() > 0.5 ? 1 : 0))
                    }))
                );

            }, 1500);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isConsuming]);

    // 메시지 발행 함수
    const publishMessage = () => {
        if (!messageContent.trim()) return;

        // 새 메시지 생성
        const newMessage: Message = {
            id: Math.random().toString(36).substring(2, 10),
            content: messageContent,
            exchange: selectedExchange,
            routingKey: routingKey,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        // 메시지 추가
        setMessages(prev => [...prev, newMessage]);

        // 라우팅 키와 일치하는 큐에 메시지 추가
        setQueues(prev => {
            return prev.map(queue => {
                // 바인딩 확인
                const matchingBinding = bindings.find(binding =>
                    binding.exchange === selectedExchange &&
                    binding.queue === queue.name &&
                    (
                        // direct exchange는 정확히 일치
                        (exchanges.find(e => e.name === selectedExchange)?.type === 'direct' && binding.pattern === routingKey) ||
                        // fanout exchange는 모든 큐에 전달
                        (exchanges.find(e => e.name === selectedExchange)?.type === 'fanout') ||
                        // topic exchange는 패턴 매칭
                        (exchanges.find(e => e.name === selectedExchange)?.type === 'topic' &&
                            matchTopicPattern(binding.pattern, routingKey))
                    )
                );

                if (matchingBinding) {
                    return { ...queue, messages: queue.messages + 1 };
                }

                return queue;
            });
        });

        // 입력 필드 초기화
        setMessageContent('');
    };

    // 토픽 패턴 매칭 함수 (간단한 구현)
    const matchTopicPattern = (pattern: string, routingKey: string): boolean => {
        if (!pattern) return false;

        const patternParts = pattern.split('.');
        const routingParts = routingKey.split('.');

        // # 와일드카드가 있으면 나머지 모든 부분 매칭
        if (patternParts.indexOf('#') >= 0) {
            const hashIndex = patternParts.indexOf('#');
            // # 이전 부분만 확인
            for (let i = 0; i < hashIndex; i++) {
                if (patternParts[i] !== '*' && patternParts[i] !== routingParts[i]) {
                    return false;
                }
            }
            return true;
        }

        // 길이가 다르면 매치되지 않음
        if (patternParts.length !== routingParts.length) {
            return false;
        }

        // 각 부분 확인
        for (let i = 0; i < patternParts.length; i++) {
            if (patternParts[i] !== '*' && patternParts[i] !== routingParts[i]) {
                return false;
            }
        }

        return true;
    };

    // 새 큐 추가
    const addQueue = (name: string) => {
        if (!name.trim() || queues.some(q => q.name === name)) return;

        setQueues(prev => [...prev, {
            name,
            messages: 0,
            consumers: 1
        }]);
    };

    // 새 바인딩 추가
    const addBinding = (exchange: string, queue: string, pattern: string) => {
        if (!pattern.trim() ||
            bindings.some(b => b.exchange === exchange && b.queue === queue && b.pattern === pattern)) {
            return;
        }

        setBindings(prev => [...prev, { exchange, queue, pattern }]);
    };

    return (
        <div className="space-y-6">
            <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">RabbitMQ 메시지 브로커</h2>
                    <p>
                        메시지 큐 프로토콜(AMQP)을 구현한 RabbitMQ를 통해 비동기 통신과
                        다양한 메시징 패턴을 실험합니다.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 발행자(Publisher) 패널 */}
                <div className="card bg-base-200 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title flex justify-between">
                            메시지 발행자 (Publisher)
                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text mr-2">활성화</span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        checked={isPublishing}
                                        onChange={() => setIsPublishing(!isPublishing)}
                                    />
                                </label>
                            </div>
                        </h2>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Exchange 선택</span>
                            </label>
                            <select
                                className="select select-bordered w-full"
                                value={selectedExchange}
                                onChange={(e) => setSelectedExchange(e.target.value)}
                                disabled={!isPublishing}
                            >
                                {exchanges.map(exchange => (
                                    <option key={exchange.name} value={exchange.name}>
                                        {exchange.name} ({exchange.type})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">라우팅 키</span>
                            </label>
                            <input
                                type="text"
                                placeholder="예: user.created, notification.email"
                                className="input input-bordered w-full"
                                value={routingKey}
                                onChange={(e) => setRoutingKey(e.target.value)}
                                disabled={!isPublishing}
                            />
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">메시지 내용</span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered h-24"
                                placeholder="메시지 내용을 입력하세요..."
                                value={messageContent}
                                onChange={(e) => setMessageContent(e.target.value)}
                                disabled={!isPublishing}
                            ></textarea>
                        </div>

                        <div className="card-actions justify-end">
                            <button
                                className="btn btn-primary"
                                onClick={publishMessage}
                                disabled={!isPublishing || !messageContent.trim()}
                            >
                                메시지 발행
                            </button>
                        </div>
                    </div>
                </div>

                {/* 구독자(Consumer) 패널 */}
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

                        <div className="overflow-x-auto max-h-64 overflow-y-auto">
                            <table className="table w-full table-compact">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>라우팅 키</th>
                                        <th>내용</th>
                                        <th>상태</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {messages.map((msg) => (
                                        <tr key={msg.id} className={
                                            msg.status === 'delivered' ? "bg-success bg-opacity-20" :
                                                msg.status === 'failed' ? "bg-error bg-opacity-20" : ""
                                        }>
                                            <td>{msg.id.substring(0, 4)}</td>
                                            <td>{msg.routingKey}</td>
                                            <td className="truncate max-w-[150px]">{msg.content}</td>
                                            <td>
                                                <span className={`badge ${msg.status === 'delivered' ? "badge-success" :
                                                        msg.status === 'failed' ? "badge-error" :
                                                            "badge-warning"
                                                    }`}>
                                                    {msg.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* 큐 및 바인딩 관리 */}
            <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">RabbitMQ 관리</h2>

                    <div className="tabs tabs-boxed mb-4">
                        <a className="tab tab-active">큐 관리</a>
                        <a className="tab">바인딩</a>
                        <a className="tab">교환기</a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 큐 목록 */}
                        <div>
                            <h3 className="font-bold mb-2">큐 목록</h3>
                            <div className="overflow-x-auto">
                                <table className="table w-full table-compact">
                                    <thead>
                                        <tr>
                                            <th>이름</th>
                                            <th>메시지 수</th>
                                            <th>소비자 수</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {queues.map((queue) => (
                                            <tr key={queue.name}>
                                                <td>{queue.name}</td>
                                                <td>{queue.messages}</td>
                                                <td>{queue.consumers}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="join mt-2">
                                <input
                                    className="input input-bordered join-item"
                                    placeholder="새 큐 이름"
                                    id="new-queue"
                                />
                                <button
                                    className="btn btn-primary join-item"
                                    onClick={() => {
                                        const input = document.getElementById('new-queue') as HTMLInputElement;
                                        addQueue(input.value);
                                        input.value = '';
                                    }}
                                >
                                    추가
                                </button>
                            </div>
                        </div>

                        {/* 바인딩 목록 */}
                        <div>
                            <h3 className="font-bold mb-2">바인딩 설정</h3>
                            <div className="overflow-x-auto max-h-64 overflow-y-auto">
                                <table className="table w-full table-compact">
                                    <thead>
                                        <tr>
                                            <th>Exchange</th>
                                            <th>큐</th>
                                            <th>라우팅 패턴</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bindings.map((binding, idx) => (
                                            <tr key={idx}>
                                                <td>{binding.exchange}</td>
                                                <td>{binding.queue}</td>
                                                <td>{binding.pattern || '(all)'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-2 flex flex-col gap-2">
                                <div className="form-control">
                                    <select
                                        className="select select-bordered w-full"
                                        id="binding-exchange"
                                    >
                                        {exchanges.map(exchange => (
                                            <option key={exchange.name} value={exchange.name}>
                                                {exchange.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-control">
                                    <select
                                        className="select select-bordered w-full"
                                        id="binding-queue"
                                    >
                                        {queues.map(queue => (
                                            <option key={queue.name} value={queue.name}>
                                                {queue.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="join">
                                    <input
                                        className="input input-bordered join-item flex-1"
                                        placeholder="라우팅 패턴 (예: user.*, notification.#)"
                                        id="binding-pattern"
                                    />
                                    <button
                                        className="btn btn-primary join-item"
                                        onClick={() => {
                                            const exchange = (document.getElementById('binding-exchange') as HTMLSelectElement).value;
                                            const queue = (document.getElementById('binding-queue') as HTMLSelectElement).value;
                                            const pattern = (document.getElementById('binding-pattern') as HTMLInputElement).value;

                                            addBinding(exchange, queue, pattern);
                                            (document.getElementById('binding-pattern') as HTMLInputElement).value = '';
                                        }}
                                    >
                                        바인딩 추가
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RabbitMQExperiment;