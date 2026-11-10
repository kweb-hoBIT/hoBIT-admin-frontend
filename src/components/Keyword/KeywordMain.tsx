import React, { useMemo, useState } from 'react';
import { useHobitMutateDeleteApi, useHobitQueryGetApi } from '../../hooks/hobitAdmin';
import { GetAllFAQRequest, GetAllFAQResponse } from '../../types/faq';
import {
  DeleteKeywordRuleRequest,
  DeleteKeywordRuleResponse,
  GetKeywordRulesRequest,
  GetKeywordRulesResponse,
  KeywordRule,
} from '../../types/keyword';
import { appAlert, appConfirm } from '../ui/Dialog';
import KeywordEditor from './KeywordEditor';
import { matchRules, tokenSuggestions } from './keywordMatch';
import Icon from '../ui/Icon';
import { revealRef } from '../ui/motion';

export type FaqOption = { faq_id: number; question_ko: string; question_en: string; maincategory_ko: string };

/** 호빗 입력창에서 이 질문을 쳤을 때 추천 목록이 어떻게 나오는지 — 실제 호빗과 같은 규칙 (한국어 / 영어 모드) */
const Tester: React.FC<{ rules: KeywordRule[]; faqs: FaqOption[] }> = ({ rules, faqs }) => {
  const [input, setInput] = useState('');
  const [en, setEn] = useState(false);
  const questions = useMemo(() => faqs.map((f) => (en ? f.question_en : f.question_ko)).filter(Boolean), [faqs, en]);
  const byId = useMemo(() => new Map(faqs.map((f) => [f.faq_id, f])), [faqs]);
  const matched = matchRules(rules, input);
  // 영어 모드는 고정 FAQ의 영어 질문, 영어 대표 키워드가 든 영어 질문 (호빗 영어 모드와 같음)
  const pinned = matched.flatMap(
    (m) =>
      m.rule.pinned_faqs
        .map((p) => (en ? p.question_en ?? byId.get(p.faq_id)?.question_en : p.question_ko))
        .filter(Boolean) as string[]
  );
  const base = tokenSuggestions(questions, input);
  const expanded = matched.flatMap((m) =>
    en ? (m.rule.keyword_en ? tokenSuggestions(questions, m.rule.keyword_en) : []) : tokenSuggestions(questions, m.rule.keyword)
  );
  const list = Array.from(new Set([...pinned, ...base, ...expanded])).slice(0, 8);
  const pinnedSet = new Set(pinned);

  return (
    <section className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-bold text-ink">미리 해보기</h2>
        <div className="flex gap-1" role="group" aria-label="호빗 언어">
          {[
            { on: false, label: '한국어' },
            { on: true, label: 'English' },
          ].map((o) => (
            <button
              key={o.label}
              type="button"
              aria-pressed={en === o.on}
              onClick={() => setEn(o.on)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${en === o.on ? 'border-accent bg-accent text-white' : 'border-line text-ink-2 hover:bg-card'}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-3 mt-1 text-sm text-ink-2">
        학생이 호빗 입력창({en ? '영어 모드' : '한국어 모드'})에 이렇게 치면 추천 질문이 아래처럼 떠요.
      </p>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={en ? '예: cs graduation requirements' : '예: 이공계 계열만 지원 가능해?'}
        className="w-full rounded-xl border border-line px-3 py-2.5"
      />
      {input.trim() && (
        <div className="mt-4">
          {matched.length > 0 ? (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {matched.map((m) => (
                <span key={m.rule.id} className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent-ink dark:bg-accent-ink/15">
                  “{m.word}” → {en ? m.rule.keyword_en || m.rule.keyword : m.rule.keyword}
                </span>
              ))}
            </div>
          ) : (
            <p className="mb-3 text-xs text-ink-3">걸리는 키워드 규칙이 없어요 (기본 추천만 떠요)</p>
          )}
          {list.length ? (
            <ol className="flex flex-col divide-y divide-line rounded-xl border border-line">
              {list.map((q) => (
                <li key={q} ref={revealRef} className="flex items-center gap-2 px-3 py-2.5 text-sm">
                  {pinnedSet.has(q) && <Icon name="pin" className="h-3.5 w-3.5 text-accent-ink" title="고정된 추천 질문" />}
                  <span className={pinnedSet.has(q) ? 'font-semibold text-ink' : 'text-ink-2'}>{q}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-ink-3">추천 질문이 없어요</p>
          )}
        </div>
      )}
    </section>
  );
};

const KeywordMain: React.FC = () => {
  const rulesApi = useHobitQueryGetApi<GetKeywordRulesRequest, GetKeywordRulesResponse>('keywords');
  const faqsApi = useHobitQueryGetApi<GetAllFAQRequest, GetAllFAQResponse>('faqs');
  const deleteApi = useHobitMutateDeleteApi<DeleteKeywordRuleRequest, DeleteKeywordRuleResponse>('keywords');
  const [editing, setEditing] = useState<KeywordRule | 'new' | null>(null);
  const [query, setQuery] = useState('');

  const rules = useMemo(() => rulesApi.data?.payload?.data?.rules ?? [], [rulesApi.data]);
  const faqs: FaqOption[] = useMemo(
    () =>
      (faqsApi.data?.payload?.data?.faqs ?? []).map((f) => ({
        faq_id: f.faq_id,
        question_ko: f.question_ko,
        question_en: f.question_en,
        maincategory_ko: f.maincategory_ko,
      })),
    [faqsApi.data]
  );

  // 검색어나 규칙이 바뀔 때만 다시 거름
  const shown = useMemo(() => {
    const q = query.trim();
    if (!q) return rules;
    const lq = q.toLowerCase();
    return rules.filter((r) =>
      [r.keyword, r.keyword_en ?? '', ...r.synonyms, ...(r.synonyms_en ?? []), ...r.pinned_faqs.map((p) => p.question_ko || '')].some((w) =>
        w.toLowerCase().includes(lq)
      )
    );
  }, [rules, query]);

  const remove = async (rule: KeywordRule) => {
    if (!(await appConfirm(`"${rule.keyword}" 키워드 규칙을 삭제할까요?`, { danger: true }))) return;
    const res = await deleteApi({ params: { id: String(rule.id) } });
    if (res.payload?.statusCode === 200) rulesApi.refetch();
    else appAlert('삭제하지 못했어요. 다시 시도해주세요.');
  };

  return (
    <div className="pb-8 pt-6">
      {/* 제목 왼쪽, [새 키워드] 오른쪽 — 휴대폰에서도 버튼이 혼자 다음 줄로 내려가지 않게 */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-ink">키워드</h1>
          <p className="mt-1 text-sm text-ink-3">
            호빗 입력창 추천에서 <b className="text-ink">맨 위에 고정할 질문</b>과, 같은 뜻으로 묶을 <b className="text-ink">연관 단어</b>를 정해요.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing('new')}
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent px-4 py-2.5 font-semibold text-white hover:bg-accent/90 sm:px-5"
        >
          <Icon name="plus" />
          새 키워드
        </button>
      </div>

      {/* lg 미만: 목록 아래에 미리 해보기 */}
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="panel !my-0">
          <div className="flex items-center gap-3 border-b border-line px-4 py-3 sm:px-5">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="키워드·연관 단어·질문으로 찾기"
              className="w-full min-w-0 rounded-xl border border-line px-3 py-2 text-sm sm:w-72"
            />
            <span className="ml-auto text-sm text-ink-3">{rules.length}개</span>
          </div>

          {rulesApi.isLoading ? (
            <div className="space-y-3 p-5">
              {[0, 1, 2].map((i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-card" />)}
            </div>
          ) : shown.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <p className="font-semibold text-ink">{rules.length ? '찾는 키워드가 없어요' : '아직 등록된 키워드가 없어요'}</p>
              {!rules.length && (
                <p className="mt-2 text-sm text-ink-2">
                  예) <b>입시</b> ← 수시, 정시, 입학, 이공계, 인문계, 계열 · <b>대관</b> ← 대여, 빌리다, 강의실, 교실
                </p>
              )}
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {shown.map((rule) => (
                <li
                  key={rule.id}
                  ref={revealRef}
                  className="group flex flex-col gap-2 px-4 py-4 hover:bg-card/50 sm:flex-row sm:gap-4 sm:px-5"
                >
                    <div className="shrink-0 sm:w-36">
                      <p className="text-lg font-bold text-ink">{rule.keyword}</p>
                      {rule.keyword_en && <p className="text-sm font-semibold text-ink-2">{rule.keyword_en}</p>}
                      <p className="text-xs text-ink-3">
                        연관 단어 {rule.synonyms.length}개{(rule.synonyms_en ?? []).length > 0 && ` · 영어 ${(rule.synonyms_en ?? []).length}개`}
                      </p>
                    </div>
                    <div className="min-w-0 flex-1">
                      {rule.synonyms.length + (rule.synonyms_en ?? []).length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-1.5">
                          {rule.synonyms.map((s) => (
                            <span key={s} className="rounded-full bg-card px-2.5 py-1 text-xs font-medium text-ink-2">
                              {s}
                            </span>
                          ))}
                          {/* 영어 단어는 테두리로 구분 */}
                          {(rule.synonyms_en ?? []).map((s) => (
                            <span key={`en-${s}`} lang="en" className="rounded-full border border-line px-2.5 py-1 text-xs font-medium text-ink-2">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                      {rule.pinned_faqs.length > 0 ? (
                        <ul className="space-y-1">
                          {rule.pinned_faqs.map((p, order) => (
                            <li key={p.faq_id} className="flex items-center gap-2 text-sm">
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-accent-ink"><Icon name="pin" className="h-3.5 w-3.5" />{order + 1}</span>
                              <span className={p.question_ko ? 'text-ink' : 'text-danger'}>
                                {p.question_ko ?? `삭제된 FAQ (#${p.faq_id})`}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-ink-3">고정 질문 없음 (연관 단어로만 찾음)</p>
                      )}
                    </div>
                    {/* 마우스가 있는 기기에서만 흐리게 두고 올리면 진하게 — 휴대폰은 항상 진하게 */}
                    <div className="flex shrink-0 items-start gap-1 transition-opacity group-hover:opacity-100 [@media(hover:hover)]:opacity-60">
                      <button
                        type="button"
                        onClick={() => setEditing(rule)}
                        className="min-h-[40px] rounded-full px-3 py-1.5 text-sm font-semibold text-ink hover:bg-card-2 sm:min-h-0"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(rule)}
                        className="min-h-[40px] rounded-full px-3 py-1.5 text-sm font-semibold text-danger hover:bg-danger-soft sm:min-h-0"
                      >
                        삭제
                      </button>
                    </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="flex flex-col gap-4 lg:sticky lg:top-20">
          <Tester rules={rules} faqs={faqs} />
          <section className="rounded-2xl border border-line bg-surface p-5 text-sm text-ink-2">
            <h2 className="mb-2 font-bold text-ink">어떻게 동작하나요?</h2>
            <ul className="list-disc space-y-1.5 pl-4">
              <li>학생 입력에 <b className="text-ink">대표 키워드나 연관 단어</b>가 있으면 고정 질문이 추천 맨 위에 떠요.</li>
              <li>연관 단어로 입력해도 대표 키워드가 든 질문까지 함께 추천해요. (대여 → 대관 질문)</li>
              <li>질문을 보냈을 때도 대표 키워드로 함께 찾고, 고정 FAQ를 답변 근거로 넣어요.</li>
              <li>
                영어 모드에서는 <b className="text-ink">영어 대표 키워드</b>로 찾아요. (cs → computer science가 든 영어 질문) 한국어 질문에 든 영어 단어(“CS 졸업요건”)도 걸려요.
              </li>
              <li>동사는 기본형으로 넣으면 어간으로 비교해요. (빌리다 → “빌리고”, “빌리는”) 활용형이 다르면 따로 추가해 주세요. (빌려)</li>
              <li>저장하면 1분 안에 호빗에 반영돼요.</li>
            </ul>
          </section>
        </div>
      </div>

      {editing && (
        <KeywordEditor
          rule={editing === 'new' ? null : editing}
          rules={rules}
          faqs={faqs}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            rulesApi.refetch();
          }}
        />
      )}
    </div>
  );
};

export default KeywordMain;
