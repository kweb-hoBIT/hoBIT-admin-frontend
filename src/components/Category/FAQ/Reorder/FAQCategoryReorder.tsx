import React, { useMemo } from 'react';
import { useHobitQueryGetApi, useHobitMutatePutApi } from '../../../../hooks/hobitAdmin';
import {
  GetAllFAQCategoryRequest,
  GetAllFAQCategoryResponse,
  UpdateFAQCategoryOrderRequest,
  UpdateFAQCategoryOrderResponse,
} from '../../../../types/faq';
import CategoryOrderTree, { OrderNode } from '../../CategoryOrderTree';
import { LoadError } from '../../../ui/ListKit';

const byOrder = (a?: number | null, b?: number | null) => (a ?? Infinity) - (b ?? Infinity);

/** 행정실 FAQ 카테고리 순서 — 대분류 ▸ 소분류 (▲▼로 옮기면 바로 저장) */
const FAQCategoryReorder: React.FC = () => {
  const api = useHobitQueryGetApi<GetAllFAQCategoryRequest, GetAllFAQCategoryResponse>('faqs/category');
  const saveApi = useHobitMutatePutApi<UpdateFAQCategoryOrderRequest, UpdateFAQCategoryOrderResponse>('faqs/category/order');
  const payload = api.data?.payload;

  const nodes = useMemo<OrderNode[]>(() => {
    if (payload?.statusCode !== 200) return [];
    return [...payload.data.categories]
      .sort((a, b) => byOrder(a.category_order, b.category_order))
      .map((m) => ({
        name: m.maincategory_ko,
        children: [...(m.subcategories || [])]
          .sort((a, b) => byOrder(a.subcategory_order, b.subcategory_order))
          .map((s) => ({ name: s.subcategory_ko })),
      }));
  }, [payload]);

  const save = async (next: OrderNode[]) => {
    const res = await saveApi({
      body: {
        mainCategories: next.map((m, i) => ({
          maincategory_ko: m.name,
          order: i + 1,
          subcategories: (m.children ?? []).map((s, j) => ({ subcategory_ko: s.name, order: j + 1 })),
        })),
      },
    });
    return res?.payload?.statusCode === 200;
  };

  if (api.isError || (payload && payload.statusCode !== 200)) {
    return <LoadError message="카테고리를 불러오지 못했어요." onRetry={() => api.refetch()} />;
  }
  return <CategoryOrderTree nodes={nodes} loading={api.isLoading} onSave={save} />;
};

export default FAQCategoryReorder;
