import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { hobitGetApi } from '../../api/api';
import { useHobitMutatePutApi, useHobitQueryGetApi } from '../../hooks/hobitAdmin';
import {
  AnswerReview,
  GetAnswerReviewsRequest,
  GetAnswerReviewsResponse,
  GetAnswerTraceRequest,
  GetAnswerTraceResponse,
  ReviewCause,
  ReviewType,
  TraceResult,
  UpdateAnswerReviewRequest,
  UpdateAnswerReviewResponse,
} from '../../types/answerReview';
import { appAlert } from '../ui/Dialog';
import Icon from '../ui/Icon';
import { revealRef } from '../ui/motion';
import { LoadError } from '../ui/ListKit';
import MiniMarkdown from '../ui/MiniMarkdown';

const TABS: { type: ReviewType; label: string; icon?: 'thumbsDown'; hint: string }[] = [
  { type: 'down', label: '받은 답변', icon: 'thumbsDown', hint: '학생이 도움이 안 됐다고 한 답변이에요. 남긴 이유와 근거를 보고 원인을 골라 주세요.' },
  { type: 'not_found', label: '답을 못 찾은 질문', hint: '자료에서 답을 찾지 못한 질문이에요. 자료가 없으면 FAQ를 만들어 주세요.' },
  { type: 'grounding', label: '근거 없는 숫자 삭제', hint: 'AI 답변에 자료(근거)에 없는 날짜·금액·연락처 등이 있어서 그 줄을 빼고 보낸 답변이에요. AI가 지어냈는지, 자료가 부족했는지 확인해 주세요.' },
];

// 원인 — 고친 방법을 정하는 기준 (통계로 무엇을 먼저 고칠지 봄)
const CAUSES: { value: ReviewCause; label: string; tip: string }[] = [
  { value: 'no_data', label: '자료 없음', tip: 'FAQ를 만들거나 홈페이지·공지에 없는 내용' },
  { value: 'outdated', label: '오래된 자료', tip: 'FAQ·안내가 지금과 다름 — FAQ 수정' },
  { value: 'wrong_answer', label: '답이 틀림', tip: '근거는 맞는데 AI가 잘못 답함' },
  { value: 'bad_search', label: '엉뚱한 자료', tip: '맞는 자료가 있는데 다른 자료를 봄 — 키워드 규칙 등' },
  { value: 'ok', label: '문제 없음', tip: '답이 맞음 (학생 오해·장난 등)' },
];

const TOPIC_LABEL: Record<string, string> = {
  academic_status: '학적', courses: '수업', graduation: '졸업', majors: '전공', scholarship: '장학·등록',
  career: '진로', exchange: '교환', facilities: '시설', office: '행정', safety: '안전·교육', student_life: '학생 활동',
  faculty: '교수·연구', notices: '공지',
};

/** '날짜 11.4', '숫자 30학점' → 종류와 값 (RAG grounding.py가 만드는 형식) — 날짜는 '11월 4일'처럼 */
const KIND_LABEL: Record<string, string> = { 날짜: '날짜', 금액: '금액', 전화: '전화번호', 메일: '이메일', 숫자: '숫자', 시각: '시각' };
const parseIssues = (s: string) =>
  s.split(/,\s*(?=(?:날짜|금액|전화|메일|숫자|시각)\s)/).map((raw) => {
    const m = raw.trim().match(/^(\S+)\s+(.+)$/);
    const kind = m?.[1] ?? '';
    let value = m?.[2] ?? raw.trim();
    if (kind === '날짜') {
      const d = value.split('.').map(Number);
      value = d.length === 3 ? `${d[0]}년 ${d[1]}월 ${d[2]}일` : d.length === 2 ? `${d[0]}월 ${d[1]}일` : value;
    }
    return { kind: KIND_LABEL[kind] ?? kind, value };
  });

/** 검색 경로 'A | B | C' → 짧은 칩 */
const parseRoutes = (s: string) => s.split(/\s*\|\s*/).filter(Boolean);

const when = (iso: string) => new Date(iso).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const Trace: React.FC<{ id: number }> = ({ id }) => {
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [results, setResults] = useState<TraceResult[] | null>(null);
  const [error, setError] = useState('');
  const load = async () => {
    setState('loading');
    const res = await hobitGetApi<GetAnswerTraceRequest, GetAnswerTraceResponse>('answer-reviews', { params: { id: String(id), sub: 'trace' } });
    if (res.payload?.statusCode === 200) {
      setResults(res.payload.data.results);
      setState('idle');
    } else {
      setError((res.payload as any)?.message ?? '검색 기록을 가져오지 못했어요');
      setState('error');
    }
  };
  if (!results) {
    return (
      <div className="mt-2">
        <button type="button" onClick={load} disabled={state === 'loading'} className="text-sm text-link underline">
          {state === 'loading' ? '불러오는 중…' : 'AI가 본 근거 전체 보기'}
        </button>
        {state === 'error' && <p className="mt-1 text-xs text-ink-3">{error}</p>}
      </div>
    );
  }
  return (
    <ol className="mt-2 flex flex-col gap-2">
      {results.map((r) => (
        <li key={r.source_id} className={`rounded-xl border px-3 py-2 text-sm ${r.cited ? 'border-accent/40 bg-accent/5' : 'border-line'}`}>
          <p className="text-ink-2">
            <span className="font-semibold">{r.source_id}</span> · {r.label}
            {r.cited && <span className="ml-1 rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-white">답변에 인용</span>}
          </p>
          <p className="mt-0.5 font-medium text-ink">
            {r.link ? <a href={r.link} target="_blank" rel="noreferrer" className="underline">{r.title || '(제목 없음)'}</a> : r.title}
          </p>
          <p className="mt-1 whitespace-pre-wrap text-xs text-ink-3">{r.text}</p>
        </li>
      ))}
    </ol>
  );
};

