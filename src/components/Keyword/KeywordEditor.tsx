import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHobitMutatePostApi, useHobitMutatePutApi, useHobitQueryGetApi } from '../../hooks/hobitAdmin';
import {
  CreateKeywordRuleRequest,
  CreateKeywordRuleResponse,
  GetSearchSourcesRequest,
  GetSearchSourcesResponse,
  KeywordRule,
  UpdateKeywordRuleRequest,
  UpdateKeywordRuleResponse,
} from '../../types/keyword';
import { appAlert } from '../ui/Dialog';
import type { FaqOption } from './KeywordMain';
import Icon from '../ui/Icon';
import { isLatin, ruleWords } from './keywordMatch';

const MAX_PINNED = 3; // 학생 화면이 실제로 쓰는 개수와 같게 (엑셀도 3개)
const MAX_SOURCES = 6;
const MAX_WORDS = 50; // 한국어·영어 칸마다 (관리자 백엔드 keywordsIndex.ts MAX_SYNONYMS)

/** 연관 단어 입력 — Enter·쉼표로 추가, 빈 칸에서 Backspace로 마지막 단어 삭제, "a, b, c" 붙여넣기 */
export const ChipInput: React.FC<{ value: string[]; onChange: (v: string[]) => void; placeholder: string }> = ({ value, onChange, placeholder }) => {
  const [draft, setDraft] = useState('');
  const add = (raw: string) => {
    const words = raw.split(/[,，\n]/).map((w) => w.trim()).filter(Boolean);
    if (!words.length) return;
    onChange(Array.from(new Set([...value, ...words])));
    setDraft('');
  };
  return (
    <div className="flex min-h-[48px] flex-wrap items-center gap-1.5 rounded-xl border border-line px-2 py-1.5 focus-within:border-accent-ink focus-within:shadow-[0_0_0_3px_rgb(var(--c-accent-ink)/0.18)]">
      {value.map((w) => (
        <span key={w} className="flex items-center gap-1 rounded-full bg-card-2 py-1 pl-3 pr-1.5 text-sm text-ink">
          {w}
          <button
            type="button"
            aria-label={`${w} 빼기`}
            onClick={() => onChange(value.filter((x) => x !== w))}
            className="flex h-5 w-5 items-center justify-center rounded-full text-ink-3 hover:bg-card-3 hover:text-ink"
          >
            ×
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => {
          const v = e.target.value;
          if (/[,，]/.test(v)) add(v);
          else setDraft(v);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
            e.preventDefault();
            add(draft);
          } else if (e.key === 'Backspace' && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => add(draft)}
        onPaste={(e) => {
          const text = e.clipboardData.getData('text');
          if (/[,，\n]/.test(text)) {
            e.preventDefault();
            add(text);
          }
        }}
        placeholder={value.length ? '' : placeholder}
        className="min-w-[160px] flex-1 border-0 bg-transparent px-1 py-1 shadow-none outline-none focus-visible:shadow-none"
      />
    </div>
  );
};

/** 고정 FAQ 고르기 — 질문으로 검색해서 추가, 순서 바꾸기 */
const FaqPicker: React.FC<{ faqs: FaqOption[]; value: number[]; onChange: (v: number[]) => void; hint: string }> = ({
  faqs,
  value,
  onChange,
  hint,
}) => {
  const [q, setQ] = useState('');
  const byId = useMemo(() => new Map(faqs.map((f) => [f.faq_id, f])), [faqs]);
  const results = useMemo(() => {
    const tokens = (q.trim() || hint).split(/\s+/).filter(Boolean);
    if (!tokens.length) return [];
    return faqs.filter((f) => !value.includes(f.faq_id) && tokens.some((t) => f.question_ko.includes(t))).slice(0, 6);
  }, [q, hint, faqs, value]);

  const move = (i: number, d: -1 | 1) => {
    const next = [...value];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };

  return (
    <div>
      {value.length > 0 && (
        <ol className="mb-2 flex flex-col gap-1.5">
          {value.map((id, i) => (
            <li key={id} className="flex items-center gap-2 rounded-xl bg-card px-3 py-2 text-sm">
              <span className="inline-flex items-center gap-1 font-bold text-accent-ink"><Icon name="pin" className="h-3.5 w-3.5" />{i + 1}</span>
              <span className="min-w-0 flex-1 truncate text-ink">{byId.get(id)?.question_ko ?? `삭제된 FAQ (#${id})`}</span>
              <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="px-1.5 text-ink-3 hover:text-ink disabled:opacity-30" aria-label="위로">
                ↑
              </button>
              <button
                type="button"
                disabled={i === value.length - 1}
                onClick={() => move(i, 1)}
                className="px-1.5 text-ink-3 hover:text-ink disabled:opacity-30"
                aria-label="아래로"
              >
                ↓
              </button>
              <button type="button" onClick={() => onChange(value.filter((x) => x !== id))} className="px-1.5 text-ink-3 hover:text-danger" aria-label="빼기">
                ×
              </button>
            </li>
          ))}
        </ol>
      )}
      {value.length < MAX_PINNED && (
        <>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="FAQ 질문으로 찾기 (비워 두면 키워드로 찾아요)"
            className="w-full rounded-xl border border-line px-3 py-2.5 text-sm"
          />
          {results.length > 0 && (
            <ul className="mt-1.5 max-h-[220px] overflow-y-auto rounded-xl border border-line">
              {results.map((f) => (
                <li key={f.faq_id}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange([...value, f.faq_id]);
                      setQ('');
                    }}
                    className="flex w-full items-center gap-2 !rounded-none px-3 py-2 text-left text-sm hover:bg-card"
                  >
                    <span className="shrink-0 rounded-full bg-card-2 px-2 py-0.5 text-[11px] text-ink-2">{f.maincategory_ko}</span>
                    <span className="truncate text-ink">{f.question_ko}</span>
                    <span className="ml-auto shrink-0 text-xs font-semibold text-accent-ink">+ 고정</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

interface Props {
  rule: KeywordRule | null; // null = 새로 만들기
  rules: KeywordRule[];
  faqs: FaqOption[];
  onClose: () => void;
  onSaved: () => void;
}

const KeywordEditor: React.FC<Props> = ({ rule, rules, faqs, onClose, onSaved }) => {
  const [keyword, setKeyword] = useState(rule?.keyword ?? '');
  const [keywordEn, setKeywordEn] = useState(rule?.keyword_en ?? '');
  // 한국어 / 영어 칸을 따로 저장 (synonyms / synonyms_en). 예전 줄의 synonyms에 섞인 영어 단어는 영어 칸으로 — 저장하면 synonyms_en으로 옮겨짐
  const [synonyms, setSynonyms] = useState<string[]>((rule?.synonyms ?? []).filter((w) => !isLatin(w)));
  const [english, setEnglish] = useState<string[]>(
    Array.from(new Set([...(rule?.synonyms_en ?? []), ...(rule?.synonyms ?? []).filter((w) => isLatin(w))]))
  );
  // 한국어 칸에 영어 단어를 넣으면 영어 칸으로 옮김
  const setKoreanWords = (v: string[]) => {
    setSynonyms(v.filter((w) => !isLatin(w)));
    const moved = v.filter((w) => isLatin(w));
    if (moved.length) setEnglish((cur) => Array.from(new Set([...cur, ...moved])));
  };
  const [pinned, setPinned] = useState<number[]>(rule?.pinned_faq_ids ?? []);
  const [sources, setSources] = useState<string[]>(rule?.search_sources ?? []);
  const sourceApi = useHobitQueryGetApi<GetSearchSourcesRequest, GetSearchSourcesResponse>('keywords/sources');
  const sourceOptions = sourceApi.data?.payload?.data?.sources ?? [];
  const [saving, setSaving] = useState(false);
  const firstRef = useRef<HTMLInputElement>(null);
  const createApi = useHobitMutatePostApi<CreateKeywordRuleRequest, CreateKeywordRuleResponse>('keywords');
  const updateApi = useHobitMutatePutApi<UpdateKeywordRuleRequest, UpdateKeywordRuleResponse>('keywords');

  useEffect(() => {
    firstRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // 다른 규칙과 겹치는 단어 (같은 단어가 두 규칙에 있으면 둘 다 걸림 — 막지는 않고 알려줌)
  const overlaps = useMemo(() => {
    const key = (w: string) => w.trim().toLowerCase();
    const mine = new Set([keyword, keywordEn, ...synonyms, ...english].map(key).filter(Boolean));
    return rules
      .filter((r) => r.id !== rule?.id)
      .flatMap((r) => ruleWords(r).filter((w) => w && mine.has(key(w))).map((w) => `${w} (${r.keyword})`));
  }, [keyword, keywordEn, synonyms, english, rules, rule]);

  const save = async () => {
    const k = keyword.trim();
    if (!k) return appAlert('대표 키워드를 입력해주세요.');
    if (rules.some((r) => r.id !== rule?.id && r.keyword === k)) return appAlert(`"${k}"은(는) 이미 등록된 대표 키워드예요.`);
    const kEn = keywordEn.trim();
    const ko = synonyms.filter((s) => s !== k);
    const en = english.filter((s) => s.toLowerCase() !== kEn.toLowerCase());
    if (ko.length > MAX_WORDS) return appAlert(`연관 단어는 ${MAX_WORDS}개까지 등록할 수 있어요.`);
    if (en.length > MAX_WORDS) return appAlert(`영어 단어·약어는 ${MAX_WORDS}개까지 등록할 수 있어요.`);
    setSaving(true);
    const body = { keyword: k, keyword_en: kEn, synonyms: ko, synonyms_en: en, pinned_faq_ids: pinned, search_sources: sources };
    const res = rule ? await updateApi({ params: { id: String(rule.id) }, body }) : await createApi({ body });
    setSaving(false);
    if (res.payload?.statusCode === 200) onSaved();
    else appAlert('저장하지 못했어요. 입력을 확인하고 다시 시도해주세요.');
  };

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel max-w-[640px] max-h-[90vh] overflow-y-auto" role="dialog" aria-modal="true">
        <h2>{rule ? '키워드 수정' : '새 키워드'}</h2>

        {/* 한국어 — 한국어 모드 검색어·추천 */}
        <fieldset className="mt-5 rounded-2xl border border-line p-4">
          <legend className="px-1.5 text-xs font-bold text-ink-2">한국어</legend>
          <label className="block text-sm font-semibold text-ink">대표 키워드</label>
          <input
            ref={firstRef}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="예: 컴퓨터학과"
            maxLength={100}
            className="mt-1.5 w-full rounded-xl border border-line px-3 py-2.5"
          />

          <label className="mt-4 block text-sm font-semibold text-ink">연관 단어</label>
          <p className="mb-1.5 text-xs text-ink-3">학생이 이 단어로 물어도 대표 키워드로 찾아요. Enter나 쉼표로 추가. 영어 단어는 아래 English 칸으로 옮겨져요.</p>
          <ChipInput value={synonyms} onChange={setKoreanWords} placeholder="예: 컴학, 컴과" />
        </fieldset>

        {/* English — 영어 모드 검색어·추천 (한국어 질문에 든 영어 단어도 걸림) */}
        <fieldset className="mt-4 rounded-2xl border border-line p-4" lang="en">
          <legend className="px-1.5 text-xs font-bold text-ink-2">
            English <span className="font-normal text-ink-3">(선택)</span>
          </legend>
          <label className="block text-sm font-semibold text-ink">영어 대표 키워드</label>
          <p className="mb-1.5 text-xs text-ink-3">영어 모드에서 걸리면 이 말로 함께 찾고, 이 말이 든 영어 질문을 추천해요. 비우면 한국어 대표 키워드로 찾아요.</p>
          <input
            value={keywordEn}
            onChange={(e) => setKeywordEn(e.target.value)}
            placeholder="예: computer science"
            maxLength={100}
            className="w-full rounded-xl border border-line px-3 py-2.5"
          />

          <label className="mt-4 block text-sm font-semibold text-ink">영어 단어·약어</label>
          <p className="mb-1.5 text-xs text-ink-3">
            대소문자 상관없이 단어 단위로 비교해요 (“cs”는 “CS 졸업요건”에는 걸리고 “physics”에는 안 걸려요). 입력창 추천은 세 글자부터 앞부분으로도 찾아요 (“comp” → comp sci).
          </p>
          <ChipInput value={english} onChange={setEnglish} placeholder="예: cs, comp sci" />
        </fieldset>
        {overlaps.length > 0 && <p className="mt-1.5 text-xs text-warn">다른 키워드에도 있는 단어: {overlaps.join(', ')}</p>}

        <label className="mt-5 block text-sm font-semibold text-ink">
          맨 위에 고정할 질문 <span className="font-normal text-ink-3">(최대 {MAX_PINNED}개, 위에서부터 순서대로)</span>
        </label>
        <p className="mb-1.5 text-xs text-ink-3">예: “현장실습” → “현장실습이 궁금해!”가 추천 첫 번째로</p>
        <FaqPicker faqs={faqs} value={pinned} onChange={setPinned} hint={keyword.trim()} />

        <label className="mt-5 block text-sm font-semibold text-ink">
          먼저 찾아볼 곳 <span className="font-normal text-ink-3">(선택, 최대 {MAX_SOURCES}개)</span>
        </label>
        <p className="mb-1.5 text-xs text-ink-3">
          이 키워드로 질문하면 고른 자료에서 먼저 찾아 답변 근거로 써요. 예: “휴학” → 학사 운영 규정, 홈페이지 · 학사안내
        </p>
        {sourceOptions.length === 0 ? (
          <p className="text-xs text-ink-3">선택지를 불러오지 못했어요 (챗봇 서버 확인 필요). 저장된 값은 그대로 유지돼요.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {sourceOptions.map((o) => {
              const on = sources.includes(o.id);
              return (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() =>
                    setSources((cur) =>
                      on ? cur.filter((x) => x !== o.id) : cur.length >= MAX_SOURCES ? cur : [...cur, o.id]
                    )
                  }
                  className={`rounded-full border px-3 py-1 text-sm ${on ? 'border-accent bg-accent text-white' : 'border-line text-ink-2 hover:bg-card'}`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2 [&>button]:flex-1 sm:[&>button]:flex-none">
          <button type="button" onClick={onClose} className="rounded-xl bg-card px-5 py-2.5 font-semibold text-ink-2 hover:bg-card-2">
            취소
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-xl bg-accent px-6 py-2.5 font-semibold text-white hover:bg-accent/90 disabled:opacity-60"
          >
            {saving ? '저장 중…' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeywordEditor;
