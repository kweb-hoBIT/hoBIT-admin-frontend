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
  const [category, setcategory] = useState<GetAllFAQCategoryResponse['data']['categories']>({
    maincategory_ko: [],
    maincategory_en: [],
    subcategory_ko: [],
    subcategory_en: [],
  })

  const [filteredMaincategoryKo, setFilteredMaincategoryKo] = useState<GetAllFAQCategoryResponse['data']['categories']['maincategory_ko']>([]);
  const [filteredMaincategoryEn, setFilteredMaincategoryEn] = useState<GetAllFAQCategoryResponse['data']['categories']['maincategory_en']>([]);
  const [filteredSubcategoryKo, setFilteredSubcategoryKo] = useState<GetAllFAQCategoryResponse['data']['categories']['subcategory_ko']>([]);
  const [filteredSubcategoryEn, setFilteredSubcategoryEn] = useState<GetAllFAQCategoryResponse['data']['categories']['subcategory_en']>([]);

  const [newFAQ, setnewFAQ] = useState<CreateFAQRequest["body"]>({
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

  const GetAllFAQCategoryApi = useHobitQueryGetApi<GetAllFAQCategoryRequest, GetAllFAQCategoryResponse>('faqs/category');
  const FAQCreateApi = useHobitMutatePostApi<CreateFAQRequest, CreateFAQResponse>('faqs');

  // FAQ Category 데이터 가져오기
  useEffect(() => {
    const fetchFAQCategory = async () => {
      if (GetAllFAQCategoryApi.data?.payload?.statusCode === 200) {
        const data = GetAllFAQCategoryApi.data.payload.data.categories;
        setcategory(data);
      } else {
        setError('FAQ 카테고리 데이터를 불러오는데 실패했습니다.');
      }
    };

    if (GetAllFAQCategoryApi.isSuccess) {
      fetchFAQCategory();
    }
  }, [GetAllFAQCategoryApi.isSuccess]);

  //maincategory_ko 연관검색어 업데이트
  useEffect(() => {
    if (newFAQ.maincategory_ko) {
      const filtered = category.maincategory_ko.filter((maincategoryKoItem) =>
        maincategoryKoItem.includes(newFAQ.maincategory_ko)
      );
      setFilteredMaincategoryKo(filtered);
    } else {
      setFilteredMaincategoryKo(category.maincategory_ko);
    }
  }, [newFAQ.maincategory_ko, category.maincategory_ko]);

  // maincategory_en 연관검색어 업데이트
  useEffect(() => {
    if (newFAQ.maincategory_en) {
      const filtered = category.maincategory_en.filter((maincategoryEnItem) =>
        maincategoryEnItem.includes(newFAQ.maincategory_en)
      );
      setFilteredMaincategoryEn(filtered);
    } else {
      setFilteredMaincategoryEn(category.maincategory_en);
    }
  }, [newFAQ.maincategory_en, category.maincategory_en]);

  // subcategory_ko 연관검색어 업데이트
  useEffect(() => {
    if (newFAQ.subcategory_ko) {
      const filtered = category.subcategory_ko.filter((subcategoryKoItem) =>
        subcategoryKoItem.includes(newFAQ.subcategory_ko)
      );
      setFilteredSubcategoryKo(filtered);
    } else {
      setFilteredSubcategoryKo(category.subcategory_ko);
    }
  }, [newFAQ.subcategory_ko, category.subcategory_ko]);

  // subcategory_en 연관검색어 업데이트
  useEffect(() => {
    if (newFAQ.subcategory_en) {
      const filtered = category.subcategory_en.filter((subcategoryEnItem) =>
        subcategoryEnItem.includes(newFAQ.subcategory_en)
      );
      setFilteredSubcategoryEn(filtered);
    } else {
      setFilteredSubcategoryEn(category.subcategory_en);
    }
  }, [newFAQ.subcategory_en, category.subcategory_en]);

  
  const handleAddAnswer = () => {
    setnewFAQ({
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

    setnewFAQ({
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
        setnewFAQ({
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
      setnewFAQ={setnewFAQ}
      filteredMaincategoryKo={filteredMaincategoryKo}
      filteredMaincategoryEn={filteredMaincategoryEn}
      filteredSubcategoryKo={filteredSubcategoryKo}
      filteredSubcategoryEn={filteredSubcategoryEn}
      handleAddAnswer={handleAddAnswer}
      handleCreate={handleCreate}
      handleDeleteAnswer={handleDeleteAnswer}
      isCreating={isCreating}
    />
  );
};

export default FAQCreate;