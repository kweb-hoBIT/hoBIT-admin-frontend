import React, { useState } from 'react';
import { selectAuth } from '../../redux/authSlice';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { useHobitMutateDeleteApi } from '../../hooks/hobitAdmin';
import { DeleteFAQRequest, DeleteFAQResponse } from '../../types/faq';
import Button from '../Button';

interface FAQDeleteProps {
  faq_id: string;
  onSuccess?: () => void;
}

const FAQDelete: React.FC<FAQDeleteProps> = ({ faq_id, onSuccess }) => {
  const { user_id } = useSelector((state: RootState) => selectAuth(state));
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const deleteFAQApi = useHobitMutateDeleteApi<DeleteFAQRequest, DeleteFAQResponse>('faqs');

  const handleDeleteFAQ = async () => {
    try {
      const response = await deleteFAQApi({
        params: { faq_id },
        body: {user_id : Number(user_id)},
      });

      if (response.payload?.status === 'success') {
        alert('FAQ가 성공적으로 삭제되었습니다.');
        setShowPopup(false);
        if (onSuccess) onSuccess();
      } else {
        setError('FAQ 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (err) {
      setError('FAQ 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 팝업 토글 함수
  const togglePopup = () => {
    setShowPopup(!showPopup);
    setError(null);
  };

  return (
    <div>
      <Button
        type="button"
        onClick={togglePopup}
        children="삭제"
        className="bg-red-500 text-white text-xs px-3 py-1 rounded-md hover:bg-red-600"
      />
      {showPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="text-center">
              {error && <p className="text-red-600 mb-2">{error}</p>}
              <p>정말 이 FAQ를 삭제하시겠습니까?</p>
              <Button
                type="button"
                onClick={handleDeleteFAQ}
                children="삭제"
                className="mt-4 w-full h-15 text-center bg-red-500 p-2 rounded-lg hover:bg-red-600"
              />
              <Button
                type="button"
                onClick={togglePopup}
                children="취소"
                className="mt-4 w-full h-15 text-center bg-gray-300 p-2 rounded-lg hover:bg-gray-400"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQDelete;
