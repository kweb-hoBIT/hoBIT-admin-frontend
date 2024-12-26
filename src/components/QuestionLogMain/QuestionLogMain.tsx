import React, { useEffect, useState } from 'react';
import { useHobitQueryGetApi } from '../../hooks/hobitAdmin';
import { GetAllQuestionLogRequest, GetAllQuestionLogResponse } from '../../types/questionLog';
import QuestionLogMainForm from './QuestionLogMainForm';

const QuestionLogMain: React.FC = () => {
  const [questionLogData, setQuestionLogData] = useState<GetAllQuestionLogResponse['data']['questionLogs']>([]);
  const [error, setError] = useState<string | null>(null);

  const GetQuestionLogsApi = useHobitQueryGetApi<GetAllQuestionLogRequest, GetAllQuestionLogResponse>('questionlogs', {
    params: {},
    query: {},
  });

  // Question 로그 데이터 가져오기
  useEffect(() => {
    const fetchQuestionLogData = async () => {
      if (GetQuestionLogsApi.data?.payload?.statusCode === 200) {
        const data = GetQuestionLogsApi.data.payload.data.questionLogs;
        setQuestionLogData(data);
      } else {
        setError('Question 로그 데이터를 가져오는 중 오류 발생');
      }
    };

    if (!GetQuestionLogsApi.isLoading && GetQuestionLogsApi.isSuccess) {
      fetchQuestionLogData();
    }
  }, [GetQuestionLogsApi]);

  if (GetQuestionLogsApi.isLoading) {
    return <div>Question 로그 데이터를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <QuestionLogMainForm questionLogs={questionLogData} />
    </div>
  );
};

export default QuestionLogMain;
