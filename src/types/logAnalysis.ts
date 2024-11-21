export type Mode = 'frequency' | 'feedback' | 'language';

export type LogRequest = {
  beginDate: string;
  endDate: string;
  period: string;
  sortOrder?: number;
  limit?: number;
};

// 공통 응답 데이터 구조
export interface LogResponse {
  status: string; // 응답 상태 ("success" 또는 "error")
  message?: string; // 오류 또는 성공 메시지 (선택적)
  data: {
    logData: {
      groupData: GroupedLogData[]; // 그룹화된 로그 데이터 배열
    };
  };
}

export interface GroupedLogData {
  startDate: string; // 그룹의 시작 날짜
  endDate: string; // 그룹의 끝 날짜
  data?: LogEntry[]; // 그룹 내의 개별 로그 데이터 배열
  ko_frequency?: number; // 한국어 횟수 (language 모드에서 사용)
  en_frequency?: number; // 영어 횟수 (language 모드에서 사용)
}

export interface LogEntry {
  rank?: number; // 순위 (feedback 또는 frequency 모드에서 사용)
  faq_id?: string; // FAQ ID
  question_ko?: string; // FAQ 질문 내용
  count?: number; // 검색 횟수 (frequency 모드에서 사용)
  score_average?: number; // 평균 점수 (feedback 모드에서 사용)
}
