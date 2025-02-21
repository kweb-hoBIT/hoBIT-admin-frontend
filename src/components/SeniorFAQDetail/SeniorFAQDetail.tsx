import React, { useState, useEffect } from 'react';
import { useHobitQueryGetApi } from '../../hooks/hobitAdmin';
import { GetSeniorFAQRequest, GetSeniorFAQResponse } from '../../types/seniorfaq';
import SeniorFAQDetailForm from './SeniorFAQDetailForm';

interface SeniorFAQDetailProps {
  senior_faq_id: string;
}

const SeniorFAQDetail: React.FC<SeniorFAQDetailProps> = ({ senior_faq_id }) => {
  const [seniorFaqData, setSeniorFaqData] = useState<GetSeniorFAQResponse['data']['seniorFaq']>({
    senior_faq_id: senior_faq_id ? Number(senior_faq_id) : 0,
    maincategory_ko: '',
    maincategory_en: '',
    subcategory_ko: '',
    subcategory_en: '',
    detailcategory_ko: '',
    detailcategory_en: '',
    answer_ko: [{ title: '', answer: '', url: '', map: { latitude: '', longitude: '' } }],
    answer_en: [{ title: '', answer: '', url: '', map: { latitude: '', longitude: '' } }],
    manager: '',
    created_at: '',
    updated_at: '',
  });

  const seniorFAQFetchApi = useHobitQueryGetApi<GetSeniorFAQRequest, GetSeniorFAQResponse>('seniorfaqs', {
    params: { senior_faq_id },
  });

  useEffect(() => {
    const fetchSeniorFAQ = async () => {
      if (seniorFAQFetchApi.data?.payload?.statusCode === 200) {
        const seniorFaq = seniorFAQFetchApi.data?.payload?.data?.seniorFaq;
        setSeniorFaqData(seniorFaq);
      } else {
        alert('Senior FAQ 데이터를 불러오는 데 실패했습니다.');
        console.log('Senior FAQ 데이터를 불러오는 데 실패했습니다.', seniorFAQFetchApi.error);
      }
    };
    if (seniorFAQFetchApi.data && seniorFAQFetchApi.isSuccess) {
      fetchSeniorFAQ();
    }
  }, [senior_faq_id, seniorFAQFetchApi.isSuccess, seniorFAQFetchApi.data]);

  return <SeniorFAQDetailForm seniorFaqData={seniorFaqData} />;
};

export default SeniorFAQDetail;
