import React, { useState } from 'react';
import { useHobitMutatePostApi } from '../../hooks/hobitAdmin';
import { TranslateFAQRequest, TranslateFAQResponse } from '../../types/faq';

interface TranslateProps {
  sourceText: string;
  setTargetText: (translatedText: string) => void;
}

const Translate: React.FC<TranslateProps> = ({ sourceText, setTargetText }) => {
  const [loading, setLoading] = useState(false);
  const translateFAQApi = useHobitMutatePostApi<TranslateFAQRequest, TranslateFAQResponse>('translate');

  const handleTranslate = async () => {
    setLoading(true);
    try {
      const response = await translateFAQApi({
        body :{ text: sourceText }
      });

      if (response.payload?.status === 'success') {
        const translatedText = response.payload.data?.translatedText ?? '';
        setTargetText(translatedText);
      } else {
        console.error('번역 실패');
      }
    } catch (error) {
      console.error('번역 요청 중 오류 발생', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleTranslate}
      className="bg-gray-500 text-white px-4 py-2 rounded-lg mt-2"
      disabled={loading}
    >
      {loading ? '번역 중...' : '번역하기'}
    </button>
  );
};

export default Translate;
