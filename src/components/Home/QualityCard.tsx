import React from 'react';
import { Link } from 'react-router-dom';
import { GetDashboardResponse, QualityWeek } from '../../types/dashboard';

type Tests = NonNullable<GetDashboardResponse['data']['tests']>;

const ago = (iso: string) => {
  const min = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  return min < 60 ? `${min}분 전` : min < 1440 ? `${Math.floor(min / 60)}시간 전` : `${Math.floor(min / 1440)}일 전`;
};

/** 배포 후 시나리오 테스트 — 통과면 한 줄, 실패면 눈에 띄게 */
export const TestsStatus: React.FC<{ t: Tests }> = ({ t }) =>
  t.failed.length === 0 ? (
    <p className="flex items-center gap-2 text-xs text-ink-3">
      <span className="h-2 w-2 shrink-0 rounded-full bg-success" />
      배포 후 답변 테스트 {t.passed}/{t.total} 통과 · {ago(t.finished_at)}
      {t.flaky.length > 0 && ` (다시 돌려 통과 ${t.flaky.length}개)`}
    </p>
  ) : (
    <div className="mb-4 rounded-2xl border border-danger/30 bg-danger-soft px-5 py-4">
      <p className="font-semibold text-danger">새 버전의 답변 테스트에 실패한 항목이 있어요 ({t.passed}/{t.total})</p>
      <ul className="mt-1 list-disc pl-5 text-sm text-ink-2">
        {t.failed.map((n) => <li key={n}>{n}</li>)}
      </ul>
      <p className="mt-1 text-sm text-ink-3">{ago(t.finished_at)} · 개발자에게 알려 주세요.</p>
    </div>
  );

type Metric = {
  label: string;
  hint: string;
  value: (w: QualityWeek) => number | null;
  fmt: (v: number) => string;
  good: 'up' | 'down' | null;          // 어느 쪽이 좋은지 (null = 방향 없음, 질문 수)
  worse: (cur: number, prev: number) => boolean; // 지난주보다 눈에 띄게 나빠졌으면 빨간색
  delta: (cur: number, prev: number) => string;
};

const pct = (v: number) => `${v}%`;
const sec = (v: number) => `${(v / 1000).toFixed(1)}초`;
const pp = (c: number, p: number) => `${c - p >= 0 ? '+' : ''}${Math.round(c - p)}%p`;
const ds = (c: number, p: number) => `${c - p >= 0 ? '+' : ''}${((c - p) / 1000).toFixed(1)}초`;
const METRICS: Metric[] = [
  { label: '질문 수', hint: 'AI가 답한 직접 입력 질문', value: (w) => w.total, fmt: String, good: null,
    worse: () => false, delta: (c, p) => `${c - p >= 0 ? '+' : ''}${c - p}` },
  { label: '답을 못 찾음', hint: '자료에서 답을 찾지 못한 비율', value: (w) => w.not_found_rate, fmt: pct, good: 'down',
    worse: (c, p) => c - p >= 5, delta: pp },
  { label: '👎 비율', hint: '도움이 안 됐다고 한 비율', value: (w) => w.down_rate, fmt: pct, good: 'down',
    worse: (c, p) => c - p >= 2, delta: pp },
  { label: '숫자를 뺀 답변', hint: '근거에 없는 날짜·숫자가 있어 일부를 뺀 비율 (AI가 지어낼 뻔한 경우)', value: (w) => w.grounding_rate,
    fmt: pct, good: 'down', worse: (c, p) => c - p >= 2, delta: pp },
  { label: '규칙으로 분류', hint: 'AI 분류 없이 바로 답한 비율 (높을수록 빠름)', value: (w) => w.rule_rate, fmt: pct, good: 'up',
    worse: (c, p) => p - c >= 10, delta: pp },
  { label: '응답 시간', hint: '질문을 받고 답을 다 보낼 때까지 (중간값, 아래는 느린 10%)', value: (w) => w.latency_p50, fmt: sec,
    good: 'down', worse: (c, p) => c - p >= 1000, delta: ds },
];

/** 주별 추이 작은 선 그래프 — 마지막 점(이번 주) 강조 */
const Spark: React.FC<{ values: (number | null)[]; bad: boolean }> = ({ values, bad }) => {
  const pts = values.map((v, i) => ({ v, i })).filter((p): p is { v: number; i: number } => p.v != null);
  if (pts.length < 2) return <div className="h-6" />;
  const W = 80, H = 24, pad = 3;
  const min = Math.min(...pts.map((p) => p.v)), max = Math.max(...pts.map((p) => p.v));
  const x = (i: number) => pad + (i / Math.max(1, values.length - 1)) * (W - pad * 2);
  const y = (v: number) => (max === min ? H / 2 : H - pad - ((v - min) / (max - min)) * (H - pad * 2));
  const d = pts.map((p, k) => `${k ? 'L' : 'M'}${x(p.i).toFixed(1)},${y(p.v).toFixed(1)}`).join(' ');
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`h-6 w-20 ${bad ? 'text-danger' : 'text-accent-ink'}`} aria-hidden>
      <path d={d} fill="none" stroke="currentColor" strokeOpacity={0.55} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={x(last.i)} cy={y(last.v)} r={2.5} fill="currentColor" />
    </svg>
  );
};

/** 답변 품질 — 실시간 채팅 옆 작은 카드. 항목마다 이번 주 값 + 지난주 대비 + 8주 추이 */
const QualityCard: React.FC<{ weeks: QualityWeek[]; footer?: React.ReactNode; className?: string }> = ({ weeks, footer, className = '' }) => {
  if (!weeks.length) return null;
  const cur = weeks[weeks.length - 1];
  const prev = weeks.length > 1 ? weeks[weeks.length - 2] : null;
  return (
    <section className={`flex flex-col rounded-2xl border border-line bg-surface p-5 ${className}`}>
      <div className="mb-3 flex items-baseline gap-2">
        <h2 className="font-bold text-ink">답변 품질</h2>
        <span className="text-xs text-ink-3">이번 주 · 지난 {weeks.length}주 추이</span>
        <Link to="/answer-reviews" className="ml-auto text-sm font-semibold text-accent-ink hover:underline">확인할 답변 →</Link>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-3">
        {METRICS.map((m) => {
          const v = m.value(cur);
          const p = prev ? m.value(prev) : null;
          const bad = v != null && p != null && m.worse(v, p);
          const better = v != null && p != null && m.good != null && v !== p && (m.good === 'up' ? v > p : v < p);
          return (
            <div key={m.label} className="flex items-end justify-between gap-2 border-b border-line pb-2" title={m.hint}>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-ink-2">{m.label}</p>
                <p className={`mt-0.5 text-xl font-bold leading-tight tabular-nums ${bad ? 'text-danger' : 'text-ink'}`}>
                  {v == null ? '–' : m.fmt(v)}
                </p>
                <p className={`truncate text-[11px] tabular-nums ${bad ? 'text-danger' : better ? 'text-success' : 'text-ink-3'}`}>
                  {m.label === '응답 시간' && cur.latency_p90 != null ? `느린 10% ${sec(cur.latency_p90)} · ` : ''}
                  {v != null && p != null ? `지난주 ${m.delta(v, p)}` : '지난주 기록 없음'}
                </p>
              </div>
              <Spark values={weeks.map(m.value)} bad={bad} />
            </div>
          );
        })}
      </div>
      {footer && <div className="mt-3 space-y-1">{footer}</div>}
    </section>
  );
};

export default QualityCard;