const ReviewCard: React.FC<{ item: AnswerReview; done: boolean; onChanged: () => void }> = ({ item, done, onChanged }) => {
  const update = useHobitMutatePutApi<UpdateAnswerReviewRequest, UpdateAnswerReviewResponse>('answer-reviews');
  const [cause, setCause] = useState<ReviewCause | null>(item.review_cause);
  const [open, setOpen] = useState(false);
  const answer = item.answer ?? '';

  const save = async (status: 'done' | 'ignored' | 'open') => {
    if (status === 'done' && !cause) return appAlert('원인을 먼저 골라 주세요.');
    const res = await update({ params: { id: String(item.id) }, body: { status, cause: status === 'open' ? null : cause } });
    if (res.payload?.statusCode === 200) onChanged();
    else appAlert('저장하지 못했어요.');
  };

  return (
    <li ref={revealRef} className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-ink-3">
        <span>{when(item.created_at)}</span>
        {item.feedback_score === -1 && <span className="inline-flex items-center rounded-full bg-danger-soft px-2 py-0.5 font-semibold text-danger"><Icon name="thumbsDown" className="h-3.5 w-3.5" title="도움 안 됨" /></span>}
        {item.answer_status === 'not_found' && <span className="rounded-full bg-card px-2 py-0.5">못 찾음</span>}
        {item.grounding_issues && <span className="rounded-full bg-warn-soft px-2 py-0.5 font-semibold text-warn">일부 내용 뺌</span>}
        {/* 주제를 규칙/AI 중 무엇이 정했는지는 칩 대신 마우스를 올리면 보이게 (관리자에게는 주제만 중요) */}
        {item.topic && (
          <span className="rounded-full bg-card px-2 py-0.5" title={item.classified_by ? `주제를 ${item.classified_by === 'rule' ? '규칙이' : 'AI가'} 정했어요` : undefined}>
            {TOPIC_LABEL[item.topic] ?? item.topic}
          </span>
        )}
        {item.latency_ms != null && <span>· 답변 {(item.latency_ms / 1000).toFixed(1)}초</span>}
      </div>
      <p className="mt-2 text-lg font-semibold text-ink">{item.user_question}</p>
      {(item.feedback_reason || item.feedback_detail) && (
        <p className="mt-1 text-sm text-danger">
          학생 의견: {[item.feedback_reason, item.feedback_detail].filter(Boolean).join(' · ')}
        </p>
      )}
      {item.grounding_issues && (
        <div className="mt-3 rounded-xl border border-warn/30 bg-warn-soft/60 px-4 py-3">
          <p className="text-sm font-semibold text-warn">학생에게 보낼 때 뺀 내용</p>
          <p className="mt-0.5 text-xs text-ink-2">
            AI 답변에 아래 값이 있었는데 참고한 자료에서는 찾지 못했어요. 잘못된 정보일 수 있어 그 값이 들어간 줄을 지우고 보냈어요.
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {parseIssues(item.grounding_issues).map((it, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-lg bg-surface px-2 py-1 text-sm text-ink">
                {it.kind && <span className="text-xs text-ink-3">{it.kind}</span>}
                <span className="font-semibold">{it.value}</span>
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs text-ink-3">
            자료에 원래 있는 값이면 <b className="text-ink-2">엉뚱한 자료</b>나 <b className="text-ink-2">자료 없음</b>(FAQ 만들기), AI가 지어낸 값이면 <b className="text-ink-2">답이 틀림</b>을 골라 주세요.
          </p>
        </div>
      )}

      <div className="mt-3 rounded-xl bg-card px-4 py-3 text-sm text-ink-2">
        <p className="mb-1.5 text-xs font-semibold text-ink-3">{item.grounding_issues ? '학생이 받은 답변 (뺀 뒤)' : '학생이 받은 답변'}</p>
        <div className={`relative ${!open && answer.length > 280 ? 'max-h-[10.5rem] overflow-hidden' : ''}`}>
          <MiniMarkdown text={answer} />
          {!open && answer.length > 280 && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-card to-transparent" />}
        </div>
        {answer.length > 280 && (
          <button type="button" onClick={() => setOpen(!open)} className="mt-1.5 text-xs text-link underline">
            {open ? '접기' : '답변 전체 보기'}
          </button>
        )}
      </div>

      {item.cited_sources.length > 0 && (
        <p className="mt-2 text-sm text-ink-2">
          인용한 근거:{' '}
          {item.cited_sources.map((s, i) => (
            <span key={s.id}>
              {i > 0 && ', '}
              {s.link ? <a href={s.link} target="_blank" rel="noreferrer" className="underline">{s.title || s.label}</a> : s.title || s.label}
            </span>
          ))}
        </p>
      )}
      {item.routes && (
        <div className="mt-1.5 flex flex-wrap items-center gap-1 text-xs text-ink-3">
          <span>자료를 찾은 방법</span>
          {parseRoutes(item.routes).map((r) => (
            <span key={r} className="rounded-full bg-card px-2 py-0.5">{r}</span>
          ))}
        </div>
      )}
      {item.trace_id && <Trace id={item.id} />}

      <p className="mt-4 border-t border-line pt-3 text-sm font-semibold text-ink">무엇이 문제였나요?</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {CAUSES.map((c) => (
          <button
            key={c.value}
            type="button"
            title={c.tip}
            onClick={() => setCause(c.value)}
            disabled={done}
            className={`min-h-[40px] rounded-full border px-3 py-1 text-sm sm:min-h-0 ${cause === c.value ? 'border-accent bg-accent text-white' : 'border-line text-ink-2 hover:bg-card'}`}
          >
            {c.label}
          </button>
        ))}
        <span className="flex-1" />
        <Link to={`/faqs/create?question=${encodeURIComponent(item.user_question)}`} className="inline-flex min-h-[40px] items-center rounded-lg border border-line px-3 py-1.5 text-sm text-ink-2 hover:bg-card sm:min-h-0">
          FAQ 만들기
        </Link>
        {done ? (
          <button type="button" onClick={() => save('open')} className="min-h-[40px] rounded-lg border border-line px-3 py-1.5 text-sm text-ink-2 sm:min-h-0">
            다시 확인할 목록으로
          </button>
        ) : (
          <button type="button" onClick={() => save(cause === 'ok' ? 'ignored' : 'done')} className="min-h-[40px] rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-white sm:min-h-0">
            처리 완료
          </button>
        )}
      </div>
      {/* 고른 원인의 뜻 — 휴대폰에는 마우스 올림(title)이 없어서 글로 */}
      <p className="mt-1.5 min-h-[1.25rem] text-xs text-ink-3">
        {cause ? CAUSES.find((c) => c.value === cause)?.tip : '원인을 고른 뒤 처리 완료를 눌러 주세요.'}
      </p>
    </li>
  );
};

const AnswerReviewMain: React.FC = () => {
  const [type, setType] = useState<ReviewType>('down');
  const [status, setStatus] = useState<'open' | 'done'>('open');
  const api = useHobitQueryGetApi<GetAnswerReviewsRequest, GetAnswerReviewsResponse>('answer-reviews', {
    query: { type, status, days: 30 },
  });
  const data = api.data?.payload?.data;
  const items = data?.items ?? [];
  const tab = TABS.find((t) => t.type === type)!;

  return (
    <div className="pb-8 pt-6">
      <h1 className="text-xl font-bold text-ink">답변 확인</h1>
      <p className="mt-1 text-sm text-ink-3">최근 30일 동안 확인이 필요한 AI 답변이에요. 원인을 골라 처리하면 무엇을 고칠지 정할 수 있어요.</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.type}
            type="button"
            onClick={() => setType(t.type)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${type === t.type ? 'bg-accent text-white' : 'bg-card text-ink-2 hover:bg-card-2'}`}
          >
            {t.icon && <Icon name={t.icon} className="mr-1.5 h-[1.05em] w-[1.05em]" />}
            {t.label}
            {data?.counts?.[t.type] ? ` ${data.counts[t.type]}` : ''}
          </button>
        ))}
        <span className="flex-1" />
        <button type="button" onClick={() => setStatus(status === 'open' ? 'done' : 'open')} className="text-sm text-ink-3 underline">
          {status === 'open' ? '처리한 답변 보기' : '확인할 답변 보기'}
        </button>
      </div>
      <p className="mt-3 text-sm text-ink-3">{tab.hint}</p>

      {api.isLoading ? (
        // 답변 카드 모양 자리
        <ul className="mt-4 flex flex-col gap-4" aria-busy="true" aria-label="불러오는 중">
          {[0, 1, 2].map((i) => (
            <li key={i} className="animate-pulse rounded-2xl border border-line bg-surface p-4 sm:p-5">
              <div className="h-3 w-40 rounded bg-card" />
              <div className="mt-3 h-6 w-2/3 rounded bg-card" />
              <div className="mt-3 h-20 rounded-xl bg-card" />
            </li>
          ))}
        </ul>
      ) : !data ? (
        <LoadError message="답변 목록을 불러오지 못했어요." onRetry={() => api.refetch()} />
      ) : items.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-line p-8 text-center text-ink-3">
          {status === 'open' ? '확인할 답변이 없어요' : '처리한 답변이 없어요'}
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-4">
          {items.map((it) => (
            <ReviewCard key={it.id} item={it} done={status === 'done'} onChanged={() => api.refetch()} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default AnswerReviewMain;
