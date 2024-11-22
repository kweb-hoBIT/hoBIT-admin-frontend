const useDisableDates = (period: string) => {
  const disableDates = (date: Date, type: 'start' | 'end'): boolean => {
    if (period === 'week') {
      if (type === 'start') return date.getDay() == 1;
      if (type === 'end') return date.getDay() == 0;
    }

    if (period === 'month') {
      if (type === 'start') return date.getDate() == 1;
      if (type === 'end') {
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        return nextDay.getDate() == 1;
      }
    }

    return true;
  };

  return disableDates;
};

export default useDisableDates;
