import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Filters from '../components/logAnalysis/Filters';
import ResultsTable from '../components/logAnalysis/ResultsTable';
import useDisableDates from '../hooks/logAnalysis/useDisableDates';
import { useFetchLogData } from '../hooks/logAnalysis/useFetchLogData';
import { LogRequest, Mode, LogResponse } from '../types/logAnalysis';

const LogAnalyticsPage: React.FC = () => {
  const [filters, setFilters] = useState<LogRequest>({
    beginDate: '2024-10-01',
    endDate: '2024-12-31',
    period: 'week',
    sortOrder: 1,
    limit: 10,
  });

  const [mode, setMode] = useState<Mode>('frequency');
  const [data, setData] = useState<LogResponse['data']['logData']['groupData']>([]);

  const disableDates = useDisableDates(filters.period);
  const fetchLogData = useFetchLogData(mode);

  const fetchData = async () => {
    try {
      const response = await fetchLogData(filters); // 데이터를 가져옴
      if (response && response.data && response.data.logData) {
        setData(response.data.logData.groupData || []); // 데이터 설정
      } else {
        setData([]); // 데이터가 없을 경우 빈 배열 설정
      }
    } catch (error) {
      console.error('Error fetching log data:', error);
      setData([]);
    }
  };

  useEffect(() => {
    if (filters.beginDate && filters.endDate) {
      fetchData();
    }
  }, [filters, mode]);

  return (
    <div>
      <Header />
      <main className="p-4">
        <h1 className="text-xl font-bold mb-4">FAQ 로그 분석</h1>
        <Filters
          filters={filters}
          setFilters={setFilters}
          mode={mode}
          setMode={setMode}
          disableDates={disableDates}
        />
        <ResultsTable data={data} mode={mode} />
      </main>
    </div>
  );
};

export default LogAnalyticsPage;
