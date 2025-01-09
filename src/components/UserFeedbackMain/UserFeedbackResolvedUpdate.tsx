import React, { useState } from 'react';
import { useHobitMutatePutApi } from '../../hooks/hobitAdmin';
import { UpdateUserFeedbackRequest, UpdateUserFeedbackResponse } from '../../types/feedback';

type UserFeedbackResolvedUpdateProps = {
  user_feedback_id: number;
  initialResolved: number;
};

const UserFeedbackResolvedUpdate: React.FC<UserFeedbackResolvedUpdateProps> = ({
  user_feedback_id,
  initialResolved,
}) => {
  const [isResolved, setIsResolved] = useState<number>(initialResolved);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const UserFeedbackResolvedUpdateApi = useHobitMutatePutApi<UpdateUserFeedbackRequest,UpdateUserFeedbackResponse>('feedbacks/user');

  const toggleResolvedStatus = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await UserFeedbackResolvedUpdateApi({
        params: { user_feedback_id: String(user_feedback_id) },
      });

      if (response.payload?.statusCode === 200) {
        setIsResolved((prevState) => (prevState === 0 ? 1 : 0));
      } else {
        throw new Error('Resolved 상태를 업데이트하는 데 실패했습니다.');
      }
    } catch (err: any) {
      setError(err.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <input
      type="checkbox"
      checked={isResolved === 1}
      onChange={toggleResolvedStatus}
      disabled={loading}
      className="form-checkbox h-5 w-5 text-blue-500 ml-1"
    />
  );
};

export default UserFeedbackResolvedUpdate;
