import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHobitMutatePostApi, useHobitMutatePutApi } from '../../hooks/hobitAdmin';
import {
  CreateKeywordRuleRequest,
  CreateKeywordRuleResponse,
  KeywordRule,
  UpdateKeywordRuleRequest,
  UpdateKeywordRuleResponse,
} from '../../types/keyword';
import { appAlert } from '../ui/Dialog';
import type { FaqOption } from './KeywordMain';

const MAX_PINNED = 5;

/** 연관 단어 입력 — Enter·쉼표로 추가, 빈 칸에서 Backspace로 마지막 단어 삭제, "a, b, c" 붙여넣기 */
const ChipInput: React.FC<{ value: string[]; onChange: (v: string[]) => void; placeholder: string }> = ({ value, onChange, placeholder }) => {
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
              <span className="font-bold text-accent-ink">📌 {i + 1}</span>
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
  const [synonyms, setSynonyms] = useState<string[]>(rule?.synonyms ?? []);
  const [pinned, setPinned] = useState<number[]>(rule?.pinned_faq_ids ?? []);
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
    const mine = new Set([keyword.trim(), ...synonyms]);
    return rules
      .filter((r) => r.id !== rule?.id)
      .flatMap((r) => [r.keyword, ...r.synonyms].filter((w) => mine.has(w)).map((w) => `${w} (${r.keyword})`));
  }, [keyword, synonyms, rules, rule]);

  const save = async () => {
    const k = keyword.trim();
    if (!k) return appAlert('대표 키워드를 입력해주세요.');
    if (rules.some((r) => r.id !== rule?.id && r.keyword === k)) return appAlert(`"${k}"은(는) 이미 등록된 대표 키워드예요.`);
    setSaving(true);
    const body = { keyword: k, synonyms: synonyms.filter((s) => s !== k), pinned_faq_ids: pinned };
    const res = rule ? await updateApi({ params: { id: String(rule.id) }, body }) : await createApi({ body });
    setSaving(false);
    if (res.payload?.statusCode === 200) onSaved();
    else appAlert('저장하지 못했어요. 입력을 확인하고 다시 시도해주세요.');
  };

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel max-w-[640px] max-h-[90vh] overflow-y-auto" role="dialog" aria-modal="true">
        <h2>{rule ? '키워드 수정' : '새 키워드'}</h2>

        <label className="mt-5 block text-sm font-semibold text-ink">대표 키워드</label>
        <input
          ref={firstRef}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="예: 입시"
          maxLength={100}
          className="mt-1.5 w-full rounded-xl border border-line px-3 py-2.5"
        />

        <label className="mt-5 block text-sm font-semibold text-ink">연관 단어</label>
        <p className="mb-1.5 text-xs text-ink-3">학생이 이 단어로 물어도 대표 키워드로 찾아요. Enter나 쉼표로 추가.</p>
        <ChipInput value={synonyms} onChange={setSynonyms} placeholder="예: 수시, 정시, 입학, 이공계, 인문계, 계열" />
        {overlaps.length > 0 && <p className="mt-1.5 text-xs text-warn">다른 키워드에도 있는 단어: {overlaps.join(', ')}</p>}

        <label className="mt-5 block text-sm font-semibold text-ink">
          맨 위에 고정할 질문 <span className="font-normal text-ink-3">(최대 {MAX_PINNED}개, 위에서부터 순서대로)</span>
        </label>
        <p className="mb-1.5 text-xs text-ink-3">예: “현장실습” → “현장실습이 궁금해!”가 추천 첫 번째로</p>
        <FaqPicker faqs={faqs} value={pinned} onChange={setPinned} hint={keyword.trim()} />

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="bg-card px-5 py-2.5 font-semibold text-ink-2 hover:bg-card-2">
            취소
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="bg-accent px-6 py-2.5 font-semibold text-white hover:bg-accent/90 disabled:opacity-60"
          >
            {saving ? '저장 중…' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeywordEditor;
