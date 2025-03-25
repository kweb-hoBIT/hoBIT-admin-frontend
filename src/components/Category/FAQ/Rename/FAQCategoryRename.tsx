import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHobitQueryGetApi, useHobitMutatePutApi } from '../../../../hooks/hobitAdmin';
import { selectAuth } from '../../../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import FAQCategoryRenameForm from './FAQCategoryRenameForm';
import { GetAllFAQCategoryRequest, GetAllFAQCategoryResponse, ChangeFAQCategoryRequest, ChangeFAQCategoryResponse } from '../../../../types/faq';
import { RootState } from '../../../../redux/store';

const FAQCategoryRename: React.FC = () => {
  const { user_id } = useSelector((state: RootState) => selectAuth(state));

  const [categories, setCategories] = useState<GetAllFAQCategoryResponse['data']['categories']>([]);

  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('');

  const [renameData, setRenameData] = useState<ChangeFAQCategoryRequest['body']>({
    user_id: user_id ? Number(user_id) : 0,
    category_field: 'maincategory_ko' as ChangeFAQCategoryRequest['body']['category_field'],
    prev_category: '',
    new_category: '',
  });

  const GetAllFAQCategoryApi = useHobitQueryGetApi<GetAllFAQCategoryRequest, GetAllFAQCategoryResponse>('faqs/category');
  const RenameCategoryApi = useHobitMutatePutApi<ChangeFAQCategoryRequest, ChangeFAQCategoryResponse>('faqs/category');

  useEffect(() => {
    const fetchFAQCategory = async () => {
      if (GetAllFAQCategoryApi.data?.payload?.statusCode === 200) {
        setCategories(GetAllFAQCategoryApi.data.payload.data.categories);
      } else {
        alert('⚠️ FAQ 카테고리 데이터를 불러오는데 실패했습니다.');
        console.log('FAQ 카테고리 데이터 오류:', GetAllFAQCategoryApi.error);
      }
    };

    if (GetAllFAQCategoryApi.isSuccess && GetAllFAQCategoryApi.data) {
      fetchFAQCategory();
    }
  }, [GetAllFAQCategoryApi.isSuccess, GetAllFAQCategoryApi.data]);

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
        body: renameData,
      });

      if (renameResponse.payload?.statusCode === 200) {
        alert(' 카테고리 이름이 성공적으로 변경되었습니다.');
        window.location.reload();
      } else if (renameResponse.payload?.statusCode === 400) {
        alert('기존에 존재하는 카테고리로는 수정할 수 없습니다.');
        console.log('⚠️ FAQ 카테고리 데이터 오류:', renameResponse.payload?.message);
      } else {
        alert('카테고리 변경 중 오류가 발생했습니다.');
        console.log('⚠️ FAQ 카테고리 데이터 오류:', renameResponse.payload?.message);
      }
    } catch (error) {
      console.log('카테고리 변경 오류:', error);
      alert('⚠️ 카테고리 변경 중 오류가 발생했습니다.');
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