import React, { useEffect, useState } from 'react';
import { useHobitQueryGetApi } from '../../../hooks/hobitAdmin';
import { GetAllSeniorFAQRequest, GetAllSeniorFAQResponse } from '../../../types/seniorfaq';
import SeniorFAQMainForm from './SeniorFAQMainForm';

const SeniorFAQMain: React.FC = () => {
  const [seniorFaqData, setSeniorFaqData] = useState<GetAllSeniorFAQResponse['data']['seniorFaqs']>([]);
  const [error, setError] = useState<string | null>(null);

  const GetSeniorFAQsApi = useHobitQueryGetApi<GetAllSeniorFAQRequest, GetAllSeniorFAQResponse>('seniorfaqs');
  
  // Senior FAQ 데이터 가져오기
  useEffect(() => {
    const fetchSeniorFAQData = async () => {
      if (GetSeniorFAQsApi.data?.payload?.statusCode === 200) {
        const data = GetSeniorFAQsApi.data.payload.data.seniorFaqs;
        setSeniorFaqData(data);
      } else {
        setError('Senior FAQ 데이터를 가져오는 중 오류 발생');
        console.error('Senior FAQ 데이터를 가져오는 중 오류 발생:', GetSeniorFAQsApi.error);
      }
    };

    if (GetSeniorFAQsApi.isSuccess && GetSeniorFAQsApi.data) {
      fetchSeniorFAQData();
    }
  }, [GetSeniorFAQsApi.isSuccess, GetSeniorFAQsApi.data]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (GetSeniorFAQsApi.isLoading) {
    return <div></div>;
  }

  return (
    <div>
      <SeniorFAQMainForm seniorFaqs={seniorFaqData} />
    </div>
  );
};

export default SeniorFAQMain;
