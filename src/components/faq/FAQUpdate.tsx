import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHobitQueryGetApi, useHobitMutatePutApi } from '../../hooks/hobitAdmin';
import FAQUpdateForm from './FAQUpdateForm';
import { selectAuth } from '../../redux/authSlice';
import { GetFAQRequest, GetFAQResponse, UpdateFAQRequest, UpdateFAQResponse } from '../../types/faq';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';

interface FAQUpdateProps {
  faq_id: string;
}

const FAQUpdate: React.FC<FAQUpdateProps> = ({ faq_id }) => {
  const navigate = useNavigate();
  const { user_id } = useSelector((state: RootState) => selectAuth(state));
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
  const FAQUpdateApi = useHobitMutatePutApi<UpdateFAQRequest, UpdateFAQResponse>('faqs');

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

  const handleAddAnswer = () => {
    setAnswersKo([...answersKo, { answer: '', url: '', email: '', phone: '' }]);
    setAnswersEn([...answersEn, { answer: '', url: '', email: '', phone: '' }]);
  };

  const handleDeleteAnswer = async (index: number) => {
    if (answersKo.length === 1) {
      alert('하나 이상의 답변을 입력해야 합니다!')
    } else {
      setAnswersKo(answersKo.filter((_, i) => i !== index));
      setAnswersEn(answersEn.filter((_, i) => i !== index));
    }
  }

  const handleUpdate = async () => {
    if (
      !maincategory_ko ||
      !maincategory_en ||
      !subcategory_ko ||
      !subcategory_en ||
      !question_ko ||
      !question_en ||
      !manager ||
      answersKo.some(
        (ans) => !ans.answer
      ) ||
      answersEn.some(
        (ans) => !ans.answer
      )
    ) {
      alert('모든 필드를 채워주세요.');
      return;
    }

    try {
      const response = await FAQUpdateApi({
        params: { faq_id },
        body: {
          user_id: Number(user_id),
          maincategory_ko,
          maincategory_en,
          subcategory_ko,
          subcategory_en,
          question_ko,
          question_en,
          answer_ko: answersKo,
          answer_en: answersEn,
          manager,
        },
      });

      if (response.payload?.status === 'success') {
        alert('FAQ가 성공적으로 수정되었습니다!');
        navigate('/faqs');
      } else {
        alert('FAQ 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error(error);
      alert('FAQ 수정에 실패했습니다.');
    }
  };

  // 로딩 상태일 때 로딩 스피너나 메시지를 표시
  if (FAQFetchApi.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <FAQUpdateForm
      maincategory_ko={maincategory_ko}
      maincategory_en={maincategory_en}
      subcategory_ko={subcategory_ko}
      subcategory_en={subcategory_en}
      question_ko={question_ko}
      question_en={question_en}
      answersKo={answersKo}
      answersEn={answersEn}
      manager={manager}
      setMaincategoryKo={setMaincategoryKo}
      setMaincategoryEn={setMaincategoryEn}
      setSubcategoryKo={setSubcategoryKo}
      setSubcategoryEn={setSubcategoryEn}
      setQuestionKo={setQuestionKo}
      setQuestionEn={setQuestionEn}
      setAnswersKo={setAnswersKo}
      setAnswersEn={setAnswersEn}
      setManager={setManager}
      handleAddAnswer={handleAddAnswer}
      handleUpdate={handleUpdate}
      handleDeleteAnswer={handleDeleteAnswer}
    />
  );
};

export default FAQUpdate;
