import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useHobitMutatePostApi } from '../../hooks/hobitAdmin';
import { LogoutRequest, LogoutResponse } from '../../types/user';
import { clearFAQFilterState, clearFAQSortState, clearSeniorFAQFilterState, clearAdminLogFilterState, clearQuestionLogFilterState, clearFeedbackFilterState } from '../../redux/filterSlice';

const Logout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const LogoutApi = useHobitMutatePostApi<LogoutRequest, LogoutResponse>('auth/logout');

  const handleLogout = async () => {
    const response = await LogoutApi({
      credentials: 'include',
    });
    if (response.payload?.statusCode !== 200) {
      alert('로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.');
      return;
    }
    dispatch(clearFAQFilterState());
    dispatch(clearFAQSortState());
    dispatch(clearSeniorFAQFilterState());
    dispatch(clearAdminLogFilterState());
    dispatch(clearQuestionLogFilterState());
    dispatch(clearFeedbackFilterState());
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
