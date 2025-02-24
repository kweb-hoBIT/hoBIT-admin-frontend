import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHobitQueryGetApi, useHobitMutatePostApi, useHobitMutatePutApi } from '../../hooks/hobitAdmin';
import FAQUpdateForm from './FAQUpdateForm';
import { selectAuth } from '../../redux/authSlice';
import { GetFAQRequest, GetFAQResponse, UpdateFAQRequest, UpdateFAQResponse, GetAllFAQCategoryRequest, GetAllFAQCategoryResponse, UpdateCheckFAQCategoryDuplicateRequest, UpdateCheckFAQCategoryDuplicateResponse } from '../../types/faq';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';

interface FAQUpdateProps {
  faq_id: string;
}

const FAQUpdate: React.FC<FAQUpdateProps> = ({ faq_id }) => {
  const navigate = useNavigate();
  const { user_id } = useSelector((state: RootState) => selectAuth(state));
  const [isUpdating, setIsUpdating] = useState(false);
  const [category, setCategory] = useState<GetAllFAQCategoryResponse['data']['categories']>([{
    maincategory_ko: '',
    maincategory_en: '',
    subcategories: {
      subcategory_ko: [],
      subcategory_en: []
    }
  }]);
  const [updatedFAQ, setupdatedFAQ] = useState<UpdateFAQRequest['body']>({
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

  const FAQFetchApi = useHobitQueryGetApi<GetFAQRequest, GetFAQResponse>('faqs', { params: { faq_id } });
  const GetAllFAQCategoryApi = useHobitQueryGetApi<GetAllFAQCategoryRequest, GetAllFAQCategoryResponse>('faqs/category');
  const CheckFAQCategoryDuplicateApi = useHobitMutatePostApi<UpdateCheckFAQCategoryDuplicateRequest, UpdateCheckFAQCategoryDuplicateResponse>('faqs/update/category/check');
  const FAQUpdateApi = useHobitMutatePutApi<UpdateFAQRequest, UpdateFAQResponse>('faqs');

  useEffect(() => {
    const fetchFAQ = async () => {
      if (FAQFetchApi.data?.payload?.statusCode === 200) {
        const faq = FAQFetchApi.data?.payload?.data?.faq;
        if (faq) {
          setupdatedFAQ({
            user_id: Number(user_id),
            maincategory_ko: faq.maincategory_ko || '',
            maincategory_en: faq.maincategory_en || '',
            subcategory_ko: faq.subcategory_ko || '',
            subcategory_en: faq.subcategory_en || '',
            question_ko: faq.question_ko || '',
            question_en: faq.question_en || '',
            answer_ko: faq.answer_ko || [{ answer: '', url: '', email: '', phone: '' }],
            answer_en: faq.answer_en || [{ answer: '', url: '', email: '', phone: '' }],
            manager: faq.manager || '',
          });
        }
      } else {
        alert('FAQ 데이터를 불러오는 데 실패했습니다.');
        console.log('FAQ 데이터를 불러오는 데 실패했습니다.', FAQFetchApi.error);
      }
    };

    if (FAQFetchApi.isSuccess && FAQFetchApi.data) {
      fetchFAQ();
    }
  }, [FAQFetchApi.isSuccess, FAQFetchApi.data, faq_id, user_id]);

  // FAQ Category 데이터 가져오기
  useEffect(() => {
    const fetchFAQCategory = async () => {
      if (GetAllFAQCategoryApi.data?.payload?.statusCode === 200) {
        const data = GetAllFAQCategoryApi.data.payload.data.categories;
        setCategory(data);
      } else {
        alert('FAQ 카테고리 데이터를 불러오는데 실패했습니다.');
        console.log('FAQ 카테고리 데이터를 불러오는데 실패했습니다.', GetAllFAQCategoryApi.error);
      }
    };

    if (GetAllFAQCategoryApi.isSuccess) {
      fetchFAQCategory();
    }
  }, [GetAllFAQCategoryApi.isSuccess, GetAllFAQCategoryApi.data]);

  // 필터 인덱스 찾기 함수
  const findFilterIndex = (key: string, value: string) => {
    if (key === 'maincategory_ko') {
      const index = category.findIndex((item) => item[key] === value);
      setupdatedFAQ({
        ...updatedFAQ,
        maincategory_ko: value,
        maincategory_en: category[index].maincategory_en,
      });
    }
    
    if (key === 'maincategory_en') {
      const index = category.findIndex((item) => item[key] === value);
      setupdatedFAQ({
        ...updatedFAQ,
        maincategory_ko: category[index].maincategory_ko,
        maincategory_en: value,
      });
      
    }
    if (key === 'subcategory_ko') {
      const index = category.findIndex((item) => item.maincategory_ko === updatedFAQ.maincategory_ko);
      const subIndex = category[index].subcategories.subcategory_ko.findIndex((sub) => sub === value);
      setupdatedFAQ({
        ...updatedFAQ,
        subcategory_ko: value,
        subcategory_en: category[index].subcategories.subcategory_en[subIndex],
      });
    }
    if (key === 'subcategory_en') {
      const index = category.findIndex((item) => item.maincategory_en === updatedFAQ.maincategory_en);
      const subIndex = category[index].subcategories.subcategory_en.findIndex((sub) => sub === value);
      setupdatedFAQ({
        ...updatedFAQ,
        subcategory_ko: category[index].subcategories.subcategory_ko[subIndex],
        subcategory_en: value,
      });
    }
  };


  const handleAddAnswer = () => {
    setupdatedFAQ({
      ...updatedFAQ,
      answer_ko: [...updatedFAQ.answer_ko, { answer: '', url: '', email: '', phone: '' }],
      answer_en: [...updatedFAQ.answer_en, { answer: '', url: '', email: '', phone: '' }],
    });
  };

  const handleDeleteAnswer = (index: number) => {
    if (updatedFAQ.answer_ko.length === 1) {
      alert('하나 이상의 답변을 입력해야 합니다!');
      return;
    }

    setupdatedFAQ({
      ...updatedFAQ,
      answer_ko: updatedFAQ.answer_ko.filter((_, i) => i !== index),
      answer_en: updatedFAQ.answer_en.filter((_, i) => i !== index),
    });
  };

  const handleUpdate = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
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
    } = updatedFAQ;

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
      
    const checkResponse = await CheckFAQCategoryDuplicateApi({
      body: {
        faq_id : Number(faq_id),
        maincategory_ko,
        maincategory_en,
        subcategory_ko,
        subcategory_en,
      },
    });

    if (checkResponse.payload?.statusCode === 200) {
      if (checkResponse.payload.data.isDuplicated) {
        alert(`다른 FAQ의 카테고리와 같은 카테고리를 사용하려면 띄어쓰기와 한영 단어가 완벽하게 일치해야 합니다.
          \n 기존 카테고리: 공간예약 - Reserve a space 
          \n 현재 카테고리: 공간 예약 - Reserve a space 
          \n => 띄어쓰기로 인한 에러
          \n 기존 카테고리: 공간예약 - Reserve a space 
          \n 현재 카테고리: 공간예약 - Reserve a room
          \n => 번역으로 인한 에러`);
        setIsUpdating(false);
        return;
      }
    } else {
      alert('FAQ 카테고리 중복 확인 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsUpdating(false);
      return;
    }
  

    const updateResponse = await FAQUpdateApi({
      params: { faq_id },
      body: updatedFAQ,
    });

    if (updateResponse.payload?.statusCode === 200) {
      alert('FAQ가 성공적으로 수정되었습니다!');
      navigate('/faqs');
    } else {
      alert('FAQ 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.log('FAQ 수정 중 오류가 발생했습니다.', updateResponse.error);
      setIsUpdating(false);
    }
  };

  if (FAQFetchApi.isLoading || GetAllFAQCategoryApi.isLoading){
    return <div></div>;
  }

  return (
    <FAQUpdateForm
      updatedFAQ={updatedFAQ}
      setupdatedFAQ={setupdatedFAQ}
      category={category}
      findFilterIndex={findFilterIndex}
      handleAddAnswer={handleAddAnswer}
      handleDeleteAnswer={handleDeleteAnswer}
      handleUpdate={handleUpdate}
      isUpdating={isUpdating}
    />
  );
};

export default FAQUpdate;
