import React from 'react';
import { useHobitQueryGetApi } from '../../../hooks/hobitAdmin';
import { GetAllUserFeedbackRequest, GetAllUserFeedbackResponse } from '../../../types/feedback';
import UserFeedbackMainForm from './UserFeedbackMainForm';
import { ListSkeleton, LoadError } from '../../ui/ListKit';

const UserFeedbackMain: React.FC = () => {
  const api = useHobitQueryGetApi<GetAllUserFeedbackRequest, GetAllUserFeedbackResponse>('feedbacks/user');
  const payload = api.data?.payload;
  // 받아 둔 데이터를 바로 씀 — 다시 받는 동안에도 이전 목록을 그대로 보여줌
  const userFeedbacks = payload?.statusCode === 200 ? payload.data.userFeedbacks : null;

  if (!userFeedbacks) {
    return (
      <section className="panel p-3 sm:p-6">
        {api.isPending || api.isFetching ? (
          <ListSkeleton lines={4} />
        ) : (
          <LoadError message="피드백을 불러오지 못했어요." onRetry={() => api.refetch()} />
        )}
      </section>
    );
  }

  return <UserFeedbackMainForm userFeedbacks={userFeedbacks} />;
};

export default UserFeedbackMain;
