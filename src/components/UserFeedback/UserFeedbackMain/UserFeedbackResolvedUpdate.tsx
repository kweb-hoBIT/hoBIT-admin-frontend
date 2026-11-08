import React, { useState } from 'react';
import { useHobitMutatePutApi } from '../../../hooks/hobitAdmin';
import { UpdateUserFeedbackRequest, UpdateUserFeedbackResponse } from '../../../types/feedback';

import { appAlert } from '../../ui/Dialog';
import Icon from '../../ui/Icon';
type UserFeedbackResolvedUpdateProps = {
  user_feedback_id: number;
  initialResolved: number;
  onResolvedChange: (id: number, resolved: number) => void;
  compact?: boolean; // 카드 안 작은 아이콘 버튼
};

const UserFeedbackResolvedUpdate: React.FC<UserFeedbackResolvedUpdateProps> = ({
  user_feedback_id,
  initialResolved,
  onResolvedChange,
  compact,
}) => {
  const [isResolved, setIsResolved] = useState<number>(initialResolved);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const UserFeedbackResolvedUpdateApi = useHobitMutatePutApi<
    UpdateUserFeedbackRequest,
    UpdateUserFeedbackResponse
  >('feedbacks/user');

  const toggleResolvedStatus = async () => {
    setError(null);
    const response = await UserFeedbackResolvedUpdateApi({
      params: { user_feedback_id: String(user_feedback_id) },
    });

    if (response.payload?.statusCode === 200) {
      const newResolvedStatus = isResolved === 0 ? 1 : 0;
      setIsResolved(newResolvedStatus);
      onResolvedChange(user_feedback_id, newResolvedStatus);
      appAlert('피드백 상태가 성공적으로 변경되었습니다.');
      setShowPopup(false);
    } else {
      appAlert('피드백 상태 변경 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.log('피드백 상태 변경 중 오류가 발생했습니다.', response.error);
    }
  };

  // 팝업 토글 함수
  const togglePopup = () => {
    setShowPopup(!showPopup);
    setError(null);
  };

  return (
    <div>
      {compact ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            togglePopup();
          }}
          aria-label={isResolved === 1 ? '보류로 되돌리기' : '해결 완료'}
          title={isResolved === 1 ? '보류로 되돌리기' : '해결 완료'}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors text-ink-2 hover:bg-card hover:text-accent-ink"
        >
          <Icon name={isResolved === 1 ? 'undo' : 'check'} className="h-[18px] w-[18px]" />
        </button>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePopup();
          }}
          className="bg-accent text-white px-4 py-2 rounded-xl hover:bg-accent/90"
        >
          {isResolved === 1 ? '보류' : '완료'}
        </button>
      )}

      {showPopup && (
        <div className="modal-overlay">
          <div className="modal-panel max-w-[440px]">
            <div className="text-center">
              {error && <p className="text-danger mb-2">{error}</p>}
              <p className="text-sm">
                {isResolved === 0
                  ? '해결된 피드백으로 변경하시겠습니까?'
                  : '해결되지 않은 피드백으로 변경하시겠습니까?'}
              </p>
              <button
                type="button"
                onClick={toggleResolvedStatus}
                className={`mt-4 w-full h-15 text-center bg-accent p-2 rounded-xl hover:bg-accent/90`}
              >
                {isResolved === 0 ? '해결된 피드백으로 변경' : '해결되지 않은 피드백으로 변경'}
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

export default UserFeedbackResolvedUpdate;
