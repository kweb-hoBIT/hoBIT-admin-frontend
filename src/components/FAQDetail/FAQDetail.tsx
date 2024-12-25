import React, { useState, useEffect } from 'react';
import { useHobitQueryGetApi } from '../../hooks/hobitAdmin';
import { GetFAQRequest, GetFAQResponse } from '../../types/faq';
import FAQDetailForm from './FAQDetailForm';

interface FAQDetailProps {
  faq_id: string;
}

const FAQDetail: React.FC<FAQDetailProps> = ({ faq_id }) => {
  const [faqData, setFaqData] = useState<GetFAQResponse['data']['faq']>({
    faq_id: faq_id ? Number(faq_id) : 0,
    maincategory_ko: '',
    maincategory_en: '',
    subcategory_ko: '',
    subcategory_en: '',
    question_ko: '',
    question_en: '',
    answer_ko: [{ answer: '', url: '', email: '', phone: '' }],
    answer_en: [{ answer: '', url: '', email: '', phone: '' }],
    manager: '',
    created_at: '',
    updated_at: '',
  });

  const FAQFetchApi = useHobitQueryGetApi<GetFAQRequest, GetFAQResponse>('faqs', { params: { faq_id }, query: {} });

  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        if (FAQFetchApi.data?.payload?.status === 'success') {
          const faq = FAQFetchApi.data?.payload?.data?.faq;
          if (faq) {
            setFaqData(faq);
          }
        } else {
          alert('FAQ 데이터를 불러오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error(error);
        alert('FAQ 데이터를 가져오는 중 오류가 발생했습니다.');
      }
    };

    if (!FAQFetchApi.isLoading && FAQFetchApi.data) {
      fetchFAQ();
    }
  }, [faq_id, FAQFetchApi.data, FAQFetchApi.isLoading]);

  // 로딩 상태일 때 로딩 스피너나 메시지를 표시
  if (FAQFetchApi.isLoading) {
    return <div>Loading...</div>;
  }

  return <FAQDetailForm faqData={faqData} />;
};

export default FAQDetail;
