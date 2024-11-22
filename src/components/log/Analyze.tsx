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
  sortOrder: number;
  limit: number;
}

const Analyze: React.FC<AnalyzeProps> = ({
  searchSubject,
  period,
  startDate,
  endDate,
  sortOrder,
  limit,
}) => {
  const [responseData, setResponseData] = useState<FrequencyResponse | FeedbackResponse | LanguageResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 조건에 따라 사용할 API 훅을 설정(params가 없기에 undefined로 설정)
  let mutateAnalyze: any;
  if (searchSubject === 'frequency') {
    mutateAnalyze = useHobitQueryGetApi<FrequencyRequest, FrequencyResponse>(
      'questionlogs/frequency',
      undefined,
      {
        startDate,
        endDate,
        period,
        sortOrder,
        limit,
      }
    );
  } else if (searchSubject === 'feedback') {
    mutateAnalyze = useHobitQueryGetApi<FeedbackRequest, FeedbackResponse>(
      'questionlogs/feedback',
      undefined,
      {
        startDate,
        endDate,
        period,
        sortOrder,
        limit,
      }
    );
  } else if (searchSubject === 'language') {
    mutateAnalyze = useHobitQueryGetApi<LanguageRequest, LanguageResponse>(
      'questionlogs/language',
      undefined,
      {
        startDate,
        endDate,
        period,
        sortOrder,
        limit,
      }
    );
  }

  useEffect(() => {
    const fetchAnalyzeData = async () => {
      setIsLoading(true);
      try {
        if (!mutateAnalyze) throw new Error('유효하지 않은 검색 주제입니다.');
        
        const response = await mutateAnalyze();

        if (response.payload?.status === 'success') {
          setResponseData(response.payload ?? null);
        } else {
          throw new Error('데이터를 가져오는 데 실패했습니다. 다시 시도해주세요.');
        }
      } catch (err: any) {
        setError(err.message || '데이터를 가져오는 데 실패했습니다. 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    };

    if (startDate && endDate) {
      fetchAnalyzeData();
    }
  }, [searchSubject, period, startDate, endDate, sortOrder, limit, mutateAnalyze]);

  if (isLoading) {
    return <div>데이터를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!responseData) {
    return <div>데이터가 없습니다.</div>;
  }
  return (
    <div>
      <AnalyzeForm 
        responseData={responseData} 
        searchSubject={searchSubject} 
      />
    </div>
  );
};

export default Analyze;
