export const fetchLogs = async (
  mode: 'frequency' | 'feedback' | 'language',
  filters: {
    beginDate: string;
    endDate: string;
    period: string;
    sortOrder: number;
    limit: number;
  },
  endpoint: string
) => {
  const params = new URLSearchParams({
    startDate: filters.beginDate,
    endDate: filters.endDate,
    period: filters.period,
    ...(mode !== 'language' && { sortOrder: String(filters.sortOrder) }),
    ...(mode !== 'language' && { limit: String(filters.limit) }),
  });

  const response = await fetch(
    `${endpoint}/api/questionlogs/${mode}?${params}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch logs');
  }

  const result = await response.json();
  if (result.status !== 'success') {
    throw new Error(result.message || 'Unknown error occurred');
  }

  return result.data.logData.groupData || [];
};
