import React, { useEffect, useState } from 'react';
import { useHobitQueryGetApi } from '../../hooks/hobitAdmin';
import { GetAllFAQLogRequest, GetAllFAQLogResponse } from '../../types/faqLog';
import FAQLogMainForm from './FAQLogMainForm';

const FAQLogMain: React.FC = () => {
  const [faqLogData, setFaqLogData] = useState<GetAllFAQLogResponse['data']['faqLogs']>([]);
  const [error, setError] = useState<string | null>(null);

  const GetFAQLogsApi = useHobitQueryGetApi<GetAllFAQLogRequest, GetAllFAQLogResponse>('faqlogs', {
    params: {},
    query: {},
  });

  // FAQ 로그 데이터 가져오기
  useEffect(() => {
    const fetchFAQLogData = async () => {
      if (GetFAQLogsApi.data?.payload?.statusCode === 200) {
        const data = GetFAQLogsApi.data.payload.data.faqLogs;
        console.log(data);
        setFaqLogData(data);
      } else {
        setError('FAQ 로그 데이터를 가져오는 중 오류 발생');
      }
    };

    if (!GetFAQLogsApi.isLoading && GetFAQLogsApi.isSuccess) {
      fetchFAQLogData();
    }
  }, [GetFAQLogsApi]);

  if (GetFAQLogsApi.isLoading) {
    return <div>FAQ 로그 데이터를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <FAQLogMainForm faqLogs={faqLogData} />
    </div>
  );
};

export default FAQLogMain;
