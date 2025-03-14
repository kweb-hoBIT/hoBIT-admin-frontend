import React, { useState } from 'react';
import { useHobitMutateDeleteApi } from '../../../hooks/hobitAdmin';
import { DeleteUserFeedbackRequest, DeleteUserFeedbackResponse } from '../../../types/feedback';

interface FAQDeleteProps {
  user_feedback_id: string;
  onSuccess?: () => void;
}

const UserFeedbackDelete: React.FC<FAQDeleteProps> = ({ user_feedback_id, onSuccess }) => {
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const deleteFAQApi = useHobitMutateDeleteApi<DeleteUserFeedbackRequest, DeleteUserFeedbackResponse>('feedbacks/user');

  const handleDeleteFAQ = async () => {
    setError(null);
    const response = await deleteFAQApi({
      params: { user_feedback_id }
    });

    if (response.payload?.statusCode === 200) {
      alert('피드백이 성공적으로 삭제되었습니다.');
      setShowPopup(false);
      if (onSuccess) onSuccess();
    } else {
      alert('피드백 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.log('피드백 삭제 중 오류가 발생했습니다.', response.error);
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
        type="button"
        onClick={togglePopup}
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
      >
        삭제
      </button>
      {showPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="text-center">
              {error && <p className="text-red-600 mb-2">{error}</p>}
              <p>정말 이 피드백를 삭제하시겠습니까?</p>
              <button
                type="button"
                onClick={handleDeleteFAQ}
                className={`mt-4 w-full h-15 text-center bg-red-500 p-2 rounded-lg hover:bg-red-600`}
              >
                삭제
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

export default UserFeedbackDelete;
