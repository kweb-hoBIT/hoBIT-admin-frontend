import React, { useEffect, useState } from 'react';
import { useHobitQueryGetApi } from '../../hooks/hobitAdmin';
import { GetAllFAQRequest, GetAllFAQResponse } from '../../types/faq';
import FAQMainForm from './FAQMainForm';
import FAQDelete from './FAQDelete'

interface FAQMainProps {
  filter: string;
  selectedFilter: 'faq_id' | 'maincategory_ko' | 'subcategory_ko' | 'question_ko' | 'manager';
}

const FAQMain: React.FC<FAQMainProps> = ({ filter, selectedFilter }) => {
  const [faqData, setFaqData] = useState<GetAllFAQResponse['data']['faqs']>([]);
  const [filteredData, setFilteredData] = useState<GetAllFAQResponse['data']['faqs']>([]);
  const [error, setError] = useState<string | null>(null);

  const GetFAQsApi = useHobitQueryGetApi<GetAllFAQRequest, GetAllFAQResponse>('faqs', {
    params: {}, query: {},
  });

  // FAQ 데이터 가져오기
  useEffect(() => {
    const fetchFAQData = async () => {
      if (GetFAQsApi.data?.payload?.status === 'success') {
        const data = GetFAQsApi.data.payload.data.faqs;
        setFaqData(data);
      } else {
        setError('FAQ 데이터를 가져오는 중 오류 발생');
      }
    };

    if (!GetFAQsApi.isLoading && GetFAQsApi.isSuccess) {
      fetchFAQData();
    }
  }, [GetFAQsApi]);

  // faqData와 filter에 의존하여 filteredData 업데이트
  useEffect(() => {
    const lowerCaseFilter = filter.toLowerCase();
    const filtered = faqData.filter((faq) =>
      String(faq[selectedFilter]).toLowerCase().includes(lowerCaseFilter)
    );
    setFilteredData(filtered);
  }, [faqData, filter, selectedFilter]);

  if (GetFAQsApi.isLoading) {
    return <div>FAQ 데이터를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!filteredData?.length) {
    return <div>FAQ 데이터가 없습니다.</div>;
  }

  return (
    <div>
      <FAQMainForm faqs={filteredData} />
      <FAQDelete faq_id="123" />
    </div>
  );
};

export default FAQMain;
