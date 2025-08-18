import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHobitQueryGetApi, useHobitMutatePostApi, useHobitMutatePutApi } from '../../../hooks/hobitAdmin';
import FAQUpdateForm from './FAQUpdateForm';
import { selectAuth } from '../../../redux/authSlice';
import { GetFAQRequest, GetFAQResponse, UpdateFAQRequest, UpdateFAQResponse, GetAllFAQCategoryRequest, GetAllFAQCategoryResponse, UpdateCheckFAQCategoryConflictRequest, CheckFAQCategoryConflictResponse, GetAllFAQResponse, GetAllFAQRequest } from '../../../types/faq';
import { RootState } from '../../../redux/store';
import { useNavigate } from 'react-router-dom';
import FAQCategoryConflict from "../FAQCategoryConflict"

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
    category_order: 0,
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

  const [showCategoryConflict, setShowCategoryConflict] = useState(false);
  const [emailList, setEmailList] = useState<string[]>([]);
  const [phoneList, setPhoneList] = useState<string[]>([]);
  const [managerList, setManagerList] = useState<string[]>([]);


  const [conflictedData, setConflictedData] = useState<CheckFAQCategoryConflictResponse['data']['conflictedData']>([
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

  const FAQFetchApi = useHobitQueryGetApi<GetFAQRequest, GetFAQResponse>('faqs', { params: { faq_id } });
  const GetAllFAQCategoryApi = useHobitQueryGetApi<GetAllFAQCategoryRequest, GetAllFAQCategoryResponse>('faqs/category');
  const CheckFAQCategoryConflictApi = useHobitMutatePostApi<UpdateCheckFAQCategoryConflictRequest, CheckFAQCategoryConflictResponse>('faqs/update/category/conflict');
  const FAQUpdateApi = useHobitMutatePutApi<UpdateFAQRequest, UpdateFAQResponse>('faqs');
  const GetAllFAQsApi = useHobitQueryGetApi<GetAllFAQRequest, GetAllFAQResponse>('faqs');

  const extractFAQMeta = (
    faqs: GetAllFAQResponse['data']['faqs']
  ): { emails: string[]; phones: string[]; managers: string[] } => {
    const emailSet = new Set<string>();
    const phoneSet = new Set<string>();
    const managerSet = new Set<string>();

    faqs.forEach((faq) => {
      faq.answer_ko.forEach((ans) => {
        ans.email?.split(',').map((e) => e.trim()).forEach((e) => {if(e) emailSet.add(e)});
        ans.phone?.split(',').map((p) => p.trim()).forEach((p) => {if(p) phoneSet.add(p)});
      });

      if (faq.manager) {
        managerSet.add(faq.manager.trim());
      }
    });

    return {
      emails: Array.from(emailSet),
      phones: Array.from(phoneSet),
      managers: Array.from(managerSet),
    };
  };


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

  // FAQ 데이터에서 이메일, 전화번호, 관리자 정보 추출
  useEffect(() => {
    if (GetAllFAQsApi.isSuccess && GetAllFAQsApi.data?.payload?.statusCode === 200) {
      const faqs = GetAllFAQsApi.data.payload.data.faqs;
      const { emails, phones, managers } = extractFAQMeta(faqs);
      setEmailList(emails);
      setPhoneList(phones);
      setManagerList(managers);
    }
  }, [GetAllFAQsApi.isSuccess]);


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

  
  const handleCategoryConflictClose = () => {
    setShowCategoryConflict(false);
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
      
    const checkResponse = await CheckFAQCategoryConflictApi({
      body: {
        faq_id : Number(faq_id),
        maincategory_ko,
        maincategory_en,
        subcategory_ko,
        subcategory_en,
      },
    });

    if (checkResponse.payload?.statusCode === 200) {
      if (checkResponse.payload.data.isConflict) {
        setConflictedData(checkResponse.payload.data.conflictedData);
        setShowCategoryConflict(true);
        setIsUpdating(false);
        return;
      }
    } else {
      alert('FAQ 카테고리 중복 확인 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsUpdating(false);
      console.log('FAQ 카테고리 중복 확인 중 오류가 발생했습니다.', checkResponse.error);
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
    <>
      {showCategoryConflict && (
        <FAQCategoryConflict 
          conflictedData={conflictedData}
          onHandleCategoryConflictClose={handleCategoryConflictClose} 
        />
      )}
      <FAQUpdateForm
        updatedFAQ={updatedFAQ}
        setupdatedFAQ={setupdatedFAQ}
        category={category}
        findFilterIndex={findFilterIndex}
        handleAddAnswer={handleAddAnswer}
        handleDeleteAnswer={handleDeleteAnswer}
        handleUpdate={handleUpdate}
        isUpdating={isUpdating}
        emailList={emailList}
        phoneList={phoneList}
        managerList={managerList}
      />
    </>
  );
};

export default FAQUpdate;
