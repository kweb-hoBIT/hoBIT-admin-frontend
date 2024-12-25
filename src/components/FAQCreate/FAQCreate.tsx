import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHobitMutatePostApi } from '../../hooks/hobitAdmin';
import FAQCreateForm from './FAQCreateForm';
import { selectAuth } from '../../redux/authSlice';
import { CreateFAQRequest, CreateFAQResponse } from '../../types/faq';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';

const FAQCreate: React.FC = () => {
  const navigate = useNavigate();
  const { user_id } = useSelector((state: RootState) => selectAuth(state));

  const [newFAQ, setnewFAQ] = useState<CreateFAQRequest["body"]>({
    user_id: user_id ? Number(user_id) : 0,
    maincategory_ko: '',
    maincategory_en: '',
    subcategory_ko: '',
    subcategory_en: '',
    question_ko: '',
    question_en: '',
    answer_ko: [{ answer: '', url: '', email: '', phone: '' }],
    answer_en: [{ answer: '', url: '', email: '', phone: '' }],
    manager: '',
  });

  const FAQCreateApi = useHobitMutatePostApi<CreateFAQRequest, CreateFAQResponse>('faqs');

  const handleAddAnswer = () => {
    setnewFAQ({
      ...newFAQ,
      answer_ko: [...newFAQ.answer_ko, { answer: '', url: '', email: '', phone: '' }],
      answer_en: [...newFAQ.answer_en, { answer: '', url: '', email: '', phone: '' }],
    });
  };

  const handleDeleteAnswer = (index: number) => {
    if (newFAQ.answer_ko.length === 1) {
      alert('하나 이상의 답변을 입력해야 합니다!');
      return;
    }

    setnewFAQ({
      ...newFAQ,
      answer_ko: newFAQ.answer_ko.filter((_, i) => i !== index),
      answer_en: newFAQ.answer_en.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async () => {
    const {
      maincategory_ko,
      maincategory_en,
      subcategory_ko,
      subcategory_en,
      question_ko,
      question_en,
      manager,
      answer_ko,
      answer_en,
    } = newFAQ;

    if (
      !maincategory_ko ||
      !maincategory_en ||
      !subcategory_ko ||
      !subcategory_en ||
      !question_ko ||
      !question_en ||
      !manager ||
      answer_ko.some((ans) => !ans.answer) ||
      answer_en.some((ans) => !ans.answer)
    ) {
      alert('모든 필드를 채워주세요.');
      return;
    }

    try {
      const response = await FAQCreateApi({
        body: newFAQ,
      });

      if (response.payload?.status === 'success') {
        alert('FAQ가 성공적으로 생성되었습니다!');
        // 폼 초기화
        setnewFAQ({
          user_id: user_id ? Number(user_id) : 0,
          maincategory_ko: '',
          maincategory_en: '',
          subcategory_ko: '',
          subcategory_en: '',
          question_ko: '',
          question_en: '',
          answer_ko: [{ answer: '', url: '', email: '', phone: '' }],
          answer_en: [{ answer: '', url: '', email: '', phone: '' }],
          manager: '',
        });
        navigate('/faqs');
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
      newFAQ={newFAQ}
      setnewFAQ={setnewFAQ}
      handleAddAnswer={handleAddAnswer}
      handleSubmit={handleSubmit}
      handleDeleteAnswer={handleDeleteAnswer}
    />
  );
};

export default FAQCreate;
