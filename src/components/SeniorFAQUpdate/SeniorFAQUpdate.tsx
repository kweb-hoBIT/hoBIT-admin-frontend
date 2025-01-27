import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHobitQueryGetApi, useHobitMutatePostApi, useHobitMutatePutApi } from '../../hooks/hobitAdmin';
import FAQUpdateForm from './SeniorFAQUpdateForm';
import { selectAuth } from '../../redux/authSlice';
import { GetSeniorFAQRequest, GetSeniorFAQResponse, UpdateSeniorFAQRequest, UpdateSeniorFAQResponse, GetAllSeniorFAQCategoryRequest, GetAllSeniorFAQCategoryResponse, CheckSeniorFAQCategoryDuplicateRequest, CheckSeniorFAQCategoryDuplicateResponse } from '../../types/seniorfaq';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';

interface SeniorFAQUpdateProps {
  senior_faq_id: string;
}

const SeniorFAQUpdate: React.FC<SeniorFAQUpdateProps> = ({ senior_faq_id }) => {
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
  
  const seniorFAQFetchApi = useHobitQueryGetApi<GetSeniorFAQRequest, GetSeniorFAQResponse>('seniorfaqs', {
    params: { senior_faq_id }
  });
  
  const GetAllSeniorFAQCategoryApi = useHobitQueryGetApi<GetAllSeniorFAQCategoryRequest, GetAllSeniorFAQCategoryResponse>('seniorfaqs/category');
  const CheckSeniorFAQCategoryDuplicateApi = useHobitMutatePostApi<CheckSeniorFAQCategoryDuplicateRequest, CheckSeniorFAQCategoryDuplicateResponse>('seniorfaqs/category/check');
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
              answer_ko: seniorFAQ.answer_ko || [{ answer: '', url: '', map: {latitude: '', longitude: ''} }],
              answer_en: seniorFAQ.answer_en || [{ answer: '', url: '', map: {latitude: '', longitude: ''} }],
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

  useEffect(() => {
    const fetchSeniorFAQCategory = async () => {
      if (GetAllSeniorFAQCategoryApi.data?.payload?.statusCode === 200) {
        const data = GetAllSeniorFAQCategoryApi.data.payload.data.categories;
        setcategory(data);
      } else {
        alert('Senior FAQ 카테고리 데이터를 불러오는데 실패했습니다.');
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
      setUpdatedSeniorFAQ({
        ...updatedSeniorFAQ,
        maincategory_ko: value,
        maincategory_en: category.maincategory_en[index],
      });
    } 
    if (key === 'maincategory_en') {
      setUpdatedSeniorFAQ({
        ...updatedSeniorFAQ,
        maincategory_ko: category.maincategory_ko[index],
        maincategory_en: value,
      });
    }
    if (key === 'subcategory_ko') {
      setUpdatedSeniorFAQ({
        ...updatedSeniorFAQ,
        subcategory_ko: value,
        subcategory_en: category.subcategory_en[index],
      });
    }
    if (key === 'subcategory_en') {
      setUpdatedSeniorFAQ({
        ...updatedSeniorFAQ,
        subcategory_ko: category.subcategory_ko[index],
        subcategory_en: value,
      });
    }
    if (key === 'detailcategory_ko') {
      setUpdatedSeniorFAQ({
        ...updatedSeniorFAQ,
        detailcategory_ko: value,
        detailcategory_en: category.detailcategory_en[index],
      });
    }
    if (key === 'detailcategory_en') {
      setUpdatedSeniorFAQ({
        ...updatedSeniorFAQ,
        detailcategory_ko: category.detailcategory_ko[index],
        detailcategory_en: value,
      });
    }
  }

  // maincategory_ko 필터링
  useEffect(() => {
    updateFilteredCategory('maincategory_ko', updatedSeniorFAQ.maincategory_ko);
  }, [updatedSeniorFAQ.maincategory_ko, category.maincategory_ko]);

  // maincategory_en 필터링
  useEffect(() => {
    updateFilteredCategory('maincategory_en', updatedSeniorFAQ.maincategory_en);
  }, [updatedSeniorFAQ.maincategory_en, category.maincategory_en]);

  // subcategory_ko 필터링
  useEffect(() => {
    updateFilteredCategory('subcategory_ko', updatedSeniorFAQ.subcategory_ko);
  }, [updatedSeniorFAQ.subcategory_ko, category.subcategory_ko]);

  // subcategory_en 필터링
  useEffect(() => {
    updateFilteredCategory('subcategory_en', updatedSeniorFAQ.subcategory_en);
  }, [updatedSeniorFAQ.subcategory_en, category.subcategory_en]);

  // detailcategory_ko 필터링
  useEffect(() => {
    updateFilteredCategory('detailcategory_ko', updatedSeniorFAQ.detailcategory_ko);
  }, [updatedSeniorFAQ.detailcategory_ko, category.detailcategory_ko]);

  // detailcategory_en 필터링
  useEffect(() => {
    updateFilteredCategory('detailcategory_en', updatedSeniorFAQ.detailcategory_en);
  }, [updatedSeniorFAQ.detailcategory_en, category.detailcategory_en]);
  

  const handleAddAnswer = () => {
    setUpdatedSeniorFAQ({
      ...updatedSeniorFAQ,
      answer_ko: [
        ...updatedSeniorFAQ.answer_ko,
        { title: '', answer: '', url: '', map: { latitude: '', longitude: '' } },
      ],
      answer_en: [
        ...updatedSeniorFAQ.answer_en,
        { title: '', answer: '', url: '', map: { latitude: '', longitude: '' } },
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
            alert('카테고리의 한글과 영어의 연결이 기존의 카테고리와 일부는 일치하고 일부는 다릅니다. 다시 확인해주세요.');
            return;
          }
        }
      } catch (error) {
        alert('FAQ 카테고리 중복 확인 중 오류가 발생했습니다.');
        return;
      }
      
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

  return (
    <FAQUpdateForm
      updatedSeniorFAQ={updatedSeniorFAQ}
      setupdatedSeniorFAQ={setUpdatedSeniorFAQ}
      filteredCategory={filteredCategory}
      findFilterIndex={findFilterIndex}
      handleAddAnswer={handleAddAnswer}
      handleDeleteAnswer={handleDeleteAnswer}
      handleUpdate={handleUpdate}
    />
  );
};

export default SeniorFAQUpdate;
