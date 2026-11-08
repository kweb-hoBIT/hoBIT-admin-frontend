import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GetDashboardResponse, QualityDaily, QualityStat } from '../../types/dashboard';
import { inViewRef, useCountUp, useSeenOnce } from '../ui/motion';

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
  key: keyof QualityStat;
  label: string;
  hint: string;
  unit: '%' | '초' | '';
  good: 'up' | 'down' | null;                    // 어느 쪽이 좋은지 (null = 방향 없음, 질문 수)
  worse: (cur: number, prev: number) => boolean; // 지난 7일보다 눈에 띄게 나빠졌으면 빨간색
};

const METRICS: Metric[] = [
  { key: 'total', label: '질문 수', hint: 'AI가 답한 직접 입력 질문', unit: '', good: null, worse: () => false },
  { key: 'not_found_rate', label: '답을 못 찾음', hint: '자료에서 답을 찾지 못한 비율', unit: '%', good: 'down', worse: (c, p) => c - p >= 5 },
  { key: 'down_rate', label: '도움 안 됨', hint: '학생이 "도움 안 됨"을 누른 비율', unit: '%', good: 'down', worse: (c, p) => c - p >= 2 },
  { key: 'grounding_rate', label: '근거 없는 숫자 삭제', hint: 'AI 답변에 자료에 없는 날짜·금액·연락처가 있어 그 줄을 빼고 보낸 비율 (AI가 지어낼 뻔한 경우)', unit: '%', good: 'down', worse: (c, p) => c - p >= 2 },
  { key: 'rule_rate', label: '규칙으로 분류', hint: 'AI 분류 없이 바로 답한 비율 (높을수록 빠름)', unit: '%', good: 'up', worse: (c, p) => p - c >= 10 },
  { key: 'latency_p50', label: '응답 시간', hint: '질문을 받고 답을 다 보낼 때까지 (중간값)', unit: '초', good: 'down', worse: (c, p) => c - p >= 1000 },
];

const shown = (m: Metric, v: number) => (m.unit === '초' ? v / 1000 : v); // 응답 시간은 ms → 초
const fmt = (m: Metric, v: number) => (m.unit === '' ? String(Math.round(v)) : `${shown(m, v).toFixed(1).replace(/\.0$/, '')}${m.unit}`);
const shortDate = (iso: string) => `${Number(iso.slice(5, 7))}/${Number(iso.slice(8, 10))}`;

/** 숫자가 차르륵 올라감 (소수 한 자리까지) — 홈 숫자 카드와 같은 움직임 */
const AnimatedValue: React.FC<{ m: Metric; v: number; delay: number; className: string }> = ({ m, v, delay, className }) => {
  const [ref, seen] = useSeenOnce<HTMLSpanElement>();
  const x = useCountUp(seen ? Math.round(shown(m, v) * 10) : 0, 900, delay) / 10; // 보일 때 올라감
  return <span ref={ref} className={className}>{m.unit === '' ? Math.round(x) : `${x.toFixed(1).replace(/\.0$/, '')}${m.unit}`}</span>;
};

