// FAQ 후보 — 학생이 물었지만 호빗이 답을 못 찾은 질문을 비슷한 것끼리 모은 것 (관리자 백엔드 routes/api/faqCandidates)
export type FaqCandidateStatus = 'open' | 'done' | 'dismissed';
export type FaqCandidateSort = 'count' | 'recent';

export type FaqCandidate = {
  id: number;
  question: string; // 대표 문장 (한국어)
  ask_count: number;
  samples: { text: string; language: string; at: string }[]; // 학생 원래 문장 (최근 순)
  first_asked_at: string | null;
  last_asked_at: string | null;
  status: FaqCandidateStatus;
  similar_faq_id: number | null; // 이미 비슷한 FAQ가 있으면 — 검색이 놓친 것
  similar_faq_question: string | null;
  similar_faq_senior: boolean;
  similar_score: number | null;
  created_at: string;
  updated_at: string;
};

export type GetFaqCandidatesRequest = { query: { status: FaqCandidateStatus; sort: FaqCandidateSort } };
export type GetFaqCandidatesResponse = {
  statusCode: number;
  message: string;
  data: { counts: Partial<Record<FaqCandidateStatus, number>>; candidates: FaqCandidate[] };
};

export type UpdateFaqCandidateRequest = { params: { id: string }; body: { status: FaqCandidateStatus } };
export type UpdateFaqCandidateResponse = { statusCode: number; message: string };
export type DeleteFaqCandidateRequest = { params: { id: string } };
export type DeleteFaqCandidateResponse = { statusCode: number; message: string };
