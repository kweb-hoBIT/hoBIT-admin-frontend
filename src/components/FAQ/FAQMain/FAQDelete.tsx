import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../../redux/authSlice';
import { RootState } from '../../../redux/store';
import { useHobitMutateDeleteApi } from '../../../hooks/hobitAdmin';
import { DeleteFAQRequest, DeleteFAQResponse } from '../../../types/faq';

import { appAlert } from '../../ui/Dialog';
interface FAQDeleteProps {
  faq_id: string;
  question_ko: string;
  onSuccess?: () => void;
}

const FAQDelete: React.FC<FAQDeleteProps> = ({ faq_id, question_ko, onSuccess }) => {
  const { user_id } = useSelector((state: RootState) => selectAuth(state));
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteFAQApi = useHobitMutateDeleteApi<DeleteFAQRequest, DeleteFAQResponse>('faqs');

  const togglePopup = useCallback(() => {
    setShowPopup((prev) => !prev);
    setError(null);
    setInputText('');
  }, []);

  const handleDeleteFAQ = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteFAQApi({
        params: { faq_id },
        body: { user_id: Number(user_id) },
      });

      if (response.payload?.statusCode === 200) {
        appAlert('FAQ가 성공적으로 삭제되었습니다.');
        togglePopup();
        onSuccess?.();
      } else {
        setError('FAQ 삭제 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
    } catch {
      setError('FAQ 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsDeleting(false);
    }
  };

  const isDeleteEnabled = inputText === question_ko;

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
          <div className="modal-panel max-w-[440px] text-center">
            {error && <p className="text-danger mb-2">{error}</p>}
            <p>
              정말 이 FAQ를 삭제하시겠습니까?
              <br />이 질문과 관련된 모든 정보가 삭제됩니다.
            </p>
            <p className="mt-4 text-sm text-ink-2">
              삭제하려면 "{question_ko}" 질문을 입력하세요:
            </p>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={question_ko}
              className="mt-2 p-2 border border-line rounded-xl w-full"
            />
            <button
              type="button"
              onClick={handleDeleteFAQ}
              disabled={!isDeleteEnabled || isDeleting}
              className={`mt-4 w-full h-15 bg-danger p-2 rounded-xl hover:bg-danger/90 ${
                !isDeleteEnabled || isDeleting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </button>
            <button
              type="button"
              onClick={togglePopup}
              className="mt-4 w-full h-15 bg-card-2 p-2 rounded-xl hover:bg-card-3"
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQDelete;