/** 최근 14일 작은 막대 — 질문 수 그래프처럼 왼쪽부터 차례로 자람. 마지막 7일은 진하게, 마우스를 올리면 그날 값 */
const MiniBars: React.FC<{ m: Metric; days: QualityDaily['daily']; bad: boolean; delay: number }> = ({ m, days, bad, delay }) => {
  const [hover, setHover] = useState<number | null>(null);
  const vals = days.map((d) => d[m.key] as number | null);
  const max = Math.max(1, ...vals.map((v) => v ?? 0));
  return (
    <div ref={inViewRef} className="relative flex h-[34px] items-end gap-[2px]" onMouseLeave={() => setHover(null)}>
      {days.map((d, i) => {
        const v = vals[i];
        const recent = i >= days.length - 7;
        return (
          <div key={d.date} className="relative flex h-full flex-1 items-end" onMouseEnter={() => setHover(i)} onClick={() => setHover(i)}>
            {v != null && (
              <div
                className={`grow-y w-full rounded-t-[2px] ${
                  hover === i ? 'bg-accent-ink' : bad && recent ? 'bg-danger/70' : recent ? 'bg-accent-ink/70' : 'bg-accent-ink/25'
                }`}
                style={{ height: `${Math.max(6, (v / max) * 100)}%`, animationDelay: `${delay + i * 35}ms` }}
              />
            )}
            {v == null && <div className="h-[2px] w-full rounded bg-line" />}
          </div>
        );
      })}
      {hover != null && (
        <div className="pointer-events-none absolute bottom-full right-0 z-10 mb-1 whitespace-nowrap rounded-lg border border-line bg-surface px-2 py-1 text-[11px] text-ink shadow-lg">
          {shortDate(days[hover].date)} · {vals[hover] == null ? '질문 없음' : fmt(m, vals[hover] as number)}
          {days[hover].total ? ` (질문 ${days[hover].total})` : ''}
        </div>
      )}
    </div>
  );
};

/** 답변 품질 — 실시간 채팅 옆 카드. 항목마다 최근 7일 값 + 그 전 7일 대비 + 14일 막대 그래프 */
const QualityCard: React.FC<{ q: QualityDaily; footer?: React.ReactNode; className?: string }> = ({ q, footer, className = '' }) => {
  const { current: cur, previous: prev, daily } = q;
  return (
    <section className={`flex flex-col rounded-2xl border border-line bg-surface p-5 ${className}`}>
      <div className="mb-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <h2 className="font-bold text-ink">답변 품질</h2>
        <span className="text-xs text-ink-3">최근 7일 · 14일 그래프</span>
        <Link to="/answer-reviews" className="ml-auto text-sm font-semibold text-accent-ink hover:underline">확인할 답변 →</Link>
      </div>
      <div className="grid flex-1 grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2">
        {METRICS.map((m, i) => {
          const v = cur[m.key] as number | null;
          const p = prev[m.key] as number | null;
          const bad = v != null && p != null && m.worse(v, p);
          const better = v != null && p != null && m.good != null && v !== p && (m.good === 'up' ? v > p : v < p);
          const diff = v != null && p != null ? shown(m, v) - shown(m, p) : null;
          const delay = 150 + i * 70;
          return (
            <div key={m.key} className="reveal min-w-0" style={{ animationDelay: `${delay}ms` }} title={m.hint}>
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-ink-2">{m.label}</p>
                  {v == null ? (
                    <p className="text-xl font-bold leading-tight text-ink-3">–</p>
                  ) : (
                    <AnimatedValue m={m} v={v} delay={delay} className={`text-xl font-bold leading-tight tabular-nums ${bad ? 'text-danger' : 'text-ink'}`} />
                  )}
                </div>
                <div className="w-[52%] shrink-0">
                  <MiniBars m={m} days={daily} bad={bad} delay={delay + 100} />
                </div>
              </div>
              <p className={`mt-1 truncate text-[11px] tabular-nums ${bad ? 'text-danger' : better ? 'text-success' : 'text-ink-3'}`}>
                {m.key === 'latency_p50' && cur.latency_p90 != null ? `느린 10% ${(cur.latency_p90 / 1000).toFixed(1)}초 · ` : ''}
                {diff == null
                  ? '지난 7일 기록 없음'
                  : `그 전 7일보다 ${diff >= 0 ? '+' : ''}${m.unit === '' ? Math.round(diff) : diff.toFixed(1).replace(/\.0$/, '')}${m.unit === '%' ? '%p' : m.unit}`}
              </p>
            </div>
          );
        })}
      </div>
      {footer && <div className="mt-3 space-y-1">{footer}</div>}
    </section>
  );
};

export default QualityCard;
