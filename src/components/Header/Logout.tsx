import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearTokens } from '../../redux/authSlice';

const Logout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearTokens());
    navigate('/login');
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-sm text-blue-600 hover:underline mb-2"
    >
      로그아웃
    </button>
  );
};

export default Logout;
