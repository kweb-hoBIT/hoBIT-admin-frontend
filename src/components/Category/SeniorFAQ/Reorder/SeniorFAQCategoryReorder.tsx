import React, { useEffect, useState } from 'react';
import { useHobitQueryGetApi, useHobitMutatePutApi } from '../../../../hooks/hobitAdmin';
import {
  GetAllSeniorFAQCategoryRequest,
  GetAllSeniorFAQCategoryResponse,
  UpdateSeniorFAQCategoryOrderRequest,
  UpdateSeniorFAQCategoryOrderResponse,
} from '../../../../types/seniorfaq';
import SeniorFAQCategoryReorderForm from './SeniorFAQCategoryReorderForm';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface CategoryData {
  maincategory_ko: string;
  order: number;
  subcategories?: SubcategoryData[];
}

interface SubcategoryData {
  subcategory_ko: string;
  order: number;
  detailcategories?: DetailCategoryData[];
}

interface DetailCategoryData {
  detailcategory_ko: string;
  order: number;
}

const SeniorFAQCategoryReorder: React.FC = () => {
  const GetSeniorFAQCategoriesApi = useHobitQueryGetApi<GetAllSeniorFAQCategoryRequest, GetAllSeniorFAQCategoryResponse>(
    'seniorfaqs/category'
  );
  const UpdateSeniorCategoryOrderApi = useHobitMutatePutApi<
    UpdateSeniorFAQCategoryOrderRequest,
    UpdateSeniorFAQCategoryOrderResponse
  >('seniorfaqs/category/order');

  const [originalCategories, setOriginalCategories] = useState<CategoryData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchSeniorFAQCategory = async () => {
      if (GetSeniorFAQCategoriesApi.data?.payload?.statusCode === 200) {
        const apiCategories = GetSeniorFAQCategoriesApi.data.payload?.data.categories;

        // Sort by existing order and structure categories
        const sortedCategories = [...apiCategories].sort(
          (a, b) => (a.category_order ?? Infinity) - (b.category_order ?? Infinity)
        );

        const structuredCategories: CategoryData[] = sortedCategories.map((mainCat, mainIdx) => {
          // Sort subcategories by their order
          const sortedSubcategories = [...(mainCat.subcategories || [])].sort(
            (a, b) => (a.subcategory_order ?? Infinity) - (b.subcategory_order ?? Infinity)
          );

          const subcategories: SubcategoryData[] = sortedSubcategories.map((subCat, subIdx) => ({
            subcategory_ko: subCat.subcategory_ko,
            order: subCat.subcategory_order ?? subIdx + 1,
            detailcategories: subCat.detailcategories?.detailcategory_ko?.map((detailCat, detailIdx) => ({
              detailcategory_ko: detailCat,
              order: detailIdx + 1, // Detail categories don't have individual order in DB yet
            })),
          }));

          return {
            maincategory_ko: mainCat.maincategory_ko,
            order: mainCat.category_order ?? mainIdx + 1,
            subcategories,
          };
        });

        setOriginalCategories(JSON.parse(JSON.stringify(structuredCategories)));
        setCategories(structuredCategories);
      } else {
        alert('⚠️ 선배 FAQ 카테고리 데이터를 불러오는데 실패했습니다.');
        console.log('선배 FAQ 카테고리 데이터 오류:', GetSeniorFAQCategoriesApi.data?.payload?.message);
      }
    };

    if (GetSeniorFAQCategoriesApi.isSuccess && GetSeniorFAQCategoriesApi.data) {
      fetchSeniorFAQCategory();
    }
  }, [GetSeniorFAQCategoriesApi.isSuccess, GetSeniorFAQCategoriesApi.data]);

  const moveCategory = (
    type: 'main' | 'sub' | 'detail',
    fromIndex: number,
    toIndex: number,
    mainIdx?: number,
    subIdx?: number
  ) => {
    const newCategories = JSON.parse(JSON.stringify(categories));

    if (type === 'main') {
      const [moved] = newCategories.splice(fromIndex, 1);
      newCategories.splice(toIndex, 0, moved);
      // Update order values
      newCategories.forEach((cat: CategoryData, idx: number) => {
        cat.order = idx + 1;
      });
    } else if (type === 'sub' && mainIdx !== undefined) {
      const subs = newCategories[mainIdx].subcategories;
      if (subs) {
        const [moved] = subs.splice(fromIndex, 1);
        subs.splice(toIndex, 0, moved);
        // Update order values
        subs.forEach((sub: SubcategoryData, idx: number) => {
          sub.order = idx + 1;
        });
      }
    } else if (type === 'detail' && mainIdx !== undefined && subIdx !== undefined) {
      const details = newCategories[mainIdx].subcategories?.[subIdx]?.detailcategories;
      if (details) {
        const [moved] = details.splice(fromIndex, 1);
        details.splice(toIndex, 0, moved);
        // Update order values
        details.forEach((detail: DetailCategoryData, idx: number) => {
          detail.order = idx + 1;
        });
      }
    }

    setCategories(newCategories);
  };

  const handleReset = () => {
    setCategories(JSON.parse(JSON.stringify(originalCategories)));
  };

  const handleSubmit = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      const fetchUpdateSeniorCategoryOrderApi = await UpdateSeniorCategoryOrderApi({
        body: {
          mainCategories: categories,
        },
      });

      if (fetchUpdateSeniorCategoryOrderApi?.payload?.statusCode === 200) {
        alert('카테고리 순서가 성공적으로 변경되었습니다.');
        setOriginalCategories(JSON.parse(JSON.stringify(categories)));
      } else {
        console.error('카테고리 순서 변경 실패:', fetchUpdateSeniorCategoryOrderApi?.payload?.message);
        alert('카테고리 순서 변경 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('카테고리 순서 변경 실패:', error);
      alert('카테고리 순서 변경 중 오류가 발생했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (GetSeniorFAQCategoriesApi.isLoading) return <p></p>;

  return (
    <DndProvider backend={HTML5Backend}>
      <SeniorFAQCategoryReorderForm
        categories={categories}
        onMove={moveCategory}
        onReset={handleReset}
        onSubmit={handleSubmit}
        isUpdating={isUpdating}
      />
    </DndProvider>
  );
};

export default SeniorFAQCategoryReorder;
