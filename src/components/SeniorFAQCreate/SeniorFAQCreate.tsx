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
  const [filteredMaincategoryKo, setFilteredMaincategoryKo] = useState<GetAllSeniorFAQCategoryResponse['data']['categories']['maincategory_ko']>([]);
  const [filteredMaincategoryEn, setFilteredMaincategoryEn] = useState<GetAllSeniorFAQCategoryResponse['data']['categories']['maincategory_en']>([]);
  const [filteredSubcategoryKo, setFilteredSubcategoryKo] = useState<GetAllSeniorFAQCategoryResponse['data']['categories']['subcategory_ko']>([]);
  const [filteredSubcategoryEn, setFilteredSubcategoryEn] = useState<GetAllSeniorFAQCategoryResponse['data']['categories']['subcategory_en']>([]);
  const [filteredDetailcategoryKo, setFilteredDetailcategoryKo] = useState<GetAllSeniorFAQCategoryResponse['data']['categories']['detailcategory_ko']>([]);
  const [filteredDetailcategoryEn, setFilteredDetailcategoryEn] = useState<GetAllSeniorFAQCategoryResponse['data']['categories']['detailcategory_en']>([]);
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

  //maincategory_ko 연관검색어 업데이트
  useEffect(() => {
    if (newSeniorFAQ.maincategory_ko) {
      const filtered = category.maincategory_ko.filter((maincategoryKoItem) =>
        maincategoryKoItem.includes(newSeniorFAQ.maincategory_ko)
      );
      setFilteredMaincategoryKo(filtered);
    } else {
      setFilteredMaincategoryKo(category.maincategory_ko);
    }
  }, [newSeniorFAQ.maincategory_ko, category.maincategory_ko]);

  // maincategory_en 연관검색어 업데이트
  useEffect(() => {
    if (newSeniorFAQ.maincategory_en) {
      const filtered = category.maincategory_en.filter((maincategoryEnItem) =>
        maincategoryEnItem.includes(newSeniorFAQ.maincategory_en)
      );
      setFilteredMaincategoryEn(filtered);
    } else {
      setFilteredMaincategoryEn(category.maincategory_en);
    }
  }, [newSeniorFAQ.maincategory_en, category.maincategory_en]);

  // subcategory_ko 연관검색어 업데이트
  useEffect(() => {
    if (newSeniorFAQ.subcategory_ko) {
      const filtered = category.subcategory_ko.filter((subcategoryKoItem) =>
        subcategoryKoItem.includes(newSeniorFAQ.subcategory_ko)
      );
      setFilteredSubcategoryKo(filtered);
    } else {
      setFilteredSubcategoryKo(category.subcategory_ko);
    }
  }, [newSeniorFAQ.subcategory_ko, category.subcategory_ko]);

  // subcategory_en 연관검색어 업데이트
  useEffect(() => {
    if (newSeniorFAQ.subcategory_en) {
      const filtered = category.subcategory_en.filter((subcategoryEnItem) =>
        subcategoryEnItem.includes(newSeniorFAQ.subcategory_en)
      );
      setFilteredSubcategoryEn(filtered);
    } else {
      setFilteredSubcategoryEn(category.subcategory_en);
    }
  }, [newSeniorFAQ.subcategory_en, category.subcategory_en]);

  // detailcategory_ko 연관검색어 업데이트
  useEffect(() => {
    if (newSeniorFAQ.detailcategory_ko) {
      const filtered = category.detailcategory_ko.filter((detailcategoryKoItem) =>
        detailcategoryKoItem.includes(newSeniorFAQ.detailcategory_ko)
      );
      setFilteredDetailcategoryKo(filtered);
    } else {
      setFilteredDetailcategoryKo(category.detailcategory_ko);
    }
  }, [newSeniorFAQ.detailcategory_ko, category.detailcategory_ko]);

  // detailcategory_en 연관검색어 업데이트
  useEffect(() => {
    if (newSeniorFAQ.detailcategory_en) {
      const filtered = category.detailcategory_en.filter((detailcategoryEnItem) =>
        detailcategoryEnItem.includes(newSeniorFAQ.detailcategory_en)
      );
      setFilteredDetailcategoryEn(filtered);
    } else {
      setFilteredDetailcategoryEn(category.detailcategory_en);
    }
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
      filteredMaincategoryKo={filteredMaincategoryKo}
      filteredMaincategoryEn={filteredMaincategoryEn}
      filteredSubcategoryKo={filteredSubcategoryKo}
      filteredSubcategoryEn={filteredSubcategoryEn}
      filteredDetailcategoryKo={filteredDetailcategoryKo}
      filteredDetailcategoryEn={filteredDetailcategoryEn}
      handleAddAnswer={handleAddAnswer}
      handleSubmit={handleSubmit}
      handleDeleteAnswer={handleDeleteAnswer}
    />
  );
};

export default SeniorFAQCreate;
