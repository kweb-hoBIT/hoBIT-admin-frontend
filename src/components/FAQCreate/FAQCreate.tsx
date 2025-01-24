import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHobitQueryGetApi, useHobitMutatePostApi } from '../../hooks/hobitAdmin';
import FAQCreateForm from './FAQCreateForm';
import { selectAuth } from '../../redux/authSlice';
import { CreateFAQRequest, CreateFAQResponse, GetAllFAQCategoryRequest, GetAllFAQCategoryResponse } from '../../types/faq';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';

const FAQCreate: React.FC = () => {
  const navigate = useNavigate();
  const { user_id } = useSelector((state: RootState) => selectAuth(state));
  const [isCreating, setIsCreating] = useState(false);
  const [category, setCategory] = useState<GetAllFAQCategoryResponse['data']['categories']>({
    maincategory_ko: [],
    maincategory_en: [],
    subcategory_ko: [],
    subcategory_en: [],
  });

  const [filteredCategory, setFilteredCategory] = useState<GetAllFAQCategoryResponse['data']['categories']>({
    maincategory_ko: [],
    maincategory_en: [],
    subcategory_ko: [],
    subcategory_en: [],
  });

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
  const [error, setError] = useState<string | null>(null);

  const GetAllFAQCategoryApi = useHobitQueryGetApi<GetAllFAQCategoryRequest, GetAllFAQCategoryResponse>('faqs/category');
  const FAQCreateApi = useHobitMutatePostApi<CreateFAQRequest, CreateFAQResponse>('faqs');

  // FAQ Category 데이터 가져오기
  useEffect(() => {
    const fetchFAQCategory = async () => {
      if (GetAllFAQCategoryApi.data?.payload?.statusCode === 200) {
        const data = GetAllFAQCategoryApi.data.payload.data.categories;
        setCategory(data);
        setFilteredCategory(data); // 초기화
      } else {
        setError('FAQ 카테고리 데이터를 불러오는데 실패했습니다.');
      }
    };

    if (GetAllFAQCategoryApi.isSuccess) {
      fetchFAQCategory();
    }
  }, [GetAllFAQCategoryApi.isSuccess]);

  // 필터 업데이트 함수
  const updateFilteredCategory = (key: keyof GetAllFAQCategoryResponse['data']['categories'], value: string) => {
    if (value) {
      const filtered = category[key].filter((item) => item.includes(value));
      setFilteredCategory((prev) => ({ ...prev, [key]: filtered }));
    } else {
      setFilteredCategory((prev) => ({ ...prev, [key]: category[key] }));
    }
  };

  // 필터 인덱스 찾기 함수
  const findFilterIndex = (key: keyof GetAllFAQCategoryResponse['data']['categories'], value: string) => {
    const index = category[key].findIndex((item) => item === value);
    if (key === 'maincategory_ko') {
      setNewFAQ({
        ...newFAQ,
        maincategory_ko: value,
        maincategory_en: category.maincategory_en[index],
      });
    }
    if (key === 'maincategory_en') {
      setNewFAQ({
        ...newFAQ,
        maincategory_ko: category.maincategory_ko[index],
        maincategory_en: value
      });
    }
    if (key === 'subcategory_ko') {
      setNewFAQ({
        ...newFAQ,
        subcategory_ko: value,
        subcategory_en: category.subcategory_en[index],
      });
    }
    if (key === 'subcategory_en') {
      setNewFAQ({
        ...newFAQ,
        subcategory_ko: category.subcategory_ko[index],
        subcategory_en: value,
      });
    }
  }

  // maincategory_ko 필터링
  useEffect(() => {
    updateFilteredCategory('maincategory_ko', newFAQ.maincategory_ko);
  }, [newFAQ.maincategory_ko, category.maincategory_ko]);

  // maincategory_en 필터링
  useEffect(() => {
    updateFilteredCategory('maincategory_en', newFAQ.maincategory_en);
  }, [newFAQ.maincategory_en, category.maincategory_en]);

  // subcategory_ko 필터링
  useEffect(() => {
    updateFilteredCategory('subcategory_ko', newFAQ.subcategory_ko);
  }, [newFAQ.subcategory_ko, category.subcategory_ko]);

  // subcategory_en 필터링
  useEffect(() => {
    updateFilteredCategory('subcategory_en', newFAQ.subcategory_en);
  }, [newFAQ.subcategory_en, category.subcategory_en]);

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

    try {
      const response = await FAQCreateApi({
        body: newFAQ,
      });

      if (response.payload?.statusCode === 201) {
        alert('FAQ가 성공적으로 생성되었습니다!');
        setNewFAQ({
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
      alert('FAQ 생성에 실패했습니다.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <FAQCreateForm
      newFAQ={newFAQ}
      setNewFAQ={setNewFAQ}
      filteredCategory={filteredCategory}
      findFilterIndex={findFilterIndex}
      handleAddAnswer={handleAddAnswer}
      handleCreate={handleCreate}
      handleDeleteAnswer={handleDeleteAnswer}
      isCreating={isCreating}
    />
  );
};

export default FAQCreate;
