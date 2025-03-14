import React, { useEffect, useState } from 'react';
import { useHobitQueryGetApi } from '../../../hooks/hobitAdmin';
import {
  EntireFrequencyRequest,
  EntireFrequencyResponse,
  EntireFeedbackRequest,
  EntireFeedbackResponse,
  EntireLanguageRequest,
  EntireLanguageResponse,
} from '../../../types/questionLog';
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
        setanalyzeData(analyzeApi.data.payload ?? null);
      } else {
        alert('분석 데이터를 가져오는 중 오류 발생');
        console.error('분석 데이터를 가져오는 중 오류 발생:', analyzeApi.error);
        setanalyzeData(null);
      }
    };

    if (startDate && endDate) {
      if (analyzeApi.isSuccess && analyzeApi.data) {
        fetchanalyzeData();
      }
    }
  }, [analyzeApi.isSuccess, analyzeApi.data]);

  if (!analyzeData) {
    return <div>데이터를 수집하고 있습니다.</div>;
  }

  return (
    <div>
      <EntireAnalyzeForm 
        analyzeData={analyzeData} 
        searchSubject={searchSubject}
        limit={limit}
      />
    </div>
  );
};

export default EntireAnalyze;
