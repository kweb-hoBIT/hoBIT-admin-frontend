import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHobitQueryGetApi, useHobitMutatePostApi } from '../../../hooks/hobitAdmin';
import FAQCreateForm from './FAQCreateForm';
import FAQCategoryConflict from '../FAQCategoryConflict';
import { selectAuth } from '../../../redux/authSlice';
import { CreateFAQRequest, CreateFAQResponse, GetAllFAQCategoryRequest, GetAllFAQCategoryResponse, CreateCheckFAQCategoryConflictRequest, CheckFAQCategoryConflictResponse, GetAllFAQResponse, GetAllFAQRequest } from '../../../types/faq';
import { RootState } from '../../../redux/store';
import { useNavigate } from 'react-router-dom';

const FAQCreate: React.FC = () => {
  const navigate = useNavigate();
  const { user_id } = useSelector((state: RootState) => selectAuth(state));
  const [isCreating, setIsCreating] = useState(false);
  const [category, setCategory] = useState<GetAllFAQCategoryResponse['data']['categories']>([{
    maincategory_ko: '',
    maincategory_en: '',
    category_order: 0,
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


  const [emailList, setEmailList] = useState<string[]>([]);
  const [phoneList, setPhoneList] = useState<string[]>([]);
  const [managerList, setManagerList] = useState<string[]>([]);

  const [showCategoryConflict, setShowCategoryConflict] = useState(false);
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

  const GetAllFAQCategoryApi = useHobitQueryGetApi<GetAllFAQCategoryRequest, GetAllFAQCategoryResponse>('faqs/category');
  const CheckFAQCategoryConflictApi = useHobitMutatePostApi<CreateCheckFAQCategoryConflictRequest, CheckFAQCategoryConflictResponse>('faqs/create/category/conflict');
  const FAQCreateApi = useHobitMutatePostApi<CreateFAQRequest, CreateFAQResponse>('faqs');
  const GetAllFAQsApi = useHobitQueryGetApi<GetAllFAQRequest, GetAllFAQResponse>('faqs');

  const extractFAQMeta = (
    faqs: GetAllFAQResponse['data']['faqs']
  ): { emails: string[]; phones: string[]; managers: string[] } => {
    const emailSet = new Set<string>();
    const phoneSet = new Set<string>();
    const managerSet = new Set<string>();

    faqs.forEach((faq) => {
      faq.answer_ko.forEach((ans) => {
        ans.email?.split(',').map((e) => e.trim()).forEach((e) => emailSet.add(e));
        ans.phone?.split(',').map((p) => p.trim()).forEach((p) => phoneSet.add(p));
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

  useEffect(() => {
    if (GetAllFAQsApi.isSuccess && GetAllFAQsApi.data?.payload?.statusCode === 200) {
      const faqs = GetAllFAQsApi.data.payload.data.faqs;
      const { emails, phones, managers } = extractFAQMeta(faqs);
      setEmailList(emails);
      setPhoneList(phones);
      setManagerList(managers);
    }
  }, [GetAllFAQsApi.isSuccess]);
    


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

  const handleCategoryConflictClose = () => {
    setShowCategoryConflict(false);
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


      const checkResponse = await CheckFAQCategoryConflictApi({
        body: {
          maincategory_ko,
          maincategory_en,
          subcategory_ko,
          subcategory_en,
        },
      });
    
      if (checkResponse.payload?.statusCode === 200 ) {
        if (checkResponse.payload.data.isConflict) {
          setConflictedData(checkResponse.payload.data.conflictedData);
          setShowCategoryConflict(true);
          setIsCreating(false);
          return;
        }
      } else {
        alert('FAQ 카테고리 중복 체크 중 오류가 발생했습니다.');
        setIsCreating(false);
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
    <>
      {showCategoryConflict && (
        <FAQCategoryConflict
          conflictedData={conflictedData}
          onHandleCategoryConflictClose={handleCategoryConflictClose} 
        />
      )}
      <FAQCreateForm
        newFAQ={newFAQ}
        setNewFAQ={setNewFAQ}
        category={category}
        findFilterIndex={findFilterIndex}
        handleAddAnswer={handleAddAnswer}
        handleCreate={handleCreate}
        handleDeleteAnswer={handleDeleteAnswer}
        isCreating={isCreating}
        emailList={emailList}
        phoneList={phoneList}
        managerList={managerList}
      />
    </>
  );
};

export default FAQCreate;
