import React, { useEffect, useState } from 'react';
import { useHobitQueryGetApi } from '../../hooks/hobitAdmin';
import {
  SpecificFrequencyRequest,
  SpecificFrequencyResponse,
  SpecificFeedbackRequest,
  SpecificFeedbackResponse,
  SpecificLanguageRequest,
  SpecificLanguageResponse,
} from '../../types/questionLog';
import SpecificAnalyzeForm from './SpecificAnalyzeForm';

interface SpecificAnalyzeProps {
  faq_id: number;
  searchSubject: string;
  period: string;
  startDate: string;
  endDate: string;
}

const SpecificAnalyze: React.FC<SpecificAnalyzeProps> = ({
  faq_id,
  searchSubject,
  period,
  startDate,
  endDate,
}) => {
  console.log(faq_id, searchSubject, period, startDate, endDate);
  const [analyzeData, setanalyzeData] = useState<SpecificFrequencyResponse | SpecificFeedbackResponse | SpecificLanguageResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 조건에 따라 사용할 API 훅을 설정
  let analyzeApi: any;
  if (searchSubject === 'frequency') {
    analyzeApi = useHobitQueryGetApi<SpecificFrequencyRequest, SpecificFrequencyResponse>(
      'questionlogs/frequency', { params: {faq_id : String(faq_id)}, query:{startDate, endDate, period}}
    );
  } else if (searchSubject === 'feedback') {
    analyzeApi = useHobitQueryGetApi<SpecificFeedbackRequest, SpecificFeedbackResponse>(
      'questionlogs/feedback',  { params: {faq_id : String(faq_id)}, query:{startDate, endDate, period}}
    );
  } else if (searchSubject === 'language') {
    analyzeApi = useHobitQueryGetApi<SpecificLanguageRequest, SpecificLanguageResponse>(
      'questionlogs/language',  { params: {faq_id : String(faq_id)}, query:{startDate, endDate, period}}
    );
  }

  useEffect(() => {
    const fetchAnalyzeData = async () => {
      if (analyzeApi?.isSuccess && analyzeApi.data?.payload?.statusCode === 200) {
        console.log(2);
        setanalyzeData(analyzeApi.data.payload ?? null);
        setError(null);
      } else {
        setError('데이터를 가져오는 데 실패했습니다. 다시 시도해주세요.');
        setanalyzeData(null);
      }
    };
  
    if (startDate!= '' && endDate != '' && analyzeApi) {
      // analyzeApi 상태가 변경될 때마다 데이터 가져오기
      if (!analyzeApi?.isLoading && analyzeApi?.isSuccess) {
        fetchAnalyzeData();
      }
    }
  }, [analyzeApi]);
  
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
      <SpecificAnalyzeForm 
        analyzeData={analyzeData} 
        searchSubject={searchSubject}
        error={error} 
      />
    </div>
  );
};

export default SpecificAnalyze;
