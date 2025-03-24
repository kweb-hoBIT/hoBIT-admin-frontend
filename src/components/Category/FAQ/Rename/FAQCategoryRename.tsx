import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHobitQueryGetApi, useHobitMutatePutApi } from '../../../../hooks/hobitAdmin';
import { selectAuth } from '../../../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import FAQCategoryRenameForm from './FAQCategoryRenameForm';
import { FAQCategoryField, ChangeFAQCategoryRequest, ChangeFAQCategoryResponse } from '../../../../types/category';
import { GetAllFAQCategoryRequest, GetAllFAQCategoryResponse } from '../../../../types/faq';
import { RootState } from '../../../../redux/store';

const FAQCategoryRename: React.FC = () => {
  const navigate = useNavigate();
  const { user_id } = useSelector((state: RootState) => selectAuth(state));

  const [categories, setCategories] = useState<GetAllFAQCategoryResponse['data']['categories']>([]);

  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('');

  const [renameData, setRenameData] = useState<ChangeFAQCategoryRequest['body']>({
    user_id: user_id ? Number(user_id) : 0,
    category_field: 'maincategory_ko' as FAQCategoryField,
    prev_category: '',
    new_category: '',
  });

  const GetAllFAQCategoryApi = useHobitQueryGetApi<GetAllFAQCategoryRequest, GetAllFAQCategoryResponse>('faqs/category');
  const RenameCategoryApi = useHobitMutatePutApi<ChangeFAQCategoryRequest, ChangeFAQCategoryResponse>('faqs/category');

  useEffect(() => {
    if (GetAllFAQCategoryApi.isSuccess && GetAllFAQCategoryApi.data?.payload?.statusCode === 200) {
      setCategories(GetAllFAQCategoryApi.data.payload.data.categories);
    } else if (GetAllFAQCategoryApi.isError) {
      alert('FAQ 카테고리 데이터를 불러오는데 실패했습니다.');
      console.error('FAQ 카테고리 데이터 오류:', GetAllFAQCategoryApi.error);
    }
  }, [GetAllFAQCategoryApi.isSuccess, GetAllFAQCategoryApi.isError]);

  const handleCategorySelect = (field: string, value: string) => {
    if (field === 'prev_category' && renameData.category_field.includes('subcategory')) {
      setSelectedMainCategory(value); 
    }

    setRenameData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRename = async () => {
    if (!renameData.prev_category || !renameData.new_category) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    try {
      const renameResponse = await RenameCategoryApi({
        params: { user_feedback_id: '' },
        body: renameData,
      });

      if (renameResponse.payload?.statusCode === 200) {
        alert(' 카테고리 이름이 성공적으로 변경되었습니다.');
        navigate('/faqs');
      } else {
        alert(renameResponse.payload?.message || '⚠️ 카테고리 변경 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('카테고리 변경 오류:', error);
      alert('카테고리 변경 중 오류가 발생했습니다.');
    }
  };

  return (
    <FAQCategoryRenameForm
      renameData={renameData}
      setRenameData={setRenameData}
      categories={categories}
      handleCategorySelect={handleCategorySelect}
      handleRename={handleRename}
      isRenaming={GetAllFAQCategoryApi.isLoading}
    />
  );
};

export default FAQCategoryRename;