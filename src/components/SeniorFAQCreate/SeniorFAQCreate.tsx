import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHobitQueryGetApi, useHobitMutatePostApi } from '../../hooks/hobitAdmin';
import SeniorFAQCreateForm from './SeniorFAQCreateForm';
import { selectAuth } from '../../redux/authSlice';
import { CreateSeniorFAQRequest, CreateSeniorFAQResponse, GetAllSeniorFAQCategoryRequest, GetAllSeniorFAQCategoryResponse, CheckSeniorFAQCategoryDuplicateRequest, CheckSeniorFAQCategoryDuplicateResponse } from '../../types/seniorfaq';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';

const SeniorFAQCreate: React.FC = () => {
  const navigate = useNavigate();
  const { user_id } = useSelector((state: RootState) => selectAuth(state));
  const [category, setcategory] = useState<GetAllSeniorFAQCategoryResponse['data']['categories']>([]);

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
  const[error, setError] = useState<string | null>(null);

  const GetAllSeniorFAQCategoryApi = useHobitQueryGetApi<GetAllSeniorFAQCategoryRequest, GetAllSeniorFAQCategoryResponse>('seniorfaqs/category');
  const CheckSeniorFAQCategoryDuplicateApi = useHobitMutatePostApi<CheckSeniorFAQCategoryDuplicateRequest, CheckSeniorFAQCategoryDuplicateResponse>('seniorfaqs/category/check');
  const SeniorFAQCreateApi = useHobitMutatePostApi<CreateSeniorFAQRequest, CreateSeniorFAQResponse>('seniorfaqs');

  // FAQ Category 데이터 가져오기
  useEffect(() => {
    const fetchSeniorFAQCategory = async () => {
      if (GetAllSeniorFAQCategoryApi.data?.payload?.statusCode === 200) {
        const data = GetAllSeniorFAQCategoryApi.data.payload.data.categories;
        setcategory(data);
      } else {
        setError('Senior FAQ 카테고리 데이터를 불러오는데 실패했습니다.');
      }
    };

    if (GetAllSeniorFAQCategoryApi.isSuccess) {
      fetchSeniorFAQCategory();
    }
  }, [GetAllSeniorFAQCategoryApi.isSuccess]);

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

    try {
      try {
        const response = await CheckSeniorFAQCategoryDuplicateApi({
          body: {
            maincategory_ko,
            maincategory_en,
            subcategory_ko,
            subcategory_en,
            detailcategory_ko,
            detailcategory_en,
          },
        });

        if (response.payload?.statusCode === 200) {
          if (response.payload.data.isDuplicated) {
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
        }
      } catch (error) {
        alert('선배 FAQ 카테고리 중복 확인 중 오류가 발생했습니다.');
        return;
      }

      const response = await SeniorFAQCreateApi({
        body: newSeniorFAQ,
      });
      console.log(newSeniorFAQ);

      if (response.payload?.statusCode === 201) {
        alert('선배 FAQ가 성공적으로 생성되었습니다!');
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
        navigate('/seniorfaqs');
      } else {
        alert('선배 FAQ 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      alert('선배 FAQ 생성에 실패했습니다.');
    }
  };

  return (
    <SeniorFAQCreateForm
      newSeniorFAQ={newSeniorFAQ}
      setNewSeniorFAQ={setNewSeniorFAQ}
      category={category}
      handleAddAnswer={handleAddAnswer}
      handleSubmit={handleSubmit}
      handleDeleteAnswer={handleDeleteAnswer}
    />
  );
};

export default SeniorFAQCreate;
