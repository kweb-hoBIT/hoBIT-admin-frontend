import React, { useState } from 'react';
import { useHobitMutateDeleteApi } from '../../hooks/hobitAdmin';
import { DeleteSeniorFAQRequest, DeleteSeniorFAQResponse } from '../../types/seniorfaq';

interface SeniorFAQDeleteProps {
  senior_faq_id: string;
  detailcategory_ko: string;
  onSuccess?: () => void;
}

const SeniorFAQDelete: React.FC<SeniorFAQDeleteProps> = ({ senior_faq_id, detailcategory_ko, onSuccess }) => {
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [inputText, setInputText] = useState('');

  const deleteSeniorFAQApi = useHobitMutateDeleteApi<DeleteSeniorFAQRequest, DeleteSeniorFAQResponse>('seniorfaqs');

  // 삭제 버튼을 활성화할 수 있는지 여부를 판단
  const isDeleteEnabled = inputText === detailcategory_ko;

  const handleDeleteSeniorFAQ = async () => {
    try {
      const response = await deleteSeniorFAQApi({
        params: { senior_faq_id }
      });

      if (response.payload?.statusCode === 200) {
        alert('Senior FAQ가 성공적으로 삭제되었습니다.');
        setShowPopup(false);
        if (onSuccess) onSuccess();
      } else {
        setError('Senior FAQ 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (err) {
      setError('Senior FAQ 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
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
              <p>정말 이 Senior FAQ를 삭제하시겠습니까?<br />이 질문과 관련된 모든 정보가 삭제됩니다.</p>
              <p className="mt-4 text-sm text-gray-600">
                삭제하려면 "{detailcategory_ko}"
                <br />
                세부카테고리를 입력하세요:
              </p>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={detailcategory_ko}
                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
              />
              <button
                type="button"
                onClick={handleDeleteSeniorFAQ}
                className={`mt-4 w-full h-15 text-center bg-red-500 p-2 rounded-lg hover:bg-red-600 ${!isDeleteEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!isDeleteEnabled}
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

export default SeniorFAQDelete;
