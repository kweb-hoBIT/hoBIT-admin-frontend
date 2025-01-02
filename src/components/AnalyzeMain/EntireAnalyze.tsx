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
import EntireAnalyzeForm from './EntireAnalyzeForm';

interface EntireAnalyzeProps {
  searchSubject: string;
  period: string;
  startDate: string;
  endDate: string;
  sortOrder: string;
  limit: string;
}

const EntireAnalyze: React.FC<EntireAnalyzeProps> = ({
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
  let analyzeApi: any;
  if (searchSubject === 'frequency') {
    analyzeApi = useHobitQueryGetApi<FrequencyRequest, FrequencyResponse>(
      'questionlogs/frequency', { query:{startDate, endDate, period, sortOrder, limit}}
    );
  } else if (searchSubject === 'feedback') {
    analyzeApi = useHobitQueryGetApi<FeedbackRequest, FeedbackResponse>(
      'questionlogs/feedback',  { query:{startDate, endDate, period, sortOrder, limit}}
    );
  } else if (searchSubject === 'language') {
    analyzeApi = useHobitQueryGetApi<LanguageRequest, LanguageResponse>(
      'questionlogs/language',  { query:{startDate, endDate, period, sortOrder, limit}}
    );
  }

  useEffect(() => {
    const fetchanalyzeData = async () => {
      if (analyzeApi?.data?.payload?.statusCode === 200) {
        setanalyzeData(analyzeApi.data.payload ?? null);
      } else {
        setError('데이터를 가져오는 데 실패했습니다. 다시 시도해주세요.');
      }
    };

    if (startDate && endDate) {
      if (!analyzeApi?.isLoading && analyzeApi?.isSuccess) {
        fetchanalyzeData();
      }
    }
  }, [searchSubject, period, startDate, endDate, sortOrder, limit, analyzeApi]);

  if (analyzeApi?.isLoading) {
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
      <EntireAnalyzeForm 
        analyzeData={analyzeData} 
        searchSubject={searchSubject}
        error={error} 
        limit={limit} // 이거 추가해서 사용 언어 빈도에도 limit 값 사용할 수 있도록 넘겨줌
      />
    </div>
  );
};

export default EntireAnalyze;
