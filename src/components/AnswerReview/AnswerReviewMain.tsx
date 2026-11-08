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
    <li className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-ink-3">
        <span>{when(item.created_at)}</span>
        {item.feedback_score === -1 && <span className="inline-flex items-center rounded-full bg-danger-soft px-2 py-0.5 font-semibold text-danger"><Icon name="thumbsDown" className="h-3.5 w-3.5" title="도움 안 됨" /></span>}
        {item.answer_status === 'not_found' && <span className="rounded-full bg-card px-2 py-0.5">못 찾음</span>}
        {item.grounding_issues && <span className="rounded-full bg-warn-soft px-2 py-0.5 text-warn">숫자 삭제</span>}
        {item.topic && <span className="rounded-full bg-card px-2 py-0.5">{TOPIC_LABEL[item.topic] ?? item.topic}</span>}
        {item.classified_by && <span className="rounded-full bg-card px-2 py-0.5">{item.classified_by === 'rule' ? '규칙 분류' : 'AI 분류'}</span>}
        {item.latency_ms != null && <span>{(item.latency_ms / 1000).toFixed(1)}초</span>}
      </div>
      <p className="mt-2 text-lg font-semibold text-ink">{item.user_question}</p>
      {(item.feedback_reason || item.feedback_detail) && (
        <p className="mt-1 text-sm text-danger">
          학생 의견: {[item.feedback_reason, item.feedback_detail].filter(Boolean).join(' · ')}
        </p>
      )}
      {item.grounding_issues && <p className="mt-1 text-sm text-warn">근거에 없어 뺀 값: {item.grounding_issues}</p>}

      <div className="mt-3 rounded-xl bg-card px-4 py-3 text-sm text-ink-2">
        <p className="whitespace-pre-wrap">{open || answer.length <= 280 ? answer : `${answer.slice(0, 280)}…`}</p>
        {answer.length > 280 && (
          <button type="button" onClick={() => setOpen(!open)} className="mt-1 text-xs text-link underline">
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
      {item.routes && <p className="mt-1 text-xs text-ink-3">검색 경로: {item.routes}</p>}
      {item.trace_id && <Trace id={item.id} />}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {CAUSES.map((c) => (
          <button
            key={c.value}
            type="button"
            title={c.tip}
            onClick={() => setCause(c.value)}
            disabled={done}
            className={`rounded-full border px-3 py-1 text-sm ${cause === c.value ? 'border-accent bg-accent text-white' : 'border-line text-ink-2 hover:bg-card'}`}
          >
            {c.label}
          </button>
        ))}
        <span className="flex-1" />
        <Link to={`/faqs/create?question=${encodeURIComponent(item.user_question)}`} className="rounded-lg border border-line px-3 py-1.5 text-sm text-ink-2 hover:bg-card">
          FAQ 만들기
        </Link>
        {done ? (
          <button type="button" onClick={() => save('open')} className="rounded-lg border border-line px-3 py-1.5 text-sm text-ink-2">
            다시 확인할 목록으로
          </button>
        ) : (
          <button type="button" onClick={() => save(cause === 'ok' ? 'ignored' : 'done')} className="rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-white">
            처리 완료
          </button>
        )}
      </div>
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
    <div className="py-8">
      <h1 className="text-xl sm:text-2xl sm:text-[1.9rem] font-bold text-ink">답변 확인</h1>
      <p className="mt-1 text-ink-2">최근 30일 동안 확인이 필요한 AI 답변이에요. 원인을 골라 처리하면 무엇을 고칠지 정할 수 있어요.</p>

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
        <p className="mt-6 text-ink-3">불러오는 중…</p>
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
