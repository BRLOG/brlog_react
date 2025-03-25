import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const PaymentFail: React.FC = () => {
    const [searchParams] = useSearchParams();

    // 실패 정보 추출
    const errorCode = searchParams.get('code');
    const errorMessage = searchParams.get('message');
    const orderId = searchParams.get('orderId');

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="card bg-base-200 shadow-lg max-w-lg mx-auto">
                <div className="card-body">
                    <div className="flex flex-col items-center text-center py-6">
                        <div className="text-error mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current w-16 h-16">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="card-title text-xl text-error mb-4">결제 실패</h2>

                        <div className="w-full overflow-x-auto mb-6">
                            <table className="table table-zebra">
                                <tbody>
                                    <tr>
                                        <td className="font-bold">주문 ID</td>
                                        <td>{orderId || '정보 없음'}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold">오류 코드</td>
                                        <td>{errorCode || '정보 없음'}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold">오류 메시지</td>
                                        <td>{errorMessage || '알 수 없는 오류가 발생했습니다.'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="alert alert-warning mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <span>결제가 정상적으로 처리되지 않았습니다. 다시 시도해주세요.</span>
                        </div>

                        <div className="card-actions flex gap-2">
                            <Link to="/lab/payment" className="btn btn-primary">다시 시도</Link>
                            <Link to="/lab" className="btn btn-ghost">실험실로 돌아가기</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentFail;