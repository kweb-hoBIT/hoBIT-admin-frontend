import React, { useMemo } from 'react';
import { useHobitQueryGetApi, useHobitMutatePutApi } from '../../../../hooks/hobitAdmin';
import {
  GetAllSeniorFAQCategoryRequest,
  GetAllSeniorFAQCategoryResponse,
  UpdateSeniorFAQCategoryOrderRequest,
  UpdateSeniorFAQCategoryOrderResponse,
} from '../../../../types/seniorfaq';
import CategoryOrderTree, { OrderNode } from '../../CategoryOrderTree';
import { LoadError } from '../../../ui/ListKit';

const byOrder = (a?: number | null, b?: number | null) => (a ?? Infinity) - (b ?? Infinity);

/** 선배 FAQ 카테고리 순서 — 대분류 ▸ 소분류 ▸ 세부 항목 (▲▼로 옮기면 바로 저장) */
const SeniorFAQCategoryReorder: React.FC = () => {
  const api = useHobitQueryGetApi<GetAllSeniorFAQCategoryRequest, GetAllSeniorFAQCategoryResponse>('seniorfaqs/category');
  const saveApi = useHobitMutatePutApi<UpdateSeniorFAQCategoryOrderRequest, UpdateSeniorFAQCategoryOrderResponse>(
    'seniorfaqs/category/order'
  );
  const payload = api.data?.payload;

  const nodes = useMemo<OrderNode[]>(() => {
    if (payload?.statusCode !== 200) return [];
    return [...payload.data.categories]
      .sort((a, b) => byOrder(a.category_order, b.category_order))
      .map((m) => ({
        name: m.maincategory_ko,
        children: [...(m.subcategories || [])]
          .sort((a, b) => byOrder(a.subcategory_order, b.subcategory_order))
          // 세부 항목은 서버가 이미 순서대로 보내 줌
          .map((s) => ({ name: s.subcategory_ko, children: (s.detailcategories?.detailcategory_ko ?? []).map((d) => ({ name: d })) })),
      }));
  }, [payload]);

  const save = async (next: OrderNode[]) => {
    const res = await saveApi({
      body: {
        mainCategories: next.map((m, i) => ({
          maincategory_ko: m.name,
          order: i + 1,
          subcategories: (m.children ?? []).map((s, j) => ({
            subcategory_ko: s.name,
            order: j + 1,
            detailcategories: (s.children ?? []).map((d, k) => ({ detailcategory_ko: d.name, order: k + 1 })),
          })),
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

export default SeniorFAQCategoryReorder;
