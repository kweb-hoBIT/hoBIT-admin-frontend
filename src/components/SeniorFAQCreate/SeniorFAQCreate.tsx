import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHobitQueryGetApi, useHobitMutatePostApi } from '../../hooks/hobitAdmin';
import SeniorFAQCreateForm from './SeniorFAQCreateForm';
import { selectAuth } from '../../redux/authSlice';
import { CreateSeniorFAQRequest, CreateSeniorFAQResponse, GetAllSeniorFAQCategoryRequest, GetAllSeniorFAQCategoryResponse } from '../../types/seniorfaq';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';

const SeniorFAQCreate: React.FC = () => {
  const navigate = useNavigate();
  const { user_id } = useSelector((state: RootState) => selectAuth(state));
  const [category, setcategory] = useState<GetAllSeniorFAQCategoryResponse['data']['categories']>({
    maincategory_ko: [],
    maincategory_en: [],
    subcategory_ko: [],
    subcategory_en: [],
    detailcategory_ko: [],
    detailcategory_en: [],
  })

  const [filteredCategory, setFilteredCategory] = useState<GetAllSeniorFAQCategoryResponse['data']['categories']>({
    maincategory_ko: [],
    maincategory_en: [],
    subcategory_ko: [],
    subcategory_en: [],
    detailcategory_ko: [],
    detailcategory_en: [],
  });

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

  // 필터 업데이트 함수
  const updateFilteredCategory = (key: keyof GetAllSeniorFAQCategoryResponse['data']['categories'], value: string) => {
    if (value) {
      const filtered = category[key].filter((item) => item.includes(value));
      setFilteredCategory((prev) => ({ ...prev, [key]: filtered }));
    } else {
      setFilteredCategory((prev) => ({ ...prev, [key]: category[key] }));
    }
  };

  // 필터 인덱스 찾기 함수
  const findFilterIndex = (key: keyof GetAllSeniorFAQCategoryResponse['data']['categories'], value: string) => {
    const index = category[key].findIndex((item) => item === value);
    if (key === 'maincategory_ko') {
      setNewSeniorFAQ({
        ...newSeniorFAQ,
        maincategory_ko: value,
        maincategory_en: category.maincategory_en[index],
      });
    } 
    if (key === 'maincategory_en') {
      setNewSeniorFAQ({
        ...newSeniorFAQ,
        maincategory_ko: category.maincategory_ko[index],
        maincategory_en: value,
      });
    }
    if (key === 'subcategory_ko') {
      setNewSeniorFAQ({
        ...newSeniorFAQ,
        subcategory_ko: value,
        subcategory_en: category.subcategory_en[index],
      });
    }
    if (key === 'subcategory_en') {
      setNewSeniorFAQ({
        ...newSeniorFAQ,
        subcategory_ko: category.subcategory_ko[index],
        subcategory_en: value,
      });
    }
    if (key === 'detailcategory_ko') {
      setNewSeniorFAQ({
        ...newSeniorFAQ,
        detailcategory_ko: value,
        detailcategory_en: category.detailcategory_en[index],
      });
    }
    if (key === 'detailcategory_en') {
      setNewSeniorFAQ({
        ...newSeniorFAQ,
        detailcategory_ko: category.detailcategory_ko[index],
        detailcategory_en: value,
      });
    }
  }

  // maincategory_ko 필터링
  useEffect(() => {
    updateFilteredCategory('maincategory_ko', newSeniorFAQ.maincategory_ko);
  }, [newSeniorFAQ.maincategory_ko, category.maincategory_ko]);

  // maincategory_en 필터링
  useEffect(() => {
    updateFilteredCategory('maincategory_en', newSeniorFAQ.maincategory_en);
  }, [newSeniorFAQ.maincategory_en, category.maincategory_en]);

  // subcategory_ko 필터링
  useEffect(() => {
    updateFilteredCategory('subcategory_ko', newSeniorFAQ.subcategory_ko);
  }, [newSeniorFAQ.subcategory_ko, category.subcategory_ko]);

  // subcategory_en 필터링
  useEffect(() => {
    updateFilteredCategory('subcategory_en', newSeniorFAQ.subcategory_en);
  }, [newSeniorFAQ.subcategory_en, category.subcategory_en]);

  // detailcategory_ko 필터링
  useEffect(() => {
    updateFilteredCategory('detailcategory_ko', newSeniorFAQ.detailcategory_ko);
  }, [newSeniorFAQ.detailcategory_ko, category.detailcategory_ko]);

  // detailcategory_en 필터링
  useEffect(() => {
    updateFilteredCategory('detailcategory_en', newSeniorFAQ.detailcategory_en);
  }, [newSeniorFAQ.detailcategory_en, category.detailcategory_en]);
  
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
      filteredCategory={filteredCategory}
      findFilterIndex={findFilterIndex}
      handleAddAnswer={handleAddAnswer}
      handleSubmit={handleSubmit}
      handleDeleteAnswer={handleDeleteAnswer}
    />
  );
};

export default SeniorFAQCreate;
