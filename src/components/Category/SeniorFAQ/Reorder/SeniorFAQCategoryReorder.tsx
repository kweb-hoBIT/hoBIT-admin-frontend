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

const SeniorFAQCategoryReorder: React.FC = () => {
  const GetSeniorFAQCategoriesApi = useHobitQueryGetApi<GetAllSeniorFAQCategoryRequest, GetAllSeniorFAQCategoryResponse>(
    'seniorfaqs/category'
  );
  const UpdateSeniorCategoryOrderApi = useHobitMutatePutApi<
    UpdateSeniorFAQCategoryOrderRequest,
    UpdateSeniorFAQCategoryOrderResponse
  >('seniorfaqs/category/order');

  const [originalOrder, setOriginalOrder] = useState<string[]>([]);
  const [categoryOrder, setCategoryOrder] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchSeniorFAQCategory = async () => {
      if (GetSeniorFAQCategoriesApi.data?.payload?.statusCode === 200) {
        const categories = GetSeniorFAQCategoriesApi.data.payload?.data.categories;

        const sortedCategories = [...categories].sort(
          (a, b) => (a.category_order ?? Infinity) - (b.category_order ?? Infinity)
        );

        const maincategoryOrder = sortedCategories.map((cat) => cat.maincategory_ko);
        setOriginalOrder(maincategoryOrder);
        setCategoryOrder(maincategoryOrder);
      } else {
        alert('⚠️ 선배 FAQ 카테고리 데이터를 불러오는데 실패했습니다.');
        console.log('선배 FAQ 카테고리 데이터 오류:', GetSeniorFAQCategoriesApi.data?.payload?.message);
      }
    };

    if (GetSeniorFAQCategoriesApi.isSuccess && GetSeniorFAQCategoriesApi.data) {
      fetchSeniorFAQCategory();
    }
  }, [GetSeniorFAQCategoriesApi.isSuccess, GetSeniorFAQCategoriesApi.data]);

  const moveCategory = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= categoryOrder.length) return;
    const updated = [...categoryOrder];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setCategoryOrder(updated);
  };

  const handleReset = () => {
    setCategoryOrder(originalOrder);
  };

  const handleSubmit = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      const fetchUpdateSeniorCategoryOrderApi = await UpdateSeniorCategoryOrderApi({
        body: {
          categoryOrder,
        },
      });

      if (fetchUpdateSeniorCategoryOrderApi?.payload?.statusCode === 200) {
        alert('카테고리 순서가 성공적으로 변경되었습니다.');
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
        categoryOrder={categoryOrder}
        onMove={moveCategory}
        onReset={handleReset}
        onSubmit={handleSubmit}
        isUpdating={isUpdating}
      />
    </DndProvider>
  );
};

export default SeniorFAQCategoryReorder;
