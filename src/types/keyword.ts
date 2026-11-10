// 키워드 규칙 — 대표 키워드 + 연관 단어 + 고정 FAQ (관리자 백엔드 routes/api/keywords)
export type KeywordRule = {
  id: number;
  keyword: string;
  keyword_en: string | null; // 영어 대표 키워드 (예: computer science)
  synonyms: string[]; // 한국어 연관 단어
  synonyms_en: string[]; // 영어 단어·약어 (예전 줄의 synonyms 속 영어 단어도 서버가 여기로 옮겨 보냄)
  pinned_faq_ids: number[];
  pinned_faqs: { faq_id: number; question_ko: string | null; question_en?: string | null }[];
  search_sources: string[]; // 먼저 찾아볼 곳 (출처 이름)
  updated_at: string;
};

// '먼저 찾아볼 곳' 선택지 (RAG 서버 목록)
export type SearchSource = { id: string; label: string; group: 'static' | 'dynamic' };
export type GetSearchSourcesRequest = {};
export type GetSearchSourcesResponse = { statusCode: number; message: string; data: { sources: SearchSource[] } };

export type GetKeywordRulesRequest = {};
export type GetKeywordRulesResponse = {
  statusCode: number;
  message: string;
  data: { rules: KeywordRule[] };
};

type KeywordRuleBody = {
  keyword: string;
  keyword_en: string;
  synonyms: string[];
  synonyms_en: string[];
  pinned_faq_ids: number[];
  search_sources: string[];
};

export type CreateKeywordRuleRequest = { body: KeywordRuleBody };
export type CreateKeywordRuleResponse = { statusCode: number; message: string; data?: { id: number } };

export type UpdateKeywordRuleRequest = { params: { id: string }; body: KeywordRuleBody };
export type UpdateKeywordRuleResponse = { statusCode: number; message: string };

export type DeleteKeywordRuleRequest = { params: { id: string } };
export type DeleteKeywordRuleResponse = { statusCode: number; message: string };
