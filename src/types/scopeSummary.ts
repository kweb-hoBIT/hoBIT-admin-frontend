// 주제별 검색 범위 요약 (관리자 백엔드 routes/api/dashboard/scopeSummary.ts — GET /api/dashboard/scope?days=30)
export type ScopeTopic = {
  topic: string | null; // 주제 id (null = 주제 없음)
  label: string;
  questions: number; // 기간 안 AI 답변 수
  widened: number; // "범위가 좁아 전체로 넓힘"이 남은 답변 수
  widened_rate: number; // % (소수 한 자리)
  widened_static: number; // 안내(홈페이지·학사 안내)까지 넓힌 수
  widened_notices: number; // 공지까지 넓힌 수
  not_found: number;
  not_found_rate: number;
  down: number;
  down_rate: number;
  widened_sources: { name: string; count: number }[]; // 넓혔을 때 답변에 인용된 자료 (많은 순 5개)
};

export type GetScopeSummaryResponse = {
  statusCode: number;
  message: string;
  data: { days: number; total: number; topics: ScopeTopic[] };
};
