import { useState, useEffect } from 'react';
import { LogRequest, LogResponse, Mode } from '../../types/logAnalysis';
import { useHobitQueryGetApi } from '../hobitAdmin';

interface FetchLogDataResult {
  data: LogResponse['data']['logData']['groupData'];
  refetch: () => void;
}

export const useFetchLogData = (
  mode: Mode,
  filters: LogRequest
): FetchLogDataResult => {
  const [data, setData] = useState<LogResponse['data']['logData']['groupData']>(
    []
  );
  const path = `questionlogs/${mode}`;

  const queryObject: LogRequest =
    mode === 'language'
      ? {
          startDate: filters.startDate,
          endDate: filters.endDate,
          period: filters.period,
        }
      : {
          startDate: filters.startDate,
          endDate: filters.endDate,
          period: filters.period,
          sortOrder: filters.sortOrder,
          limit: filters.limit,
        };

  const fetchLogData = useHobitQueryGetApi<LogRequest, LogResponse>(
    path,
    undefined,
    queryObject
  );

  const refetch = async () => {
    try {
      const response = await fetchLogData();

      if (response.payload?.status === 'success') {
        setData(response.payload.data.logData.groupData || []);
      } else {
        console.error('Error fetching log data:', response?.error);
        setData([]);
      }
    } catch (error) {
      console.error('Fetch failed:', error);
      setData([]);
    }
  };

  useEffect(() => {
    refetch();
  }, [mode, filters]);

  return { data, refetch };
};
