import React, { useState } from 'react';
import { useHobitMutatePutApi } from '../../hooks/hobitAdmin';
import { UpdateUserFeedbackRequest, UpdateUserFeedbackResponse } from '../../types/feedback';

type UserFeedbackResolvedUpdateProps = {
  user_feedback_id: number;
  initialResolved: number;
  onResolvedChange: (id: number, resolved: number) => void;
};

const UserFeedbackResolvedUpdate: React.FC<UserFeedbackResolvedUpdateProps> = ({
  user_feedback_id,
  initialResolved,
  onResolvedChange,
}) => {
  const [isResolved, setIsResolved] = useState<number>(initialResolved);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false); // 팝업 상태 관리

  const UserFeedbackResolvedUpdateApi = useHobitMutatePutApi<
    UpdateUserFeedbackRequest,
    UpdateUserFeedbackResponse
  >('feedbacks/user');

  const toggleResolvedStatus = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await UserFeedbackResolvedUpdateApi({
        params: { user_feedback_id: String(user_feedback_id) },
      });

      if (response.payload?.statusCode === 200) {
        const newResolvedStatus = isResolved === 0 ? 1 : 0;
        setIsResolved(newResolvedStatus);
        onResolvedChange(user_feedback_id, newResolvedStatus);
        alert('피드백 상태가 성공적으로 변경되었습니다.');
        setShowPopup(false);
      } else {
        throw new Error('Resolved 상태를 업데이트하는 데 실패했습니다.');
      }
    } catch (err: any) {
      setError(err.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 팝업 토글 함수
  const togglePopup = () => {
    setShowPopup(!showPopup);
    setError(null);
  };

  return (
    <div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          togglePopup();
        }}
        disabled={loading}
        className="absolute top-5 right-5 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        {isResolved === 1 ? '보류' : '완료'}
      </button>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="text-center">
              {error && <p className="text-red-600 mb-2">{error}</p>}
              <p className="text-sm">
                {isResolved === 0
                  ? '해결된 피드백으로 변경하시겠습니까?'
                  : '해결되지 않은 피드백으로 변경하시겠습니까?'}
              </p>
              <button
                type="button"
                onClick={toggleResolvedStatus}
                className={`mt-4 w-full h-15 text-center bg-blue-500 p-2 rounded-lg hover:bg-blue-600`}
              >
                {isResolved === 0 ? '해결된 피드백으로 변경' : '해결되지 않은 피드백으로 변경'}
              </button>
              <button
                type="button"
                onClick={togglePopup}
                className="mt-4 w-full h-15 text-center bg-gray-300 p-2 rounded-lg hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFeedbackResolvedUpdate;
