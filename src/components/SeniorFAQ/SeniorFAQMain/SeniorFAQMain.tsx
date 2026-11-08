import React from 'react';
import { useHobitQueryGetApi } from '../../../hooks/hobitAdmin';
import { GetAllSeniorFAQRequest, GetAllSeniorFAQResponse } from '../../../types/seniorfaq';
import SeniorFAQMainForm from './SeniorFAQMainForm';
import { ListSkeleton, LoadError } from '../../ui/ListKit';

const frame = 'my-6 p-3 sm:p-6 bg-surface rounded-2xl border border-line';

const SeniorFAQMain: React.FC = () => {
  const GetSeniorFAQsApi = useHobitQueryGetApi<GetAllSeniorFAQRequest, GetAllSeniorFAQResponse>('seniorfaqs');
  const payload = GetSeniorFAQsApi.data?.payload;
  // 받아 둔 데이터를 바로 씀 — 다시 받는 동안에도 이전 목록을 그대로 보여줌
  const seniorFaqs = payload?.statusCode === 200 ? payload.data.seniorFaqs : null;

  if (!seniorFaqs) {
    if (GetSeniorFAQsApi.isPending || GetSeniorFAQsApi.isFetching) {
      return (
        <div className={frame}>
          <ListSkeleton withSearch />
        </div>
      );
    }
    return (
      <div className={frame}>
        <LoadError message="선배 FAQ 목록을 불러오지 못했어요." onRetry={() => GetSeniorFAQsApi.refetch()} />
      </div>
    );
  }

  return <SeniorFAQMainForm seniorFaqs={seniorFaqs} />;
};

export default SeniorFAQMain;
