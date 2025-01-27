import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHobitQueryGetApi, useHobitMutatePostApi, useHobitMutatePutApi } from '../../hooks/hobitAdmin';
import FAQUpdateForm from './FAQUpdateForm';
import { selectAuth } from '../../redux/authSlice';
import { GetFAQRequest, GetFAQResponse, UpdateFAQRequest, UpdateFAQResponse, GetAllFAQCategoryRequest, GetAllFAQCategoryResponse, CheckFAQCategoryDuplicateRequest, CheckFAQCategoryDuplicateResponse } from '../../types/faq';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';

interface FAQUpdateProps {
  faq_id: string;
}

const FAQUpdate: React.FC<FAQUpdateProps> = ({ faq_id }) => {
  const navigate = useNavigate();
  const { user_id } = useSelector((state: RootState) => selectAuth(state));
  const [isUpdating, setIsUpdating] = useState(false);

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
  const[error, setError] = useState<string | null>(null);

  const FAQFetchApi = useHobitQueryGetApi<GetFAQRequest, GetFAQResponse>('faqs', { params: { faq_id } });
  const GetAllFAQCategoryApi = useHobitQueryGetApi<GetAllFAQCategoryRequest, GetAllFAQCategoryResponse>('faqs/category');
  const CheckFAQCategoryDuplicateApi = useHobitMutatePostApi<CheckFAQCategoryDuplicateRequest, CheckFAQCategoryDuplicateResponse>('faqs/category/check');
  const FAQUpdateApi = useHobitMutatePutApi<UpdateFAQRequest, UpdateFAQResponse>('faqs');

  useEffect(() => {
    const fetchFAQ = async () => {
      try {
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
        }
      } catch (error) {
        console.error(error);
        alert('FAQ 데이터를 가져오는 중 오류가 발생했습니다.');
      }
    };

    if (!FAQFetchApi.isLoading && FAQFetchApi.data) {
      fetchFAQ();
    }
  }, [faq_id, FAQFetchApi.data, FAQFetchApi.isLoading, user_id]);

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
        setupdatedFAQ({
          ...updatedFAQ,
          maincategory_ko: value,
          maincategory_en: category.maincategory_en[index],
        });
      } 
      if (key === 'maincategory_en') {
        setupdatedFAQ({
          ...updatedFAQ,
          maincategory_ko: category.maincategory_ko[index],
          maincategory_en: value,
        });
      }
      if (key === 'subcategory_ko') {
        setupdatedFAQ({
          ...updatedFAQ,
          subcategory_ko: value,
          subcategory_en: category.subcategory_en[index],
        });
      }
      if (key === 'subcategory_en') {
        setupdatedFAQ({
          ...updatedFAQ,
          subcategory_ko: category.subcategory_ko[index],
          subcategory_en: value,
        });
      }
    }
  
    // maincategory_ko 필터링
    useEffect(() => {
      updateFilteredCategory('maincategory_ko', updatedFAQ.maincategory_ko);
    }, [updatedFAQ.maincategory_ko, category.maincategory_ko]);
  
    // maincategory_en 필터링
    useEffect(() => {
      updateFilteredCategory('maincategory_en', updatedFAQ.maincategory_en);
    }, [updatedFAQ.maincategory_en, category.maincategory_en]);
  
    // subcategory_ko 필터링
    useEffect(() => {
      updateFilteredCategory('subcategory_ko', updatedFAQ.subcategory_ko);
    }, [updatedFAQ.subcategory_ko, category.subcategory_ko]);
  
    // subcategory_en 필터링
    useEffect(() => {
      updateFilteredCategory('subcategory_en', updatedFAQ.subcategory_en);
    }, [updatedFAQ.subcategory_en, category.subcategory_en]);
  
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
            alert('카테고리의 한글과 영어의 연결이 기존의 카테고리와 일부는 일치하고 일부는 다릅니다. 다시 확인해주세요.');
            setIsUpdating(false);
            return;
          }
        }
      } catch (error) {
        alert('FAQ 카테고리 중복 확인 중 오류가 발생했습니다.');
        setIsUpdating(false);
        return;
      }

      const response = await FAQUpdateApi({
        params: { faq_id },
        body: updatedFAQ,
      });

      if (response.payload?.statusCode === 200) {
        alert('FAQ가 성공적으로 수정되었습니다!');
        navigate('/faqs');
      } else {
        alert('FAQ 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error(error);
      alert('FAQ 수정에 실패했습니다.');
    } finally {
      setIsUpdating(false);
    }     
  };

  return (
    <FAQUpdateForm
      updatedFAQ={updatedFAQ}
      setupdatedFAQ={setupdatedFAQ}
      filteredCategory={filteredCategory}
      findFilterIndex={findFilterIndex}
      handleAddAnswer={handleAddAnswer}
      handleDeleteAnswer={handleDeleteAnswer}
      handleUpdate={handleUpdate}
      isUpdating={isUpdating}
    />
  );
};

export default FAQUpdate;
