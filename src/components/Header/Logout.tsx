import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearTokens } from '../../redux/authSlice';

const Logout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearTokens());
    alert('로그아웃 되었습니다.');
    navigate('/login');
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors duration-200"
    >
      로그아웃
    </button>
  );
};

export default Logout;
