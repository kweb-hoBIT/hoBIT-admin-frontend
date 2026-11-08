// 관리자 홈 대시보드 (관리자 백엔드 routes/api/dashboard)
export type GetDashboardRequest = {};
export type GetDashboardResponse = {
  statusCode: number;
  message: string;
  data: {
    totals: {
      today: number;
      week: number;
      prev_week: number;
      month: number;
      month_en: number;
      unresolved_feedbacks: number;
      week_feedbacks: number;
    };
    daily: { date: string; ko: number; en: number }[];
    top_faqs: { faq_id: number; question_ko: string; count: number }[];
    top_questions: { question: string; count: number }[];
    // 홈페이지·FAQ 정기 수집의 마지막 결과 (RAG를 못 부르면 null)
    pipeline: { finished_at: string; scope: string; ok: boolean; problems: string[]; last_ok_at: string | null } | null;
    quality?: QualityWeek[];
    quality_daily?: QualityDaily | null;
    tests?: { finished_at: string; total: number; passed: number; flaky: string[]; failed: string[] } | null;
    recent_feedbacks: {
      user_feedback_id: number;
      question_ko: string | null;
      user_question: string;
      feedback_reason: string | null;
      feedback_detail: string | null;
      language: string;
      created_at: string;
    }[];
  };
};

// 주별 답변 품질 (리뉴얼 AI 답변) — 비율은 %, 응답 시간은 ms
export type QualityWeek = {
  week_start: string;
  total: number;
  not_found_rate: number | null;
  down: number;
  up: number;
  down_rate: number | null;
  grounding_rate: number | null;
  rule_rate: number | null;
  latency_p50: number | null;
  latency_p90: number | null;
};

// 일별 답변 품질 (최근 14일) + 최근 7일·그 전 7일 합계 — 홈 '답변 품질' 그래프
export type QualityStat = {
  total: number;
  not_found_rate: number | null;
  down_rate: number | null;
  grounding_rate: number | null;
  rule_rate: number | null;
  latency_p50: number | null;
  latency_p90: number | null;
};
export type QualityDaily = {
  daily: (QualityStat & { date: string })[];
  current: QualityStat;
  previous: QualityStat;
};
