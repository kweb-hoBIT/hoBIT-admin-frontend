/**
 * 호빗 입력창 추천과 같은 규칙 (hoBIT-frontend/src/components/AutoComplete.tsx, hoBIT-backend/src/apis/keywordRules.ts)
 * — 관리자 화면의 "미리 해보기"가 실제 호빗과 똑같이 보이도록 같은 비교 방식을 씀
 */
export type RuleLike = { keyword: string; synonyms: string[] };

export const norm = (s: string) => s.toLowerCase().replace(/\s+/g, '');

/** "빌리다" → "빌리" — 동사는 어간으로 비교 */
export const stem = (s: string) => {
  const n = norm(s);
  return n.length >= 3 && n.endsWith('다') ? n.slice(0, -1) : n;
};

/** 입력에 대표 키워드·연관 단어가 들어 있거나, 두 글자 이상 입력이 그 단어의 앞부분이면 걸림 */
export function matchRules<R extends RuleLike>(rules: R[], input: string): { rule: R; word: string }[] {
  const text = norm(input);
  if (!text) return [];
  const out: { rule: R; word: string }[] = [];
  rules.forEach((rule) => {
    const word = [rule.keyword, ...rule.synonyms].find((w) => {
      const t = stem(w);
      return t.length > 0 && (text.includes(t) || (text.length >= 2 && t.startsWith(text)));
    });
    if (word) out.push({ rule, word });
  });
  return out;
}

/** 호빗 입력창 기본 추천: 입력 단어(띄어쓰기 단위)가 모두 들어간 FAQ 질문 */
export function tokenSuggestions(questions: string[], input: string): string[] {
  const tokens = input.split(/\s+/).filter(Boolean).map((t) => t.toLowerCase());
  if (!tokens.length) return [];
  return questions.filter((q) => tokens.every((t) => q.toLowerCase().includes(t)));
}
