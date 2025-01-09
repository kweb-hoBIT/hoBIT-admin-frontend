import React, { useEffect, useState } from 'react';
import { useHobitQueryGetApi } from '../../hooks/hobitAdmin';
import { GetAllUserFeedbackRequest, GetAllUserFeedbackResponse } from '../../types/feedback';
import UserFeedbackMainForm from './UserFeedbackMainForm';

const UserFeedbackMain: React.FC = () => {
  const [userFeedbackData, setUserFeedbackData] = useState<GetAllUserFeedbackResponse['data']['userFeedbacks']>([]);
  const [error, setError] = useState<string | null>(null);

  const GetUserFeedbackApi = useHobitQueryGetApi<GetAllUserFeedbackRequest, GetAllUserFeedbackResponse>('feedbacks/user');

  // User Feedback 데이터 가져오기
  useEffect(() => {
    const fetchUserFeedbackData = async () => {
      if (GetUserFeedbackApi.data?.payload?.statusCode === 200) {
        const data = GetUserFeedbackApi.data.payload.data.userFeedbacks;
        setUserFeedbackData(data);
      } else {
        setError('User Feedback 데이터를 가져오는 중 오류 발생');
      }
    };

    if (!GetUserFeedbackApi.isLoading && GetUserFeedbackApi.isSuccess) {
      fetchUserFeedbackData();
    }
  }, [GetUserFeedbackApi]);

  if (GetUserFeedbackApi.isLoading) {
    return <div>User Feedback 데이터를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <UserFeedbackMainForm userFeedbacks={userFeedbackData} />
    </div>
  );
};

export default UserFeedbackMain;
