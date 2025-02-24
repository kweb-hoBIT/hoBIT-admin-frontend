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

  const FAQFetchApi = useHobitQueryGetApi<GetFAQRequest, GetFAQResponse>('faqs', { params: { faq_id } });

  useEffect(() => {
    const fetchFAQ = async () => {
      if (FAQFetchApi.data?.payload?.statusCode === 200) {
        const faq = FAQFetchApi.data?.payload?.data?.faq;
        setFaqData(faq);
      } else {
        alert('FAQ 데이터를 불러오는 데 실패했습니다.');
        console.log('FAQ 데이터를 불러오는 데 실패했습니다.', FAQFetchApi.error);
      }
    };
    if (FAQFetchApi.isSuccess && FAQFetchApi.data) {
      fetchFAQ();
    }
  }, [faq_id, FAQFetchApi.data, FAQFetchApi.isSuccess]);

  if(!FAQFetchApi.data){
    return <div></div>;
  }

  return <FAQDetailForm faqData={faqData} />;
};

export default FAQDetail;
