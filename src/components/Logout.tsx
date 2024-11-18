import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearTokens } from '../redux/authSlice';
import Button from './Button';

const Logout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Redux 상태와 로컬 스토리지에서 토큰 삭제
    dispatch(clearTokens());
    
    // 로그인 페이지로 즉시 이동
    navigate('/login');
  };

  return (
    <Button
      type="button"
      onClick={handleLogout}
      to = "/login"
      children = "로그아웃"
      className="fixed bottom-8 right-8 bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-red-600 transition-colors"
    >
    </Button>
  );
};

export default Logout;
