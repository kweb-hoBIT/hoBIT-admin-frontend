import React, { useState } from 'react';
import { useHobitMutateDeleteApi } from '../../../hooks/hobitAdmin';
import { DeleteUserFeedbackRequest, DeleteUserFeedbackResponse } from '../../../types/feedback';

import { appAlert } from '../../ui/Dialog';
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
      appAlert('피드백이 성공적으로 삭제되었습니다.');
      setShowPopup(false);
      if (onSuccess) onSuccess();
    } else {
      appAlert('피드백 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
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
        className="bg-danger text-white px-4 py-2 rounded-xl hover:bg-danger/90"
      >
        삭제
      </button>
      {showPopup && (
        <div className="modal-overlay">
          <div className="modal-panel max-w-[440px]">
            <div className="text-center">
              {error && <p className="text-danger mb-2">{error}</p>}
              <p>정말 이 피드백를 삭제하시겠습니까?</p>
              <button
                type="button"
                onClick={handleDeleteFAQ}
                className={`mt-4 w-full h-15 text-center bg-danger p-2 rounded-xl hover:bg-danger/90`}
              >
                삭제
              </button>
              <button
                type="button"
                onClick={togglePopup}
                className="mt-4 w-full h-15 text-center bg-card-2 p-2 rounded-xl hover:bg-card-3"
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
