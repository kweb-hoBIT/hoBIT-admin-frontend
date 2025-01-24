import React, { useEffect, useState } from 'react';
import { useHobitQueryGetApi } from '../../hooks/hobitAdmin';
import { GetAllFAQRequest, GetAllFAQResponse } from '../../types/faq';
import FAQMainForm from './FAQMainForm';

const FAQMain: React.FC = () => {
  const [faqData, setFaqData] = useState<GetAllFAQResponse['data']['faqs']>([]);
  const [error, setError] = useState<string | null>(null);

  const GetFAQsApi = useHobitQueryGetApi<GetAllFAQRequest, GetAllFAQResponse>('faqs');

  // FAQ 데이터 가져오기
  useEffect(() => {
    const fetchFAQData = async () => {
      if (GetFAQsApi.data?.payload?.statusCode === 200) {
        const data = GetFAQsApi.data.payload.data.faqs;
        setFaqData(data);
      } else {
        setError('FAQ 데이터를 가져오는 중 오류 발생');
      }
    };

    if (GetFAQsApi.isSuccess) {
      fetchFAQData();
    }
  }, [GetFAQsApi.isSuccess, GetFAQsApi.data]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <FAQMainForm faqs={faqData} />
    </div>
  );
};

export default FAQMain;