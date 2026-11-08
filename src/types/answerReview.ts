// 답변 확인 — 도움 안 됨 받은 답변·못 찾은 질문·근거 없는 숫자를 뺀 답변 (관리자 백엔드 routes/api/answerReviews)
export type ReviewType = 'down' | 'not_found' | 'grounding';
export type ReviewCause = 'no_data' | 'outdated' | 'wrong_answer' | 'bad_search' | 'ok';

export type AnswerReview = {
  id: number;
  created_at: string;
  user_question: string;
  language: string;
  answer: string | null;
  answer_status: string | null;
  cited_sources: { id: string; label: string; title: string; link: string }[];
  routes: string | null;
  grounding_issues: string | null;
  trace_id: string | null;
  latency_ms: number | null;
  feedback_score: number | null;
  classified_by: string | null;
  topic: string | null;
  review_status: string | null;
  review_cause: ReviewCause | null;
  reviewed_at: string | null;
  feedback_reason: string | null;
  feedback_detail: string | null;
};

export type GetAnswerReviewsRequest = { query: { type: ReviewType; status: 'open' | 'done'; days: number } };
export type GetAnswerReviewsResponse = {
  statusCode: number;
  message: string;
  data: { counts: Partial<Record<ReviewType, number>>; items: AnswerReview[] };
};

export type TraceResult = { source_id: string; label: string; cited: boolean; title: string; link: string; doc_date: string | null; text: string };
export type GetAnswerTraceRequest = { params: { id: string; sub: 'trace' } };
export type GetAnswerTraceResponse = {
  statusCode: number;
  message: string;
  data: { query: string; routes: string[]; grounding_issues: string[]; results: TraceResult[] };
};

export type UpdateAnswerReviewRequest = { params: { id: string }; body: { status: 'done' | 'ignored' | 'open'; cause: ReviewCause | null } };
export type UpdateAnswerReviewResponse = { statusCode: number; message: string };
