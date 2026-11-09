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
  topic_id: string | null; // 주제 (호빗 RAG가 정함 — 주제 지도 단어 → 가까운 FAQ 분류 → AI), 비어 있으면 기타
  topic_name: string | null;
  subtopic: string | null;
  question_count: number; // 저장된 학생 원문 수
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

export type FaqCandidateSubtopic = { name: string; count: number; candidates: FaqCandidate[] };
export type FaqCandidateTopic = {
  topic: { id: string; name: string };
  count: number; // 물은 횟수 합
  candidates_count: number;
  subtopics: FaqCandidateSubtopic[];
};
export type GetFaqCandidateTopicsRequest = { params: { sub: 'topics' }; query: { status: FaqCandidateStatus } };
export type GetFaqCandidateTopicsResponse = {
  statusCode: number;
  message: string;
  data: { counts: Partial<Record<FaqCandidateStatus, number>>; total: number; topics: FaqCandidateTopic[] };
};

export type FaqCandidateQuestion = { id: number; text: string; language: string; asked_at: string | null };
export type GetFaqCandidateQuestionsRequest = { params: { id: string; sub: 'questions' }; query: { offset: number; limit: number } };
export type GetFaqCandidateQuestionsResponse = {
  statusCode: number;
  message: string;
  data: { total: number; questions: FaqCandidateQuestion[] };
};
