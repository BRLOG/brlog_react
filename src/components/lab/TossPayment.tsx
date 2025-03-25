import React, { useState } from 'react';
import axios from 'axios';
import { nanoid } from 'nanoid';
import { useAuth } from '../../contexts/AuthContext';

// API 기본 URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090';

// 결제 항목 타입 정의
interface PaymentItem {
    id: string;
    name: string;
    description: string;
    amount: number;
}

const TossPaymentExperiment: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const [selectedItem, setSelectedItem] = useState<PaymentItem | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // 테스트 결제 항목
    const paymentItems: PaymentItem[] = [
        {
            id: 'item1',
            name: '테스트 상품 A',
            description: '가장 기본적인 테스트 상품입니다.',
            amount: 1000
        },
        {
            id: 'item2',
            name: '테스트 상품 B',
            description: '프리미엄 테스트 상품입니다.',
            amount: 5000
        },
        {
            id: 'item3',
            name: '테스트 상품 C',
            description: '구독형 테스트 상품입니다.',
            amount: 10000
        }
    ];

    // 토스 결제 요청 처리
    const handlePayment = async () => {
        if (!selectedItem) {
            setError('결제할 상품을 선택해주세요.');
            return;
        }

        if (!isAuthenticated) {
            setError('결제를 진행하기 위해서는 로그인이 필요합니다.');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // 고유한 주문 ID 생성
            const orderId = nanoid();

            // 디버깅용 로그 추가
            console.log("생성된 주문 ID:", orderId);

            try {
                // 백엔드에 결제 요청 생성
                const response = await axios.post(`${API_URL}/lab/payment/request`, {
                    orderId,
                    paymentItem: selectedItem,
                    userId: user?.userId
                });

                console.log("백엔드 응답:", response.data);

                // 백엔드 API가 준비되지 않았거나 오류가 있으면 직접 orderId 사용
                const paymentOrderId = response.data?.data?.orderId || orderId;

                // 결제창 호출을 위한 clientKey와 tossPayments 라이브러리 로드
                const clientKey = 'test_ck_Poxy1XQL8RgdXaoJA1vk37nO5Wml';

                // @ts-ignore - 토스 페이먼츠 타입 정의가 없는 경우
                const tossPayments = window.TossPayments(clientKey);

                // 결제 요청
                tossPayments.requestPayment('카드', {
                    amount: selectedItem.amount,
                    orderId: paymentOrderId, // 백엔드 응답 또는 직접 생성한 ID 사용
                    orderName: selectedItem.name,
                    customerName: user?.userNm || '테스트 사용자',
                    successUrl: `${window.location.origin}/front/lab/payment/success`,
                    failUrl: `${window.location.origin}/front/lab/payment/fail`,
                });
            } catch (apiError) {
                console.error("백엔드 API 오류:", apiError);

                // 백엔드 API 오류 시 토스 직접 호출 시도 (테스트 용도)
                const clientKey = 'test_ck_Poxy1XQL8RgdXaoJA1vk37nO5Wml';

                // @ts-ignore
                const tossPayments = window.TossPayments(clientKey);

                tossPayments.requestPayment('카드', {
                    amount: selectedItem.amount,
                    orderId: orderId, // 직접 생성한 ID 사용
                    orderName: selectedItem.name,
                    customerName: user?.userNm || '테스트 사용자',
                    successUrl: `${window.location.origin}/front/lab/payment/success`,
                    failUrl: `${window.location.origin}/front/lab/payment/fail`,
                });
            }
        } catch (err) {
            console.error('결제 요청 중 오류 발생:', err);
            setError('결제 요청 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold">토스 페이먼츠 테스트</h2>
            <p>
                토스 페이먼츠 API를 사용하여 테스트 결제를 진행할 수 있습니다.
                실제 결제는 진행되지 않으며, 테스트 환경에서만 작동합니다.
            </p>

            <div className="card bg-base-200 shadow-lg">
                <div className="card-body">
                    {/* 상품 선택 부분 */}
                    <div className="mb-4">
                        <h3 className="font-bold mb-2">테스트 상품 선택</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {paymentItems.map((item) => (
                                <div
                                    key={item.id}
                                    className={`card bg-base-100 cursor-pointer hover:bg-opacity-80 transition-all ${selectedItem?.id === item.id ? 'ring-2 ring-primary' : ''}`}
                                    onClick={() => setSelectedItem(item)}
                                >
                                    <div className="card-body p-4">
                                        <h3 className="card-title text-base">{item.name}</h3>
                                        <p className="text-sm opacity-70">{item.description}</p>
                                        <p className="font-bold text-right mt-2">
                                            {item.amount.toLocaleString()}원
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 결제 버튼 */}
                    <div className="card-actions justify-end mt-4">
                        <button
                            className="btn btn-primary"
                            onClick={handlePayment}
                            disabled={loading || !selectedItem}
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    처리 중...
                                </>
                            ) : '결제하기'}
                        </button>
                    </div>

                    {/* 오류 메시지 */}
                    {error && (
                        <div className="alert alert-error mt-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{error}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* 결제 테스트 카드 정보 */}
            <div className="card bg-base-200 shadow-lg">
                <div className="card-body">
                    <h2 className="card-title text-xl">테스트 카드 정보</h2>
                    <div className="overflow-x-auto">
                        <table className="table table-zebra">
                            <thead>
                                <tr>
                                    <th>항목</th>
                                    <th>값</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>카드번호</td>
                                    <td>0305 0305 0305 0305</td>
                                </tr>
                                <tr>
                                    <td>만료일</td>
                                    <td>12/25</td>
                                </tr>
                                <tr>
                                    <td>생년월일 / 사업자등록번호</td>
                                    <td>930305</td>
                                </tr>
                                <tr>
                                    <td>비밀번호 앞 2자리</td>
                                    <td>00</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TossPaymentExperiment;