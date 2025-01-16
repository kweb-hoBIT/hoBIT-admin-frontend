import React, { useEffect, useState } from 'react';
import { useHobitQueryGetApi } from '../../hooks/hobitAdmin';
import {
  EntireFrequencyRequest,
  EntireFrequencyResponse,
  EntireFeedbackRequest,
  EntireFeedbackResponse,
  EntireLanguageRequest,
  EntireLanguageResponse,
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
  const [analyzeData, setanalyzeData] = useState<EntireFrequencyResponse | EntireFeedbackResponse | EntireLanguageResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 조건에 따라 사용할 API 훅을 설정
  let analyzeApi: any;
  if (searchSubject === 'frequency') {
    analyzeApi = useHobitQueryGetApi<EntireFrequencyRequest, EntireFrequencyResponse>(
      'questionlogs/frequency', { query:{startDate, endDate, period, sortOrder, limit}}
    );
  } else if (searchSubject === 'feedback') {
    analyzeApi = useHobitQueryGetApi<EntireFeedbackRequest, EntireFeedbackResponse>(
      'questionlogs/feedback',  { query:{startDate, endDate, period, sortOrder, limit}}
    );
  } else if (searchSubject === 'language') {
    analyzeApi = useHobitQueryGetApi<EntireLanguageRequest, EntireLanguageResponse>(
      'questionlogs/language',  { query:{startDate, endDate, period, sortOrder, limit}}
    );
  }

  useEffect(() => {
    const fetchanalyzeData = async () => {
      if (analyzeApi?.data?.payload?.statusCode === 200) {
        console.log(1);
        setanalyzeData(analyzeApi.data.payload ?? null);
        setError(null);
      } else {
        setError('데이터를 가져오는 데 실패했습니다. 다시 시도해주세요.');
        setanalyzeData(null);
      }
    };

    if (startDate && endDate) {
      if (!analyzeApi?.isLoading && analyzeApi?.isSuccess) {
        fetchanalyzeData();
      }
    }
  }, [analyzeApi]);
  

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
