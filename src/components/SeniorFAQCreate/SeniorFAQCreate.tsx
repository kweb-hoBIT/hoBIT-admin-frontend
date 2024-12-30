import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHobitMutatePostApi } from '../../hooks/hobitAdmin';
import SeniorFAQCreateForm from './SeniorFAQCreateForm';
import { selectAuth } from '../../redux/authSlice';
import { CreateSeniorFAQRequest, CreateSeniorFAQResponse } from '../../types/seniorfaq';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';

const SeniorFAQCreate: React.FC = () => {
  const navigate = useNavigate();
  const { user_id } = useSelector((state: RootState) => selectAuth(state));

  const [newSeniorFAQ, setNewSeniorFAQ] = useState<CreateSeniorFAQRequest["body"]>({
    user_id: user_id ? Number(user_id) : 0,
    maincategory_ko: '',
    maincategory_en: '',
    subcategory_ko: '',
    subcategory_en: '',
    detailcategory_ko: '',
    detailcategory_en: '',
    answer_ko: [
      {
        title: '',
        answer: '',
        url: '',
        email: '',
        phone: '',
        image: '',
        map: { latitude: '', longitude: '' },
      },
    ],
    answer_en: [
      {
        title: '',
        answer: '',
        url: '',
        email: '',
        phone: '',
        image: '',
        map: { latitude: '', longitude: '' },
      },
    ],
    manager: '',
  });

  const SeniorFAQCreateApi = useHobitMutatePostApi<CreateSeniorFAQRequest, CreateSeniorFAQResponse>('seniorfaqs');

  const handleAddAnswer = () => {
    setNewSeniorFAQ({
      ...newSeniorFAQ,
      answer_ko: [
        ...newSeniorFAQ.answer_ko,
        { title: '', answer: '', url: '', email: '', phone: '', image: '', map: { latitude: '', longitude: '' } },
      ],
      answer_en: [
        ...newSeniorFAQ.answer_en,
        { title: '', answer: '', url: '', email: '', phone: '', image: '', map: { latitude: '', longitude: '' } },
      ],
    });
  };

  const handleDeleteAnswer = (index: number) => {
    if (newSeniorFAQ.answer_ko.length === 1) {
      alert('하나 이상의 답변을 입력해야 합니다!');
      return;
    }

    setNewSeniorFAQ({
      ...newSeniorFAQ,
      answer_ko: newSeniorFAQ.answer_ko.filter((_, i) => i !== index),
      answer_en: newSeniorFAQ.answer_en.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async () => {
    const {
      maincategory_ko,
      maincategory_en,
      subcategory_ko,
      subcategory_en,
      detailcategory_ko,
      detailcategory_en,
      manager,
      answer_ko,
      answer_en,
    } = newSeniorFAQ;

    if (
      !maincategory_ko ||
      !maincategory_en ||
      !subcategory_ko ||
      !subcategory_en ||
      !detailcategory_ko ||
      !detailcategory_en ||
      !manager ||
      answer_ko.some((ans) => !ans.answer || !ans.title) ||
      answer_en.some((ans) => !ans.answer || !ans.title)
    ) {
      alert('모든 필드를 채워주세요.');
      return;
    }

    try {
      const response = await SeniorFAQCreateApi({
        body: newSeniorFAQ,
      });
      console.log(newSeniorFAQ);

      if (response.payload?.statusCode === 201) {
        alert('Senior FAQ가 성공적으로 생성되었습니다!');
        setNewSeniorFAQ({
          user_id: user_id ? Number(user_id) : 0,
          maincategory_ko: '',
          maincategory_en: '',
          subcategory_ko: '',
          subcategory_en: '',
          detailcategory_ko: '',
          detailcategory_en: '',
          answer_ko: [
            {
              title: '',
              answer: '',
              url: '',
              email: '',
              phone: '',
              image: '',
              map: { latitude: '', longitude: '' },
            },
          ],
          answer_en: [
            {
              title: '',
              answer: '',
              url: '',
              email: '',
              phone: '',
              image: '',
              map: { latitude: '', longitude: '' },
            },
          ],
          manager: '',
        });
        navigate('/seniorfaqs');
      } else {
        alert('Senior FAQ 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      alert('Senior FAQ 생성에 실패했습니다.');
    }
  };

  return (
    <SeniorFAQCreateForm
      newSeniorFAQ={newSeniorFAQ}
      setNewSeniorFAQ={setNewSeniorFAQ}
      handleAddAnswer={handleAddAnswer}
      handleSubmit={handleSubmit}
      handleDeleteAnswer={handleDeleteAnswer}
    />
  );
};

export default SeniorFAQCreate;
