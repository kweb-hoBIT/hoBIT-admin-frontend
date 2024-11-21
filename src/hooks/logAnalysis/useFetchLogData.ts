import { useHobitQueryGetApi } from '../hobitAdmin';
import { ApiResponse } from '../../types/api';
import { LogRequest, LogResponse, Mode } from '../../types/logAnalysis';

export const useFetchLogData = (mode: Mode) => {
  const path = `/api/questionlogs/${mode}`; // API 경로

  // Call the hook at the top level (no dynamic usage of filters here)
  const fetchLogData = useHobitQueryGetApi<LogRequest, LogResponse>(path);

  const fetchData = async (
    filters: LogRequest
  ): Promise<LogResponse | null> => {
    const queryObject: Record<string, any> = {
      startDate: filters.beginDate,
      endDate: filters.endDate,
      period: filters.period,
      sortOrder: filters.sortOrder,
      limit: filters.limit,
    };

    try {
      const response = await fetchLogData(undefined, queryObject);
      if (response.payload) {
        return response.payload;
      } else {
        console.error('Error in response:', response.error);
        return null;
      }
    } catch (error) {
      console.error('Error fetching log data:', error);
      return null; // Return null on error
    }
  };

  return fetchData; // Return the fetchData function
};
