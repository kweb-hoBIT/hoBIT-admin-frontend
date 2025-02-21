import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHobitQueryGetApi, useHobitMutatePostApi } from '../../hooks/hobitAdmin';
import FAQCreateForm from './FAQCreateForm';
import { selectAuth } from '../../redux/authSlice';
import { CreateFAQRequest, CreateFAQResponse, GetAllFAQCategoryRequest, GetAllFAQCategoryResponse, CreateCheckFAQCategoryDuplicateRequest, CreateCheckFAQCategoryDuplicateResponse } from '../../types/faq';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';

const FAQCreate: React.FC = () => {
  const navigate = useNavigate();
  const { user_id } = useSelector((state: RootState) => selectAuth(state));
  const [isCreating, setIsCreating] = useState(false);
  const [category, setCategory] = useState<GetAllFAQCategoryResponse['data']['categories']>([{
    maincategory_ko: '',
    maincategory_en: '',
    subcategories: {
      subcategory_ko: [],
      subcategory_en: []
    }
  }]);
  const [newFAQ, setNewFAQ] = useState<CreateFAQRequest['body']>({
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

  const GetAllFAQCategoryApi = useHobitQueryGetApi<GetAllFAQCategoryRequest, GetAllFAQCategoryResponse>('faqs/category');
  const CheckFAQCategoryDuplicateApi = useHobitMutatePostApi<CreateCheckFAQCategoryDuplicateRequest, CreateCheckFAQCategoryDuplicateResponse>('faqs/create/category/check');
  const FAQCreateApi = useHobitMutatePostApi<CreateFAQRequest, CreateFAQResponse>('faqs');

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
  }, [GetAllFAQCategoryApi.isSuccess]);


  // 필터 인덱스 찾기 함수
  const findFilterIndex = (key: string, value: string) => {
    if (key === 'maincategory_ko') {
      const index = category.findIndex((item) => item[key] === value);
      setNewFAQ({
        ...newFAQ,
        maincategory_ko: value,
        maincategory_en: category[index].maincategory_en,
      });
    }
    
    if (key === 'maincategory_en') {
      const index = category.findIndex((item) => item[key] === value);
      setNewFAQ({
        ...newFAQ,
        maincategory_ko: category[index].maincategory_ko,
        maincategory_en: value,
      });
      
    }
    if (key === 'subcategory_ko') {
      const index = category.findIndex((item) => item.maincategory_ko === newFAQ.maincategory_ko);
      const subIndex = category[index].subcategories.subcategory_ko.findIndex((sub) => sub === value);
      setNewFAQ({
        ...newFAQ,
        subcategory_ko: value,
        subcategory_en: category[index].subcategories.subcategory_en[subIndex],
      });
    }
    if (key === 'subcategory_en') {
      const index = category.findIndex((item) => item.maincategory_en === newFAQ.maincategory_en);
      const subIndex = category[index].subcategories.subcategory_en.findIndex((sub) => sub === value);
      setNewFAQ({
        ...newFAQ,
        subcategory_ko: category[index].subcategories.subcategory_ko[subIndex],
        subcategory_en: value,
      });
    }
  };

  const handleAddAnswer = () => {
    setNewFAQ({
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

    setNewFAQ({
      ...newFAQ,
      answer_ko: newFAQ.answer_ko.filter((_, i) => i !== index),
      answer_en: newFAQ.answer_en.filter((_, i) => i !== index),
    });
  };

  const handleCreate = async () => {
    if (isCreating) return;
    setIsCreating(true);

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
      setIsCreating(false);
      return;
    }


      const checkResponse = await CheckFAQCategoryDuplicateApi({
        body: {
          maincategory_ko,
          maincategory_en,
          subcategory_ko,
          subcategory_en,
        },
      });
    
      if (checkResponse.payload?.statusCode === 200 ) {
        if (checkResponse.payload.data.isDuplicated){
          alert(`다른 FAQ의 카테고리와 같은 카테고리를 사용하려면 띄어쓰기와 한영 단어가 완벽하게 일치해야 합니다.
            \n 예시:
            \n 기존 카테고리: 공간예약 - Reserve a space 
            \n 현재 카테고리: 공간 예약 - Reserve a space 
            \n => 띄어쓰기로 인한 에러
            \n 기존 카테고리: 공간예약 - Reserve a space 
            \n 현재 카테고리: 공간예약 - Reserve a room
            \n => 번역으로 인한 에러`);
          return;
        }
      } else {
        alert('FAQ 카테고리 중복 체크 중 오류가 발생했습니다.');
        console.log('FAQ 카테고리 중복 체크 중 오류가 발생했습니다.', checkResponse.error);
        return;
      }
    
      const createResponse = await FAQCreateApi({
        body: newFAQ,
      });
    
      if (createResponse.payload?.statusCode === 201) {
        alert('FAQ가 성공적으로 생성되었습니다!');
        navigate('/faqs');
      } else {
        setIsCreating(false);
        alert('FAQ 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
        console.log('FAQ 생성 중 오류가 발생했습니다.', createResponse.error);
      }
    } 

  return (
    <FAQCreateForm
      newFAQ={newFAQ}
      setNewFAQ={setNewFAQ}
      category={category}
      findFilterIndex={findFilterIndex}
      handleAddAnswer={handleAddAnswer}
      handleCreate={handleCreate}
      handleDeleteAnswer={handleDeleteAnswer}
      isCreating={isCreating}
    />
  );
};

export default FAQCreate;
