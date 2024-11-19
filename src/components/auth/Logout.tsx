import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearTokens } from '../../redux/authSlice';
import Button from '../Button';

const Logout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearTokens());
    navigate('/login');
  };

  return (
    <Button
      type="button"
      onClick={handleLogout}
      to="/login"
      children="로그아웃"
      className="text-sm text-blue-600 hover:underline mb-2"
    />
  );
};

export default Logout;
