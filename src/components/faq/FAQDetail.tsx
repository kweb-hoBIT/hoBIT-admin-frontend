import React, { useState, useEffect } from 'react';
import { useHobitQueryGetApi} from '../../hooks/hobitAdmin';
import { GetFAQRequest, GetFAQResponse} from '../../types/faq';
import FAQDetailForm from './FAQDetailForm';


interface FAQUpdateProps {
  faq_id: string;
}

const FAQDetail: React.FC<FAQUpdateProps> = ({ faq_id }) => {

  const [maincategory_ko, setMaincategoryKo] = useState<string>('');
  const [maincategory_en, setMaincategoryEn] = useState<string>('');
  const [subcategory_ko, setSubcategoryKo] = useState<string>('');
  const [subcategory_en, setSubcategoryEn] = useState<string>('');
  const [question_ko, setQuestionKo] = useState<string>('');
  const [question_en, setQuestionEn] = useState<string>('');
  const [answersKo, setAnswersKo] = useState<
    { answer: string; url: string; email: string; phone: string }[]
  >([]);
  const [answersEn, setAnswersEn] = useState<
    { answer: string; url: string; email: string; phone: string }[]
  >([]);
  const [manager, setManager] = useState<string>('');

  const FAQFetchApi = useHobitQueryGetApi<GetFAQRequest, GetFAQResponse>('faqs', { params: { faq_id }, query: {} });

  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        if (FAQFetchApi.data?.payload?.status === 'success') {
          const faq = FAQFetchApi.data?.payload?.data?.faq;
          console.log(faq);
          if (faq) {
            setMaincategoryKo(faq.maincategory_ko || '');
            setMaincategoryEn(faq.maincategory_en || '');
            setSubcategoryKo(faq.subcategory_ko || '');
            setSubcategoryEn(faq.subcategory_en || '');
            setQuestionKo(faq.question_ko || '');
            setQuestionEn(faq.question_en || '');
            setAnswersKo(faq.answer_ko || []);
            setAnswersEn(faq.answer_en || []);
            setManager(faq.manager || '');
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

  return (
    <FAQDetailForm
      maincategory_ko={maincategory_ko}
      maincategory_en={maincategory_en}
      subcategory_ko={subcategory_ko}
      subcategory_en={subcategory_en}
      question_ko={question_ko}
      question_en={question_en}
      answersKo={answersKo}
      answersEn={answersEn}
      manager={manager}
    />
  );
};

export default FAQDetail;
