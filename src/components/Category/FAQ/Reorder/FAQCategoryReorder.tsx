import React, { useEffect, useState } from 'react';
import { useHobitQueryGetApi, useHobitMutatePutApi } from '../../../../hooks/hobitAdmin';
import { GetAllFAQCategoryRequest, GetAllFAQCategoryResponse, UpdateFAQCategoryOrderRequest, UpdateFAQCategoryOrderResponse } from '../../../../types/faq';
import FAQCategoryReorderForm from './FAQCategoryReorderForm';

const FAQCategoryReorder: React.FC = () => {
  const GetFAQCategoriesApi = useHobitQueryGetApi<GetAllFAQCategoryRequest, GetAllFAQCategoryResponse>('faqs/category');
  const UpdateFAQCategoryOrderApi = useHobitMutatePutApi<UpdateFAQCategoryOrderRequest, UpdateFAQCategoryOrderResponse>('faqs/category/order');

  const [categoryOrder, setCategoryOrder] = useState<string[]>([]);

  useEffect(() => {
    if (GetFAQCategoriesApi.data?.payload?.statusCode === 200) {
      const categories = GetFAQCategoriesApi.data.payload?.data.categories;

      console.log('Fetched FAQ Categories:', categories);

      const sortedCategories = [...categories].sort(
        (a, b) => (a.category_order ?? Infinity) - (b.category_order ?? Infinity)
      );

      const maincategoryOrder = sortedCategories.map((cat) => cat.maincategory_ko);

      setCategoryOrder(maincategoryOrder);
    }
  }, [GetFAQCategoriesApi.data]);

  const moveCategory = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= categoryOrder.length) return;
    const updated = [...categoryOrder];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setCategoryOrder(updated);
  };

  const handleSubmit = async () => {
    try {
      await UpdateFAQCategoryOrderApi({
        body: {
          categoryOrder,
        },
      });
      alert('카테고리 순서가 성공적으로 변경되었습니다.');
    } catch (error) {
      console.error('카테고리 순서 변경 실패:', error);
      alert('카테고리 순서 변경 중 오류가 발생했습니다.');
    }
  };

  if (GetFAQCategoriesApi.isLoading) return <p>Loading...</p>;
  if (GetFAQCategoriesApi.error) return <p>FAQ 데이터를 불러오는 중 오류가 발생했습니다.</p>;

  return (
    <FAQCategoryReorderForm
      categoryOrder={categoryOrder}
      onMove={moveCategory}
      onSubmit={handleSubmit}
    />
  );
};

export default FAQCategoryReorder;