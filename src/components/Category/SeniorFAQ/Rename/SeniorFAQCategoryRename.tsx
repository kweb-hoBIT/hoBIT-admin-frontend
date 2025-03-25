import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHobitQueryGetApi, useHobitMutatePutApi } from '../../../../hooks/hobitAdmin';
import { selectAuth } from '../../../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import SeniorFAQCategoryRenameForm from './SeniorFAQCategoryRenameForm';
import {
  GetAllSeniorFAQCategoryRequest,
  GetAllSeniorFAQCategoryResponse,
  ChangeSeniorFAQCategoryRequest,
  ChangeSeniorFAQCategoryResponse
} from '../../../../types/seniorfaq';

import { RootState } from '../../../../redux/store';

const SeniorFAQCategoryRename: React.FC = () => {
  const { user_id } = useSelector((state: RootState) => selectAuth(state));

  const [categories, setCategories] = useState<GetAllSeniorFAQCategoryResponse['data']['categories']>([]);

  const [selectedMainCategory, setSelectedMainCategory] = useState<{ ko: string; en: string }>({ ko: '', en: '' });
  const [selectedSubCategory, setSelectedSubCategory] = useState<{ ko: string; en: string }>({ ko: '', en: '' });

  const [renameData, setRenameData] = useState<ChangeSeniorFAQCategoryRequest['body']>({
    user_id: user_id ? Number(user_id) : 0,
    category_field: 'maincategory_ko',
    prev_category: '',
    new_category: '',
  });

  const [isUpdating, setIsUpdating] = useState(false);

  const GetAllSeniorFAQCategoryApi = useHobitQueryGetApi<GetAllSeniorFAQCategoryRequest, GetAllSeniorFAQCategoryResponse>('seniorfaqs/category');
  const RenameCategoryApi = useHobitMutatePutApi<ChangeSeniorFAQCategoryRequest, ChangeSeniorFAQCategoryResponse>('seniorfaqs/category');

  useEffect(() => {
    const fetchSeniorFAQCategory = async () => {
      if (GetAllSeniorFAQCategoryApi.data?.payload?.statusCode === 200) {
        const formattedCategories = GetAllSeniorFAQCategoryApi.data.payload.data.categories.map(category => ({
          ...category,
          subcategories: category.subcategories.map(subcategory => ({
            ...subcategory,
            detailcategories: {
              detailcategory_ko: subcategory.detailcategories.detailcategory_ko, 
              detailcategory_en: subcategory.detailcategories.detailcategory_en, 
            }
          })),
        }));
        setCategories(formattedCategories);
      } else {
        alert('⚠️ 선배 FAQ 카테고리 데이터를 불러오는데 실패했습니다.');
        console.log(' 선배 FAQ 카테고리 데이터 오류:', GetAllSeniorFAQCategoryApi.data?.payload?.message);
      }
    }

    if (GetAllSeniorFAQCategoryApi.isSuccess && GetAllSeniorFAQCategoryApi.data) {
      fetchSeniorFAQCategory();
    }
    
  }, [GetAllSeniorFAQCategoryApi.isSuccess, GetAllSeniorFAQCategoryApi.data]);

  const handleCategorySelect = (field: string, value: string) => {
    setRenameData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "category_field") {
      setSelectedMainCategory({ ko: "", en: "" });
      setSelectedSubCategory({ ko: "", en: "" });
    }

    if (field.startsWith("maincategory")) {
      const selectedCategory = categories.find(cat => cat[field as keyof typeof cat] === value);
      if (selectedCategory) {
        setSelectedMainCategory({
          ko: selectedCategory.maincategory_ko,
          en: selectedCategory.maincategory_en,
        });
      }
    }

    if (field.startsWith("subcategory")) {
      const mainCat = categories.find(cat => cat.maincategory_ko === selectedMainCategory.ko);
      const selectedSub = mainCat?.subcategories.find(sub => sub[field as keyof typeof sub] === value);
      if (selectedSub) {
        setSelectedSubCategory({
          ko: selectedSub.subcategory_ko,
          en: selectedSub.subcategory_en,
        });
      }
    }
  };

  const handleRename = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    if (!renameData.prev_category || !renameData.new_category) {
      alert('⚠️ 모든 필드를 입력해주세요.');
      return;
    }

    try {
      const renameResponse = await RenameCategoryApi({
        body: renameData,
      });

      if (renameResponse.payload?.statusCode === 200) {
        alert('카테고리 이름이 성공적으로 변경되었습니다.');
        window.location.reload();
      } else if (renameResponse.payload?.statusCode === 400) {
        alert('⚠️ 기존에 존재하는 카테고리로는 수정할 수 없습니다.');
        console.log('FAQ 카테고리 데이터 오류:', renameResponse.payload?.message);
        setIsUpdating(false);
        return;
      } else {
        alert('⚠️ 카테고리 변경 중 오류가 발생했습니다.');
        console.log('FAQ 카테고리 데이터 오류:', renameResponse.payload?.message);
        setIsUpdating(false);
        return;
      }
    } catch (error) {
      console.log('카테고리 변경 오류:', error);
      alert('⚠️ 카테고리 변경 중 오류가 발생했습니다.');
      setIsUpdating(false);
      return;
    }
  };

  return (
    <SeniorFAQCategoryRenameForm
      renameData={renameData}
      setRenameData={setRenameData}
      categories={categories}
      selectedMainCategory={selectedMainCategory}
      selectedSubCategory={selectedSubCategory}
      handleCategorySelect={handleCategorySelect}
      handleRename={handleRename}
      isUpdating={isUpdating}
    />
  );
};

export default SeniorFAQCategoryRename;