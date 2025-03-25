import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// API 기본 URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090';

const PaymentSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [paymentInfo, setPaymentInfo] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const completePayment = async () => {
            try {
                // 필수 파라미터 추출
                const paymentKey = searchParams.get('paymentKey');
                const orderId = searchParams.get('orderId');
                const amount = searchParams.get('amount');

                if (!paymentKey || !orderId || !amount) {
                    throw new Error('필수 결제 정보가 누락되었습니다.');
                }
                
                try{

                    // 결제 승인 요청
                    const response = await axios.post(`${API_URL}/lab/payment/confirm`, {
                        paymentKey,
                        orderId,
                        amount: Number(amount)
                    }, {
                        headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                        }
                    });
                    
                    console.log("백엔드 응답:", response.data);

                    // 결제 정보 저장
                    setPaymentInfo(response.data.data);
                }catch(apiError: any){
                    console.error('API 호출 오류:', apiError);
        
                    // 401 오류 시 토큰 없이 재시도
                    if (apiError.response?.status === 401) {
                        const response = await axios.post(`${API_URL}/lab/payment/confirm`, {
                            paymentKey,
                            orderId,
                            amount: Number(amount)
                        });
                        setPaymentInfo(response.data.data);
                    } else {
                        throw apiError;
                    }
                }
            } catch (err: any) {
                console.error('결제 승인 중 오류 발생:', err);
                setError(err.message || '결제 승인 중 오류가 발생했습니다.');

            } finally {
                setLoading(false);
            }
        };

        completePayment();
    }, [searchParams]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="card bg-base-200 shadow-lg max-w-lg mx-auto">
                <div className="card-body">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <span className="loading loading-spinner loading-lg"></span>
                            <p className="mt-4">결제 처리 중입니다...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center text-center py-8">
                            <div className="text-error mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current w-16 h-16">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h2 className="card-title text-xl text-error mb-2">결제 처리 중 오류 발생</h2>
                            <p className="mb-4">{error}</p>
                            <div className="card-actions">
                                <Link to="/lab" className="btn btn-primary">실험실로 돌아가기</Link>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-center py-6">
                            <div className="text-success mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current w-16 h-16">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="card-title text-xl text-success mb-4">결제 성공!</h2>

                            <div className="w-full overflow-x-auto mb-6">
                                <table className="table table-zebra">
                                    <tbody>
                                        <tr>
                                            <td className="font-bold">주문 ID</td>
                                            <td>{paymentInfo?.orderId}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-bold">결제 상품</td>
                                            <td>{paymentInfo?.orderName}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-bold">결제 금액</td>
                                            <td>{Number(paymentInfo?.amount).toLocaleString()}원</td>
                                        </tr>
                                        <tr>
                                            <td className="font-bold">결제 수단</td>
                                            <td>{paymentInfo?.method === 'card' ? '신용카드' : paymentInfo?.method}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-bold">결제 일시</td>
                                            <td>{new Date(paymentInfo?.approvedAt).toLocaleString()}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="card-actions">
                                <Link to="/lab" className="btn btn-primary">실험실로 돌아가기</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;