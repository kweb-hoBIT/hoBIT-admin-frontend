import React, { useEffect, useState } from 'react';
import { useHobitQueryGetApi } from '../../hooks/hobitAdmin';
import {
  FrequencyRequest,
  FrequencyResponse,
  FeedbackRequest,
  FeedbackResponse,
  LanguageRequest,
  LanguageResponse,
} from '../../types/questionLog';
import AnalyzeForm from './AnalyzeForm';

interface AnalyzeProps {
  searchSubject: string;
  period: string;
  startDate: string;
  endDate: string;
  sortOrder: string;
  limit: string;
}

const Analyze: React.FC<AnalyzeProps> = ({
  searchSubject,
  period,
  startDate,
  endDate,
  sortOrder,
  limit,
}) => {
  const [analyzeData, setanalyzeData] = useState<FrequencyResponse | FeedbackResponse | LanguageResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 조건에 따라 사용할 API 훅을 설정
  let queryResult: any;
  if (searchSubject === 'frequency') {
    queryResult = useHobitQueryGetApi<FrequencyRequest, FrequencyResponse>(
      'questionlogs/frequency', { params: {}, query:{startDate, endDate, period, sortOrder, limit}}
    );
  } else if (searchSubject === 'feedback') {
    queryResult = useHobitQueryGetApi<FeedbackRequest, FeedbackResponse>(
      'questionlogs/feedback',  { params: {}, query:{startDate, endDate, period, sortOrder, limit}}
    );
  } else if (searchSubject === 'language') {
    queryResult = useHobitQueryGetApi<LanguageRequest, LanguageResponse>(
      'questionlogs/language',  { params: {}, query:{startDate, endDate, period, sortOrder, limit}}
    );
  }

  useEffect(() => {
    const fetchanalyzeData = async () => {
      if (queryResult?.data?.payload?.status === 'success') {
        setanalyzeData(queryResult.data.payload ?? null);
      } else {
        setError('데이터를 가져오는 데 실패했습니다. 다시 시도해주세요.');
      }
    };

    if (startDate && endDate) {
      if (!queryResult?.isLoading && queryResult?.isSuccess) {
        fetchanalyzeData();
      }
    }
  }, [searchSubject, period, startDate, endDate, sortOrder, limit, queryResult]);

  if (queryResult?.isLoading) {
    return <div>데이터를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!analyzeData) {
    return <div>데이터가 없습니다.</div>;
  }

  return (
    <div>
      <AnalyzeForm 
        analyzeData={analyzeData} 
        searchSubject={searchSubject}
        error={error} 
      />
    </div>
  );
};

export default Analyze;
