import React from 'react';
import { useHobitQueryGetApi } from '../../../hooks/hobitAdmin';
import { GetAllQuestionLogRequest, GetAllQuestionLogResponse } from '../../../types/questionLog';
import QuestionLogMainForm from './QuestionLogMainForm';
import { ListSkeleton, LoadError } from '../../ui/ListKit';

const QuestionLogMain: React.FC = () => {
  const api = useHobitQueryGetApi<GetAllQuestionLogRequest, GetAllQuestionLogResponse>('questionlogs');
  const payload = api.data?.payload;
  // 받아 둔 데이터를 바로 씀 — 다시 받는 동안에도 이전 목록을 그대로 보여줌
  const list = payload?.statusCode === 200 ? payload.data.questionLogs : null;

  if (!list) {
    return (
      <div className="p-3 sm:p-6">
        {api.isPending || api.isFetching ? (
          <ListSkeleton />
        ) : (
          <LoadError message="유저 로그를 불러오지 못했어요." onRetry={() => api.refetch()} />
        )}
      </div>
    );
  }

  return <QuestionLogMainForm questionLogs={list} />;
};

export default QuestionLogMain;
