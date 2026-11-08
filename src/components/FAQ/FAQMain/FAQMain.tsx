import React, { useMemo } from 'react';
import { useHobitQueryGetApi } from '../../../hooks/hobitAdmin';
import { GetAllFAQRequest, GetAllFAQResponse } from '../../../types/faq';
import FAQMainForm from './FAQMainForm';
import { ListSkeleton, LoadError } from '../../ui/ListKit';

// 학부 FAQ = 대상이 학부·공통, 대학원 FAQ = 대학원·공통 (학생 화면 학부/대학원 모드에 보이는 FAQ와 같음)
export type FAQView = 'undergraduate' | 'graduate';

const frame = 'my-6 p-3 sm:p-6 bg-surface rounded-2xl border border-line';

const FAQMain: React.FC<{ view?: FAQView }> = ({ view = 'undergraduate' }) => {
  const GetFAQsApi = useHobitQueryGetApi<GetAllFAQRequest, GetAllFAQResponse>('faqs');
  const payload = GetFAQsApi.data?.payload;
  const all = payload?.statusCode === 200 ? payload.data.faqs : null;

  // 받아 둔 데이터에서 바로 거름 — 다시 받는 동안에도 이전 목록을 그대로 보여줌
  const faqs = useMemo(
    () =>
      all?.filter((f) => {
        const a = f.audience ?? 'undergraduate';
        return a === 'all' || a === view;
      }) ?? null,
    [all, view]
  );

  if (!faqs) {
    // 처음 받는 중이거나 다시 시도하는 중이면 카드 모양 자리, 실패했으면 안내
    if (GetFAQsApi.isPending || GetFAQsApi.isFetching) {
      return (
        <div className={frame}>
          <ListSkeleton withSearch />
        </div>
      );
    }
    return (
      <div className={frame}>
        <LoadError message="FAQ 목록을 불러오지 못했어요." onRetry={() => GetFAQsApi.refetch()} />
      </div>
    );
  }

  return <FAQMainForm key={view} view={view} faqs={faqs} />;
};

export default FAQMain;
