import { LogRequest } from '../../types/logAnalysis';

const useAdjustOtherDate = (
  filters: LogRequest,
  setFilters: React.Dispatch<React.SetStateAction<LogRequest>>
) => {
  const adjustOtherDate = (selectedDate: Date, type: 'start' | 'end'): void => {
    if (type === 'start') {
      setFilters({
        ...filters,
        endDate: selectedDate.toISOString().split('T')[0],
      });
    } else if (type === 'end') {
      setFilters({
        ...filters,
        beginDate: selectedDate.toISOString().split('T')[0],
      });
    }
  };

  return adjustOtherDate;
};

export default useAdjustOtherDate;
