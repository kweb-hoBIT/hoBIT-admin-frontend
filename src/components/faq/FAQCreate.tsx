import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHobitMutatePostApi } from '../../hooks/hobitAdmin';
import FAQCreateForm from './FAQCreateForm';
import { selectAuth } from '../../redux/authSlice';
import { CreateFAQRequest, CreateFAQResponse } from '../../types/faq';
import { RootState } from '../../redux/store';

const FAQCreate: React.FC = () => {
  const { user_id } = useSelector((state: RootState) => selectAuth(state));
  const [maincategory_ko, setMaincategoryKo] = useState<string>('');
  const [maincategory_en, setMaincategoryEn] = useState<string>('');
  const [subcategory_ko, setSubcategoryKo] = useState<string>('');
  const [subcategory_en, setSubcategoryEn] = useState<string>('');
  const [question_ko, setQuestionKo] = useState<string>('');
  const [question_en, setQuestionEn] = useState<string>('');
  const [answersKo, setAnswersKo] = useState<{ answer: string; url: string; email: string; phone: string }[]>([{ answer: '', url: '', email: '', phone: '' }]);
  const [answersEn, setAnswersEn] = useState<{ answer: string; url: string; email: string; phone: string }[]>([{ answer: '', url: '', email: '', phone: '' }]);
  const [manager, setManager] = useState<string>('');
  
  const FAQCreateApi = useHobitMutatePostApi<CreateFAQRequest, CreateFAQResponse>('faqs');

  const handleAddAnswer = () => {
    setAnswersKo([...answersKo, { answer: '', url: '', email: '', phone: '' }]);
    setAnswersEn([...answersEn, { answer: '', url: '', email: '', phone: '' }]);
  };

  const handleSubmit = async () => {
    if (
      !maincategory_ko ||
      !maincategory_en ||
      !subcategory_ko ||
      !subcategory_en ||
      !question_ko ||
      !question_en ||
      !manager ||
      answersKo.some(
        (ans) => !ans.answer || !ans.url || !ans.email || !ans.phone
      ) ||
      answersEn.some(
        (ans) => !ans.answer || !ans.url || !ans.email || !ans.phone
      )
    ) {
      alert('모든 필드를 채워주세요.');
      return;
    }

    try {
      const response = await FAQCreateApi({
        body : {
          user_id: Number(user_id),
          maincategory_ko: maincategory_ko,
          maincategory_en: maincategory_en,
          subcategory_ko: subcategory_ko,
          subcategory_en: subcategory_en,
          question_ko: question_ko,
          question_en: question_en,
          answer_ko: answersKo,
          answer_en: answersEn,
          manager
      }
      });

      if (response.payload?.status === 'success') {
        alert('FAQ가 성공적으로 생성되었습니다!');
        // 폼 초기화
        setMaincategoryKo('');
        setMaincategoryEn('');
        setSubcategoryKo('');
        setSubcategoryEn('');
        setQuestionKo('');
        setQuestionEn('');
        setAnswersKo([{ answer: '', url: '', email: '', phone: '' }]);
        setAnswersEn([{ answer: '', url: '', email: '', phone: '' }]);
        setManager('');
      } else {
        alert('FAQ 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error(error);
      alert('FAQ 생성에 실패했습니다.');
    }
  };

  return (
    <FAQCreateForm
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
      handleSubmit={handleSubmit}
    />
  );
};

export default FAQCreate;
