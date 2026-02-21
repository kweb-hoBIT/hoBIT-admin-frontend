import React, { useEffect, useState } from 'react';
import { useHobitQueryGetApi, useHobitMutatePutApi } from '../../../../hooks/hobitAdmin';
import { GetAllFAQCategoryRequest, GetAllFAQCategoryResponse, UpdateFAQCategoryOrderRequest, UpdateFAQCategoryOrderResponse } from '../../../../types/faq';
import FAQCategoryReorderForm from './FAQCategoryReorderForm';
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
}

const FAQCategoryReorder: React.FC = () => {
  const GetFAQCategoriesApi = useHobitQueryGetApi<GetAllFAQCategoryRequest, GetAllFAQCategoryResponse>('faqs/category');
  const UpdateFAQCategoryOrderApi = useHobitMutatePutApi<UpdateFAQCategoryOrderRequest, UpdateFAQCategoryOrderResponse>('faqs/category/order');

  const [originalCategories, setOriginalCategories] = useState<CategoryData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchFAQCategory = async () => {
      if (GetFAQCategoriesApi.data?.payload?.statusCode === 200) {
        const apiCategories = GetFAQCategoriesApi.data.payload?.data.categories;

        const sortedCategories = [...apiCategories].sort(
          (a, b) => (a.category_order ?? Infinity) - (b.category_order ?? Infinity)
        );

        const structuredCategories: CategoryData[] = sortedCategories.map((mainCat, mainIdx) => {
          const sortedSubcategories = [...(mainCat.subcategories || [])].sort(
            (a, b) => (a.subcategory_order ?? Infinity) - (b.subcategory_order ?? Infinity)
          );

          const subcategories: SubcategoryData[] = sortedSubcategories.map((subCat, subIdx) => ({
            subcategory_ko: subCat.subcategory_ko,
            order: subCat.subcategory_order ?? subIdx + 1,
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
        alert('⚠️ FAQ 카테고리 데이터를 불러오는데 실패했습니다.');
        console.log('FAQ 카테고리 데이터 오류:', GetFAQCategoriesApi.data?.payload?.message);
      }
    };

    if (GetFAQCategoriesApi.isSuccess && GetFAQCategoriesApi.data) {
      fetchFAQCategory();
    }
  }, [GetFAQCategoriesApi.isSuccess, GetFAQCategoriesApi.data]);

  const moveCategory = (
    type: 'main' | 'sub',
    fromIndex: number,
    toIndex: number,
    mainIdx?: number
  ) => {
    const newCategories = JSON.parse(JSON.stringify(categories));

    if (type === 'main') {
      const [moved] = newCategories.splice(fromIndex, 1);
      newCategories.splice(toIndex, 0, moved);
      newCategories.forEach((cat: CategoryData, idx: number) => {
        cat.order = idx + 1;
      });
    } else if (type === 'sub' && mainIdx !== undefined) {
      const subs = newCategories[mainIdx].subcategories;
      if (subs) {
        const [moved] = subs.splice(fromIndex, 1);
        subs.splice(toIndex, 0, moved);
        subs.forEach((sub: SubcategoryData, idx: number) => {
          sub.order = idx + 1;
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
      const fetchUpdateFAQCategoryOrderApi = await UpdateFAQCategoryOrderApi({
        body: {
          mainCategories: categories,
        },
      });

      if (fetchUpdateFAQCategoryOrderApi?.payload?.statusCode === 200) {
        alert('카테고리 순서가 성공적으로 변경되었습니다.');
        setOriginalCategories(JSON.parse(JSON.stringify(categories)));
      } else {
        console.error('카테고리 순서 변경 실패:', fetchUpdateFAQCategoryOrderApi?.payload?.message);
        alert('카테고리 순서 변경 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('카테고리 순서 변경 실패:', error);
      alert('카테고리 순서 변경 중 오류가 발생했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (GetFAQCategoriesApi.isLoading) return <p></p>;

  return (
    <DndProvider backend={HTML5Backend}>
      <FAQCategoryReorderForm
        categories={categories}
        onMove={moveCategory}
        onReset={handleReset}
        onSubmit={handleSubmit}
        isUpdating={isUpdating}
      />
    </DndProvider>
  );
};

export default FAQCategoryReorder;
