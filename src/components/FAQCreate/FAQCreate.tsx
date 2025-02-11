import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHobitQueryGetApi, useHobitMutatePostApi } from '../../hooks/hobitAdmin';
import FAQCreateForm from './FAQCreateForm';
import { selectAuth } from '../../redux/authSlice';
import { CreateFAQRequest, CreateFAQResponse, GetAllFAQCategoryRequest, GetAllFAQCategoryResponse, CheckFAQCategoryDuplicateRequest, CheckFAQCategoryDuplicateResponse } from '../../types/faq';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';

const FAQCreate: React.FC = () => {
  const navigate = useNavigate();
  const { user_id } = useSelector((state: RootState) => selectAuth(state));
  const [isCreating, setIsCreating] = useState(false);
  const [category, setCategory] = useState<GetAllFAQCategoryResponse['data']['categories']>([]);

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
  const CheckFAQCategoryDuplicateApi = useHobitMutatePostApi<CheckFAQCategoryDuplicateRequest, CheckFAQCategoryDuplicateResponse>('faqs/category/check');
  const FAQCreateApi = useHobitMutatePostApi<CreateFAQRequest, CreateFAQResponse>('faqs');

  // FAQ Category 데이터 가져오기
  useEffect(() => {
    const fetchFAQCategory = async () => {
      if (GetAllFAQCategoryApi.data?.payload?.statusCode === 200) {
        const data = GetAllFAQCategoryApi.data.payload.data.categories;
        setCategory(data);
      } else {
        setError('FAQ 카테고리 데이터를 불러오는데 실패했습니다.');
      }
    };

    if (GetAllFAQCategoryApi.isSuccess) {
      fetchFAQCategory();
    }
  }, [GetAllFAQCategoryApi.isSuccess]);

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
      try {
        const response = await CheckFAQCategoryDuplicateApi({
          body: {
            maincategory_ko,
            maincategory_en,
            subcategory_ko,
            subcategory_en,
          },
        });

        if (response.payload?.statusCode === 200) {
          if (response.payload.data.isDuplicated) {
            alert(`다른 FAQ의 카테고리와 같은 카테고리를 사용하려면 띄어쓰기와 한영 단어가 완벽하게 일치해야 합니다.
              \n 예시:
              \n 기존 카테고리: 공간예약 - Reserve a space 
              \n 현재 카테고리: 공간 예약 - Reserve a space 
              \n => 띄어쓰기로 인한 에러
              \n 기존 카테고리: 공간예약 - Reserve a space 
              \n 현재 카테고리: 공간예약 - Reserve a room
              \n => 번역으로 인한 에러`);
            setIsCreating(false);
            return;
          }
        }
      } catch (error) {
        alert('FAQ 카테고리 중복 확인 중 오류가 발생했습니다.');
        setIsCreating(false);
        return;
      }

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
      category={category}
      handleAddAnswer={handleAddAnswer}
      handleCreate={handleCreate}
      handleDeleteAnswer={handleDeleteAnswer}
      isCreating={isCreating}
    />
  );
};

export default FAQCreate;
