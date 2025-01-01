import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHobitQueryGetApi, useHobitMutatePutApi } from '../../hooks/hobitAdmin';
import FAQUpdateForm from './SeniorFAQUpdateForm';
import { selectAuth } from '../../redux/authSlice';
import { GetSeniorFAQRequest, GetSeniorFAQResponse, UpdateSeniorFAQRequest, UpdateSeniorFAQResponse } from '../../types/seniorfaq';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';

interface SeniorFAQUpdateProps {
  senior_faq_id: string;
}

const SeniorFAQUpdate: React.FC<SeniorFAQUpdateProps> = ({ senior_faq_id }) => {
  const navigate = useNavigate();
  const { user_id } = useSelector((state: RootState) => selectAuth(state));

  const [updatedSeniorFAQ, setUpdatedSeniorFAQ] = useState<UpdateSeniorFAQRequest['body']>({
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
  
  const seniorFAQFetchApi = useHobitQueryGetApi<GetSeniorFAQRequest, GetSeniorFAQResponse>('seniorfaqs', {
    params: { senior_faq_id },
    query: {},
  });
  const seniorFAQUpdateApi = useHobitMutatePutApi<UpdateSeniorFAQRequest, UpdateSeniorFAQResponse>('seniorfaqs');

  useEffect(() => {
    const fetchSeniorFAQ = async () => {
      try {
        if (seniorFAQFetchApi.data?.payload?.statusCode === 200) {
          const seniorFAQ = seniorFAQFetchApi.data?.payload?.data?.seniorFaq;
          if (seniorFAQ) {
            setUpdatedSeniorFAQ({
              user_id: Number(user_id),
              maincategory_ko: seniorFAQ.maincategory_ko || '',
              maincategory_en: seniorFAQ.maincategory_en || '',
              subcategory_ko: seniorFAQ.subcategory_ko || '',
              subcategory_en: seniorFAQ.subcategory_en || '',
              detailcategory_ko: seniorFAQ.detailcategory_ko || '',
              detailcategory_en: seniorFAQ.detailcategory_en || '',
              answer_ko: seniorFAQ.answer_ko || [{ answer: '', url: '', email: '', phone: '', image: '', map: {latitude: '', longitude: ''} }],
              answer_en: seniorFAQ.answer_en || [{ answer: '', url: '', email: '', phone: '', image: '', map: {latitude: '', longitude: ''} }],
              manager: seniorFAQ.manager || '',
            });
          }
        } else {
          alert('Senior FAQ 데이터를 불러오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error(error);
        alert('Senior FAQ 데이터를 가져오는 중 오류가 발생했습니다.');
      }
    };

    if (!seniorFAQFetchApi.isLoading && seniorFAQFetchApi.data) {
      fetchSeniorFAQ();
    }
  }, [senior_faq_id, seniorFAQFetchApi.data, seniorFAQFetchApi.isLoading, user_id]);

  const handleAddAnswer = () => {
    setUpdatedSeniorFAQ({
      ...updatedSeniorFAQ,
      answer_ko: [
        ...updatedSeniorFAQ.answer_ko,
        { title: '', answer: '', url: '', email: '', phone: '', image: '', map: { latitude: '', longitude: '' } },
      ],
      answer_en: [
        ...updatedSeniorFAQ.answer_en,
        { title: '', answer: '', url: '', email: '', phone: '', image: '', map: { latitude: '', longitude: '' } },
      ],
    });
  };

  const handleDeleteAnswer = (index: number) => {
    if (updatedSeniorFAQ.answer_ko.length === 1) {
      alert('하나 이상의 답변을 입력해야 합니다!');
      return;
    }

    setUpdatedSeniorFAQ({
      ...updatedSeniorFAQ,
      answer_ko: updatedSeniorFAQ.answer_ko.filter((_, i) => i !== index),
      answer_en: updatedSeniorFAQ.answer_en.filter((_, i) => i !== index),
    });
  };

  const handleUpdate = async () => {
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
    } = updatedSeniorFAQ;

    if (
      !maincategory_ko ||
      !maincategory_en ||
      !subcategory_ko ||
      !subcategory_en ||
      !detailcategory_ko ||
      !detailcategory_en ||
      !manager ||
      answer_ko.some((ans) => !ans.answer) ||
      answer_en.some((ans) => !ans.answer)
    ) {
      alert('모든 필드를 채워주세요.');
      return;
    }

    try {
      const response = await seniorFAQUpdateApi({
        params: { senior_faq_id },
        body: updatedSeniorFAQ,
      });

      if (response.payload?.statusCode === 200) {
        alert('Senior FAQ가 성공적으로 수정되었습니다!');
        navigate('/seniorfaqs');
      } else {
        alert('Senior FAQ 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error(error);
      alert('Senior FAQ 수정에 실패했습니다.');
    }
  };

  if (seniorFAQFetchApi.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <FAQUpdateForm
      updatedFAQ={updatedSeniorFAQ}
      setupdatedFAQ={setUpdatedSeniorFAQ}
      handleAddAnswer={handleAddAnswer}
      handleDeleteAnswer={handleDeleteAnswer}
      handleUpdate={handleUpdate}
    />
  );
};

export default SeniorFAQUpdate;
