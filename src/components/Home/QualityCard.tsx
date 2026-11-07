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
    <p className="mb-4 flex items-center gap-2 text-sm text-ink-3">
      <span className="h-2 w-2 rounded-full bg-success" />
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

type Row = {
  label: string;
  hint: string;
  value: (w: QualityWeek) => number | null;
  fmt: (v: number) => string;
  worse: (cur: number, prev: number) => boolean; // 지난주보다 나빠졌으면 빨간색
};

const pct = (v: number) => `${v}%`;
const sec = (v: number) => `${(v / 1000).toFixed(1)}초`;
const ROWS: Row[] = [
  { label: '질문 수', hint: 'AI가 답한 직접 입력 질문', value: (w) => w.total, fmt: (v) => String(v), worse: () => false },
  { label: '답을 못 찾음', hint: '자료에서 답을 찾지 못한 비율', value: (w) => w.not_found_rate, fmt: pct, worse: (c, p) => c - p >= 5 },
  { label: '👎', hint: '도움이 안 됐다고 한 비율', value: (w) => w.down_rate, fmt: pct, worse: (c, p) => c - p >= 2 },
  { label: '숫자를 뺀 답변', hint: '근거에 없는 날짜·숫자가 있어 일부를 뺀 비율 (AI가 지어낼 뻔한 경우)', value: (w) => w.grounding_rate, fmt: pct, worse: (c, p) => c - p >= 2 },
  { label: '규칙으로 분류', hint: 'AI 분류 없이 바로 답한 비율 (높을수록 빠름)', value: (w) => w.rule_rate, fmt: pct, worse: (c, p) => p - c >= 10 },
  { label: '응답 시간 (중간값)', hint: '질문을 받고 답을 다 보낼 때까지', value: (w) => w.latency_p50, fmt: sec, worse: (c, p) => c - p >= 1000 },
  { label: '응답 시간 (느린 10%)', hint: '가장 느린 10% 기준', value: (w) => w.latency_p90, fmt: sec, worse: (c, p) => c - p >= 2000 },
];

const short = (d: string) => {
  const [, m, day] = d.split('-');
  return `${Number(m)}/${Number(day)}~`;
};

/** 주별 답변 품질 — 마지막 주가 지난주보다 눈에 띄게 나빠지면 빨간색 */
const QualityCard: React.FC<{ weeks: QualityWeek[] }> = ({ weeks }) => {
  if (!weeks.length) return null;
  const last = weeks.length - 1;
  return (
    <section className="mb-4 rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-baseline justify-between">
        <h2 className="font-bold text-ink">답변 품질 (주별)</h2>
        <Link to="/answer-reviews" className="text-sm text-link underline">확인할 답변 보기</Link>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-ink-3">
              <th className="py-1.5 pr-3 text-left font-medium" />
              {weeks.map((w) => (
                <th key={w.week_start} className="px-2 py-1.5 text-right font-medium">{short(w.week_start)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.label} className="border-t border-line">
                <td className="py-1.5 pr-3 text-ink-2" title={r.hint}>{r.label}</td>
                {weeks.map((w, i) => {
                  const v = r.value(w);
                  const prev = i > 0 ? r.value(weeks[i - 1]) : null;
                  const bad = i === last && v != null && prev != null && r.worse(v, prev);
                  return (
                    <td key={w.week_start} className={`px-2 py-1.5 text-right tabular-nums ${bad ? 'font-semibold text-danger' : i === last ? 'text-ink' : 'text-ink-3'}`}>
                      {v == null ? '–' : r.fmt(v)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-ink-3">이번 주(맨 오른쪽)가 지난주보다 눈에 띄게 나빠진 칸은 빨간색이에요. 항목 이름에 마우스를 올리면 설명이 나와요.</p>
    </section>
  );
};

export default QualityCard;
