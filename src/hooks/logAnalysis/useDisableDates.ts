// hooks/useDisableDates.ts
const useDisableDates = (period: string) => {
  const disableDates = (date: Date, type: 'start' | 'end'): boolean => {
    if (period === 'week') {
      if (type === 'start') return date.getDay() !== 1; // 월요일만 시작 가능
      if (type === 'end') return date.getDay() !== 0; // 일요일만 종료 가능
    }

    if (period === 'month') {
      if (type === 'start') return date.getDate() !== 1; // 1일만 시작 가능
      if (type === 'end') {
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        return nextDay.getDate() !== 1; // 마지막 날만 종료 가능
      }
    }

    return false; // 기본적으로 비활성화하지 않음
  };

  return disableDates;
};

export default useDisableDates;
