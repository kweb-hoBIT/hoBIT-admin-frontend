export type Mode = 'frequency' | 'feedback' | 'language';

export type LogRequest = {
  startDate: string;
  endDate: string;
  period: string;
  sortOrder?: number;
  limit?: number;
};

export interface LogResponse {
  status: string;
  message?: string;
  data: {
    logData: {
      groupData: GroupedLogData[];
    };
  };
}

export interface GroupedLogData {
  startDate: string;
  endDate: string;
  data?: LogEntry[];
  ko_frequency?: number;
  en_frequency?: number;
}

export interface LogEntry {
  rank?: number;
  faq_id?: string;
  question_ko?: string;
  count?: number;
  score_average?: number;
}
