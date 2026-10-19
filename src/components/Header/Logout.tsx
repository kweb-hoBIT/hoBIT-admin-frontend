import MenuItem from '../ui/MenuItem';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useHobitMutatePostApi } from '../../hooks/hobitAdmin';
import { LogoutRequest, LogoutResponse } from '../../types/user';
import { clearFAQFilterState, clearFAQSortState, clearSeniorFAQFilterState, clearSeniorFAQSortState, clearAdminLogFilterState, clearQuestionLogFilterState, clearFeedbackFilterState } from '../../redux/filterSlice';

import { appAlert } from '../ui/Dialog';
import { resetAuthCheck } from '../ProtectedPage';
const Logout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const LogoutApi = useHobitMutatePostApi<LogoutRequest, LogoutResponse>('auth/logout');

  const handleLogout = async () => {
    const response = await LogoutApi({});
    if (response.payload?.statusCode !== 200) {
      appAlert('로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.');
      return;
    }
    dispatch(clearFAQFilterState());
    dispatch(clearFAQSortState());
    dispatch(clearSeniorFAQFilterState());
    dispatch(clearSeniorFAQSortState());
    dispatch(clearAdminLogFilterState());
    dispatch(clearQuestionLogFilterState());
    dispatch(clearFeedbackFilterState());
    appAlert('로그아웃 되었습니다.');
    resetAuthCheck();
    navigate('/login');
  };

  return (
    <MenuItem icon="logout" onClick={handleLogout}>
      로그아웃
    </MenuItem>
  );
};

export default Logout;
