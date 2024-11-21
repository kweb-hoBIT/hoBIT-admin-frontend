import { LogRequest } from '../../types/logAnalysis';

const useAdjustOtherDate = (
  filters: LogRequest,
  setFilters: React.Dispatch<React.SetStateAction<LogRequest>>
) => {
  const adjustOtherDate = (selectedDate: Date, type: 'start' | 'end'): void => {
    const formattedDate = selectedDate.toISOString().split('T')[0];

    if (type === 'start') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        startDate: formattedDate,
        endDate:
          prevFilters.endDate &&
          new Date(formattedDate) > new Date(prevFilters.endDate)
            ? formattedDate
            : prevFilters.endDate,
      }));
    } else if (type === 'end') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        endDate: formattedDate,
        startDate:
          prevFilters.startDate &&
          new Date(formattedDate) < new Date(prevFilters.startDate)
            ? formattedDate
            : prevFilters.startDate,
      }));
    }
  };

  return adjustOtherDate;
};

export default useAdjustOtherDate;
