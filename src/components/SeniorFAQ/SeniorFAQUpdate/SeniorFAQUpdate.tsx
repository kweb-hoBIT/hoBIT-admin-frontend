import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHobitQueryGetApi, useHobitMutatePostApi, useHobitMutatePutApi } from '../../../hooks/hobitAdmin';
import FAQUpdateForm from './SeniorFAQUpdateForm';
import SeniorFAQCategoryConflict from '../SeniorFAQCategoryConflict';
import { selectAuth } from '../../../redux/authSlice';
import { GetSeniorFAQRequest, GetSeniorFAQResponse, UpdateSeniorFAQRequest, UpdateSeniorFAQResponse, GetAllSeniorFAQCategoryRequest, GetAllSeniorFAQCategoryResponse, UpdateCheckSeniorFAQCategoryConflictRequest, CheckSeniorFAQCategoryConflictResponse } from '../../../types/seniorfaq';
import { RootState } from '../../../redux/store';
import { useNavigate } from 'react-router-dom';

interface SeniorFAQUpdateProps {
  senior_faq_id: string;
}

const SeniorFAQUpdate: React.FC<SeniorFAQUpdateProps> = ({ senior_faq_id }) => {
  const navigate = useNavigate();
  const { user_id } = useSelector((state: RootState) => selectAuth(state));
  const [category, setCategory] = useState<GetAllSeniorFAQCategoryResponse['data']['categories']>([
    {
      maincategory_ko: '',
      maincategory_en: '',
      category_order: 0,
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

  const [showCategoryConflict, setShowCategoryConflict] = useState(false);
  const [conflictedData, setConflictedData] = useState<CheckSeniorFAQCategoryConflictResponse['data']['conflictedData']>([
    {
      field: '',
      input: {
        ko: '',
        en: ''
      },
      conflict: [
        {
          ko: '',
          en: ''
        }
      ]
    }
  ]);

  
  const seniorFAQFetchApi = useHobitQueryGetApi<GetSeniorFAQRequest, GetSeniorFAQResponse>('seniorfaqs', {
    params: { senior_faq_id }
  });
  
  const GetAllSeniorFAQCategoryApi = useHobitQueryGetApi<GetAllSeniorFAQCategoryRequest, GetAllSeniorFAQCategoryResponse>('seniorfaqs/category');
  const CheckSeniorFAQCategoryConflictApi = useHobitMutatePostApi<UpdateCheckSeniorFAQCategoryConflictRequest, CheckSeniorFAQCategoryConflictResponse>('seniorfaqs/update/category/conflict');
  const seniorFAQUpdateApi = useHobitMutatePutApi<UpdateSeniorFAQRequest, UpdateSeniorFAQResponse>('seniorfaqs');

  useEffect(() => {
    const fetchSeniorFAQ = async () => {
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
        console.error('Senior FAQ 데이터를 불러오는 데 실패했습니다.', seniorFAQFetchApi.error);
      }
    };
  
    if (seniorFAQFetchApi.isSuccess && seniorFAQFetchApi.data) {
      fetchSeniorFAQ();
    }
  }, [senior_faq_id, seniorFAQFetchApi.data, seniorFAQFetchApi.isSuccess, user_id]);

  useEffect(() => {
    const fetchSeniorFAQCategory = async () => {
      if (GetAllSeniorFAQCategoryApi.data?.payload?.statusCode === 200) {
        const data = GetAllSeniorFAQCategoryApi.data.payload.data.categories;
        setCategory(data);
      } else {
        alert('Senior FAQ 카테고리 데이터를 불러오는데 실패했습니다.');
        console.error('Senior FAQ 카테고리 데이터를 불러오는데 실패했습니다.', GetAllSeniorFAQCategoryApi.error);
      }
    };

    if (GetAllSeniorFAQCategoryApi.isSuccess && GetAllSeniorFAQCategoryApi.data) {
      fetchSeniorFAQCategory();
    }
  }, [GetAllSeniorFAQCategoryApi.isSuccess, GetAllSeniorFAQCategoryApi.data]);

  // 필터 인덱스 찾기 함수
  const findFilterIndex = (key: string, value: string) => {
    if (key === 'maincategory_ko') {
      const index = category.findIndex((item) => item[key] === value);
      setUpdatedSeniorFAQ({
        ...updatedSeniorFAQ,
        maincategory_ko: value,
        maincategory_en: category[index].maincategory_en,
      });
    }
    
    if (key === 'maincategory_en') {
      const index = category.findIndex((item) => item[key] === value);
      setUpdatedSeniorFAQ({
        ...updatedSeniorFAQ,
        maincategory_ko: category[index].maincategory_ko,
        maincategory_en: value,
      });
      
    }
    if (key === 'subcategory_ko') {
      const index = category.findIndex((item) => item.subcategories.some((sub) => sub.subcategory_ko === value));
      const subIndex = category[index].subcategories.findIndex((sub) => sub.subcategory_ko === value);
      setUpdatedSeniorFAQ({
        ...updatedSeniorFAQ,
        subcategory_ko: value,
        subcategory_en: category[index].subcategories[subIndex].subcategory_en,
      });
    }
    
    if (key === 'subcategory_en') {
      const index = category.findIndex((item) => item.subcategories.some((sub) => sub.subcategory_en === value));
      const subIndex = category[index].subcategories.findIndex((sub) => sub.subcategory_en === value);
      setUpdatedSeniorFAQ({
        ...updatedSeniorFAQ,
        subcategory_ko: category[index].subcategories[subIndex].subcategory_ko,
        subcategory_en: value,
      });
    }
    
    if (key === 'detailcategory_ko') {
      const index = category.findIndex((item) => item.subcategories.some((sub) => sub.detailcategories.detailcategory_ko.includes(value)));
      const subIndex = category[index].subcategories.findIndex((sub) => sub.detailcategories.detailcategory_ko.includes(value));
      const detailIndex = category[index].subcategories[subIndex].detailcategories.detailcategory_ko.findIndex((detail) => detail === value);
      setUpdatedSeniorFAQ({
        ...updatedSeniorFAQ,
        detailcategory_ko: value,
        detailcategory_en: category[index].subcategories[subIndex].detailcategories.detailcategory_en[detailIndex],
      });
    }
    
    if (key === 'detailcategory_en') {
      const index = category.findIndex((item) => item.subcategories.some((sub) => sub.detailcategories.detailcategory_en.includes(value)));
      const subIndex = category[index].subcategories.findIndex((sub) => sub.detailcategories.detailcategory_en.includes(value));
      const detailIndex = category[index].subcategories[subIndex].detailcategories.detailcategory_en.findIndex((detail) => detail === value);
      setUpdatedSeniorFAQ({
        ...updatedSeniorFAQ,
        detailcategory_ko: category[index].subcategories[subIndex].detailcategories.detailcategory_ko[detailIndex],
        detailcategory_en: value,
      });
    }
  };

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

  const handleCategoryConflictClose = () => {
    setShowCategoryConflict(false);
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

    const checkResponse = await CheckSeniorFAQCategoryConflictApi({
      body: {
        senior_faq_id: Number(senior_faq_id),
        maincategory_ko,
        maincategory_en,
        subcategory_ko,
        subcategory_en,
        detailcategory_ko,
        detailcategory_en,
      },
    });

    if (checkResponse.payload?.statusCode === 200) {
      if (checkResponse.payload.data.isConflict) {
        setConflictedData(checkResponse.payload.data.conflictedData);
        setShowCategoryConflict(true);
        return;
      }
    } else {
      alert('선배 FAQ 카테고리 중복 확인 중 오류가 발생했습니다.');
      console.error('선배 FAQ 카테고리 중복 확인 중 오류가 발생했습니다.', checkResponse.error);
      return;
    }
  

    const updateResponse = await seniorFAQUpdateApi({
      params: { senior_faq_id },
      body: updatedSeniorFAQ,
    });

    if (updateResponse.payload?.statusCode === 200) {
      alert('선배 FAQ가 성공적으로 수정되었습니다!');
      navigate('/seniorfaqs');
    } else {
      alert('선배 FAQ 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error('선배 FAQ 수정 중 오류가 발생했습니다.', updateResponse.error);
    }
  };

  if (seniorFAQFetchApi.isLoading || GetAllSeniorFAQCategoryApi.isLoading) {
    return <div></div>;
  }

  return (
    <>
      {showCategoryConflict && (
        <SeniorFAQCategoryConflict 
          conflictedData={conflictedData}
          onHandleCategoryConflictClose={handleCategoryConflictClose} 
        />
      )}
      <FAQUpdateForm
        updatedSeniorFAQ={updatedSeniorFAQ}
        setupdatedSeniorFAQ={setUpdatedSeniorFAQ}
        category={category}
        findFilterIndex={findFilterIndex}
        handleAddAnswer={handleAddAnswer}
        handleDeleteAnswer={handleDeleteAnswer}
        handleUpdate={handleUpdate}
      />
    </>
  );
};

export default SeniorFAQUpdate;
