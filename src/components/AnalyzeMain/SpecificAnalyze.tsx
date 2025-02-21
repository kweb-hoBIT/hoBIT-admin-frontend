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
  const [analyzeData, setanalyzeData] = useState<SpecificFrequencyResponse | SpecificFeedbackResponse | SpecificLanguageResponse | null>(null);

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
        setanalyzeData(analyzeApi.data.payload ?? null);
      } else {
        alert('분석 데이터를 가져오는 중 오류 발생');
        console.error('분석 데이터를 가져오는 중 오류 발생:', analyzeApi.error);
        setanalyzeData(null);
      }
    };
  
    if (startDate!= '' && endDate != '' && analyzeApi) {
      if (!analyzeApi?.isLoading && analyzeApi?.isSuccess) {
        fetchAnalyzeData();
      }
    }
  }, [analyzeApi]);
  
  if (!analyzeData) {
    return <div>데이터를 수집하고 있습니다.</div>;
  }
  
  return (
    <div>
      <SpecificAnalyzeForm 
        analyzeData={analyzeData} 
        searchSubject={searchSubject}
      />
    </div>
  );
};

export default SpecificAnalyze;
