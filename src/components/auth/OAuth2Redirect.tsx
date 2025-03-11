import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const OAuth2Redirect: React.FC = () => {
  const { handleOAuth2Redirect, isAuthenticated, loading, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // OAuth2 리디렉션 처리
    handleOAuth2Redirect();
  }, [handleOAuth2Redirect]);

  useEffect(() => {
    // 인증 상태에 따라 리디렉션
    if (!loading) {
      if (isAuthenticated) {
        navigate('/');
      } else if (error) {
        navigate('/login');
      }
    }
  }, [isAuthenticated, loading, error, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="loading loading-spinner loading-lg"></div>
        <p className="mt-4">로그인 처리 중입니다...</p>
      </div>
    </div>
  );
};

export default OAuth2Redirect;