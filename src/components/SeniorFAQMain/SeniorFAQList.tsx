import React, { useEffect, useState } from 'react';
import { useHobitQueryGetApi } from '../../hooks/hobitAdmin';
import { GetAllSeniorFAQRequest, GetAllSeniorFAQResponse } from '../../types/seniorfaq';
import SeniorFAQListForm from './SeniorFAQListForm';

interface SeniorFAQListProps {
  filter: string;
  selectedFilter: 'senior_faq_id' | 'maincategory_ko' | 'subcategory_ko' | 'detailcategory_ko' | 'manager';
}

const SeniorFAQList: React.FC<SeniorFAQListProps> = ({ filter, selectedFilter }) => {
  const [seniorFaqData, setSeniorFaqData] = useState<GetAllSeniorFAQResponse['data']['seniorFaqs']>([]);
  const [filteredData, setFilteredData] = useState<GetAllSeniorFAQResponse['data']['seniorFaqs']>([]);
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
      }
    };
  
    if (GetSeniorFAQsApi.isSuccess) {
      fetchSeniorFAQData();
    }
  }, [GetSeniorFAQsApi.isSuccess]);

  // seniorFaqData와 filter에 의존하여 filteredData 업데이트
  useEffect(() => {
    const lowerCaseFilter = filter.toLowerCase();
    const filtered = seniorFaqData.filter((faq) =>
      String(faq[selectedFilter]).toLowerCase().includes(lowerCaseFilter)
    );
    setFilteredData(filtered);
  }, [seniorFaqData, filter, selectedFilter]);

  if (GetSeniorFAQsApi.isLoading) {
    return <div>Senior FAQ 데이터를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!filteredData?.length) {
    return <div>Senior FAQ 데이터가 없습니다.</div>;
  }

  return (
    <div>
      <SeniorFAQListForm seniorFaqs={filteredData} />
    </div>
  );
};

export default SeniorFAQList;
