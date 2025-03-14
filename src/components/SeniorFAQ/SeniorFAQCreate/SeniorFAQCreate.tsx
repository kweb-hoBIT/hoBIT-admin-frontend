import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHobitQueryGetApi, useHobitMutatePostApi } from '../../../hooks/hobitAdmin';
import SeniorFAQCreateForm from './SeniorFAQCreateForm';
import { selectAuth } from '../../../redux/authSlice';
import { CreateSeniorFAQRequest, CreateSeniorFAQResponse, GetAllSeniorFAQCategoryRequest, GetAllSeniorFAQCategoryResponse, CreateCheckSeniorFAQCategoryDuplicateRequest, CreateCheckSeniorFAQCategoryDuplicateResponse } from '../../../types/seniorfaq';
import { RootState } from '../../../redux/store';
import { useNavigate } from 'react-router-dom';

const SeniorFAQCreate: React.FC = () => {
  const navigate = useNavigate();
  const { user_id } = useSelector((state: RootState) => selectAuth(state));
  const [category, setCategory] = useState<GetAllSeniorFAQCategoryResponse['data']['categories']>([
    {
      maincategory_ko: '',
      maincategory_en: '',
      subcategories: [
        {
          subcategory_ko: '',
          subcategory_en: '',
          detailcategories: {
            detailcategory_ko: [],
            detailcategory_en: [],
          },
        },
      ],
    },
  ]);
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
        map: { latitude: '', longitude: '' },
      },
    ],
    answer_en: [
      {
        title: '',
        answer: '',
        url: '',
        map: { latitude: '', longitude: '' },
      },
    ],
    manager: '',
  });

  const GetAllSeniorFAQCategoryApi = useHobitQueryGetApi<GetAllSeniorFAQCategoryRequest, GetAllSeniorFAQCategoryResponse>('seniorfaqs/category');
  const CheckSeniorFAQCategoryDuplicateApi = useHobitMutatePostApi<CreateCheckSeniorFAQCategoryDuplicateRequest, CreateCheckSeniorFAQCategoryDuplicateResponse>('seniorfaqs/create/category/check');
  const SeniorFAQCreateApi = useHobitMutatePostApi<CreateSeniorFAQRequest, CreateSeniorFAQResponse>('seniorfaqs');

  // FAQ Category 데이터 가져오기
  useEffect(() => {
    const fetchSeniorFAQCategory = async () => {
      if (GetAllSeniorFAQCategoryApi.data?.payload?.statusCode === 200) {
        const data = GetAllSeniorFAQCategoryApi.data.payload.data.categories;
        setCategory(data);
      } else {
        alert('선배 FAQ 카테고리 데이터를 불러오는데 실패했습니다.');
        console.log('선배 FAQ 카테고리 데이터를 불러오는데 실패했습니다.', GetAllSeniorFAQCategoryApi.error);
      }
    };

    if (GetAllSeniorFAQCategoryApi.isSuccess) {
      fetchSeniorFAQCategory();
    }
  }, [GetAllSeniorFAQCategoryApi.isSuccess]);

  // 필터 인덱스 찾기 함수
  const findFilterIndex = (key: string, value: string) => {
    if (key === 'maincategory_ko') {
      const index = category.findIndex((item) => item[key] === value);
      setNewSeniorFAQ({
        ...newSeniorFAQ,
        maincategory_ko: value,
        maincategory_en: category[index].maincategory_en,
      });
    }
    
    if (key === 'maincategory_en') {
      const index = category.findIndex((item) => item[key] === value);
      setNewSeniorFAQ({
        ...newSeniorFAQ,
        maincategory_ko: category[index].maincategory_ko,
        maincategory_en: value,
      });
    }

    if (key === 'subcategory_ko') {
      const index = category.findIndex((item) => item.maincategory_ko === newSeniorFAQ.maincategory_ko);
      const subIndex = category[index].subcategories.findIndex((sub) => sub.subcategory_ko === value);
      setNewSeniorFAQ({
        ...newSeniorFAQ,
        subcategory_ko: value,
        subcategory_en: category[index].subcategories[subIndex].subcategory_en,
      });
    }

    if (key === 'subcategory_en') {
      const index = category.findIndex((item) => item.maincategory_en === newSeniorFAQ.maincategory_en);
      const subIndex = category[index].subcategories.findIndex((sub) => sub.subcategory_en === value);
      setNewSeniorFAQ({
        ...newSeniorFAQ,
        subcategory_ko: category[index].subcategories[subIndex].subcategory_ko,
        subcategory_en: value,
      });
    }

    if (key === 'detailcategory_ko') {
      const index = category.findIndex((item) => item.maincategory_ko === newSeniorFAQ.maincategory_ko);
      const subIndex = category[index].subcategories.findIndex((sub) => sub.subcategory_ko === newSeniorFAQ.subcategory_ko);
      const detailIndex = category[index].subcategories[subIndex].detailcategories.detailcategory_ko.findIndex((detail) => detail === value);
      setNewSeniorFAQ({
        ...newSeniorFAQ,
        detailcategory_ko: value,
        detailcategory_en: category[index].subcategories[subIndex].detailcategories.detailcategory_en[detailIndex],
      });
    }

    if (key === 'detailcategory_en') {
      const index = category.findIndex((item) => item.maincategory_en === newSeniorFAQ.maincategory_en);
      const subIndex = category[index].subcategories.findIndex((sub) => sub.subcategory_en === newSeniorFAQ.subcategory_en);
      const detailIndex = category[index].subcategories[subIndex].detailcategories.detailcategory_en.findIndex((detail) => detail === value);
      setNewSeniorFAQ({
        ...newSeniorFAQ,
        detailcategory_ko: category[index].subcategories[subIndex].detailcategories.detailcategory_en[detailIndex],
        detailcategory_en: value,
      });
    };
  }

  const handleAddAnswer = () => {
    setNewSeniorFAQ({
      ...newSeniorFAQ,
      answer_ko: [
        ...newSeniorFAQ.answer_ko,
        { title: '', answer: '', url: '', map: { latitude: '', longitude: '' } },
      ],
      answer_en: [
        ...newSeniorFAQ.answer_en,
        { title: '', answer: '', url: '', map: { latitude: '', longitude: '' } },
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
  
    const checkResponse = await CheckSeniorFAQCategoryDuplicateApi({
      body: {
        maincategory_ko,
        maincategory_en,
        subcategory_ko,
        subcategory_en,
        detailcategory_ko,
        detailcategory_en,
      },
    });
  
    if (checkResponse.payload?.statusCode === 200) {
      if (checkResponse.payload.data.isDuplicated) {
        alert(`다른 선배 FAQ의 카테고리와 같은 카테고리를 사용하려면 띄어쓰기와 한영 단어가 완벽하게 일치해야 합니다.
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
      alert('선배 FAQ 카테고리 중복 체크 중 오류가 발생했습니다.');
      console.log('선배 FAQ 카테고리 중복 체크 중 오류가 발생했습니다.', checkResponse.error);
      return;
    }
  
    const createResponse = await SeniorFAQCreateApi({
      body: newSeniorFAQ,
    });
  
    if (createResponse.payload?.statusCode === 201) {
      alert('선배 FAQ가 성공적으로 생성되었습니다!');
      navigate('/seniorfaqs');
    } else {
      alert('선배 FAQ 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.log('선배 FAQ 생성 중 오류가 발생했습니다.', createResponse.error);
    }
  }; 
    
  return (
    <SeniorFAQCreateForm
      newSeniorFAQ={newSeniorFAQ}
      setNewSeniorFAQ={setNewSeniorFAQ}
      category={category}
      findFilterIndex={findFilterIndex}
      handleAddAnswer={handleAddAnswer}
      handleSubmit={handleSubmit}
      handleDeleteAnswer={handleDeleteAnswer}
    />
  );
};

export default SeniorFAQCreate;
