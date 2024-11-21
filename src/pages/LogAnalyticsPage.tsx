import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Filters from '../components/logAnalysis/Filters';
import ResultsTable from '../components/logAnalysis/ResultsTable';
import useDisableDates from '../hooks/logAnalysis/useDisableDates';
import useAdjustOtherDate from '../hooks/logAnalysis/useAdjustOtherDate';
import { useFetchLogData } from '../hooks/logAnalysis/useFetchLogData';
import { LogRequest, Mode, LogResponse } from '../types/logAnalysis';

const LogAnalyticsPage: React.FC = () => {
  const [filters, setFilters] = useState<LogRequest>({
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    period: 'week',
    sortOrder: 1,
    limit: 10,
  });

  const [mode, setMode] = useState<Mode>('feedback');

  const disableDates = useDisableDates(filters.period);
  const fetchLogData = useFetchLogData(mode, filters);

  useEffect(() => {
    if (filters.startDate && filters.endDate) {
      fetchLogData.refetch();
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
        <ResultsTable data={fetchLogData.data} mode={mode} />
      </main>
    </div>
  );
};

export default LogAnalyticsPage;
