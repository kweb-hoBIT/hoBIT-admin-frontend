// 키워드 규칙 — 대표 키워드 + 연관 단어 + 고정 FAQ (관리자 백엔드 routes/api/keywords)
export type KeywordRule = {
  id: number;
  keyword: string;
  synonyms: string[];
  pinned_faq_ids: number[];
  pinned_faqs: { faq_id: number; question_ko: string | null }[];
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

type KeywordRuleBody = { keyword: string; synonyms: string[]; pinned_faq_ids: number[]; search_sources: string[] };

export type CreateKeywordRuleRequest = { body: KeywordRuleBody };
export type CreateKeywordRuleResponse = { statusCode: number; message: string; data?: { id: number } };

export type UpdateKeywordRuleRequest = { params: { id: string }; body: KeywordRuleBody };
export type UpdateKeywordRuleResponse = { statusCode: number; message: string };

export type DeleteKeywordRuleRequest = { params: { id: string } };
export type DeleteKeywordRuleResponse = { statusCode: number; message: string };
