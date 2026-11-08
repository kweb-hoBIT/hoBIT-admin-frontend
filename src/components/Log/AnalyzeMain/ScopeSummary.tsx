import React, { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { hobitGetApi } from '../../../api/api';
import { GetScopeSummaryResponse, ScopeTopic } from '../../../types/scopeSummary';
import Segmented from '../../ui/Segmented';
import { LoadError } from '../../ui/ListKit';
import { revealRef } from '../../ui/motion';

/**
 * 주제별 검색 범위 — 챗봇은 질문마다 주제를 정하고 그 주제의 자료부터 찾아요.
 * 결과가 너무 적으면 전체 자료로 넓히는데, 넓히는 일이 잦은 주제는 '먼저 찾는 자료'에 빠진 곳이 있다는 뜻이에요.
 * 넓혔을 때 실제로 답에 쓰인 자료를 함께 보여 줘서 어떤 자료를 그 주제 범위에 더할지 개발자에게 알려 줄 수 있게 해요.
 */
type Days = '7' | '30' | '90';
const PERIODS: readonly (readonly [Days, string])[] = [
  ['7', '7일'],
  ['30', '30일'],
  ['90', '90일'],
];
const PERIOD_KEY = 'hobit-admin-scope-days';

// 제안 기준 — 질문이 너무 적으면 비율이 흔들려서 제안하지 않음
const SUGGEST_RATE = 30;
const SUGGEST_MIN_QUESTIONS = 5;
const ENOUGH_QUESTIONS = 50;

const pct = (v: number) => `${Number.isInteger(v) ? v : v.toFixed(1)}%`;

const Rate: React.FC<{ label: string; count: number; rate: number }> = ({ label, count, rate }) => (
  <div className="min-w-0">
    <p className="text-xs text-ink-3">{label}</p>
    <p className="text-sm font-semibold text-ink tabular-nums">
      {pct(rate)} <span className="font-normal text-ink-3">({count.toLocaleString()})</span>
    </p>
  </div>
);

const TopicRow: React.FC<{ t: ScopeTopic }> = ({ t }) => {
  const suggest = t.widened_rate >= SUGGEST_RATE && t.questions >= SUGGEST_MIN_QUESTIONS;
  const parts = [t.widened_static > 0 && `안내 ${t.widened_static}`, t.widened_notices > 0 && `공지 ${t.widened_notices}`].filter(Boolean);
  return (
    <li ref={revealRef} className="rounded-xl bg-card-2 p-3.5 sm:p-4">
      <div className="flex flex-col gap-3 md:grid md:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] md:items-center md:gap-4">
        <div className="flex items-baseline justify-between gap-2 md:block">
          <p className={`font-semibold ${t.topic ? 'text-ink' : 'text-ink-2'}`}>{t.label}</p>
          <p className="text-xs text-ink-3 tabular-nums">질문 {t.questions.toLocaleString()}개</p>
        </div>

        <div className="min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-xs text-ink-3">전체로 넓힘</p>
            <p className="text-sm font-semibold tabular-nums text-ink">
              {pct(t.widened_rate)} <span className="font-normal text-ink-3">({t.widened.toLocaleString()})</span>
            </p>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-card-3" aria-hidden="true">
            <div
              className={`h-full rounded-full ${suggest ? 'bg-warn' : 'bg-accent'}`}
              style={{ width: `${Math.min(100, t.widened_rate)}%` }}
            />
          </div>
          {parts.length > 0 && <p className="mt-1 text-xs text-ink-3">넓힌 곳: {parts.join(' · ')}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3 md:contents">
          <Rate label="답을 못 찾음" count={t.not_found} rate={t.not_found_rate} />
          <Rate label="👎 받음" count={t.down} rate={t.down_rate} />
        </div>
      </div>

      {suggest && (
        <p className="mt-3 rounded-lg bg-warn-soft px-3 py-2 text-sm text-ink">
          {t.widened_sources.length > 0 ? (
            <>
              넓혔을 때 자주 쓰인 자료: <strong>{t.widened_sources.map((s) => `${s.name} ${s.count}`).join(', ')}</strong> — 이 주제
              범위에 추가를 검토해 보세요 (개발자에게 알려 주세요)
            </>
          ) : (
            <>넓혀도 답에 쓰인 자료가 없었어요 — 이 주제에 맞는 자료가 아예 없을 수 있어요 (개발자에게 알려 주세요)</>
          )}
        </p>
      )}
    </li>
  );
};

const ScopeSummary: React.FC = () => {
  const [days, setDays] = useState<Days>(() => {
    try {
      const v = sessionStorage.getItem(PERIOD_KEY);
      return v === '7' || v === '90' ? v : '30';
    } catch {
      return '30';
    }
  });
  const changeDays = (v: Days) => {
    setDays(v);
    try {
      sessionStorage.setItem(PERIOD_KEY, v);
    } catch {}
  };

  const api = useQuery({
    queryKey: ['dashboard/scope', days],
    queryFn: () => hobitGetApi<{ query: { days: number } }, any>('dashboard/scope', { query: { days: Number(days) } }),
    placeholderData: keepPreviousData, // 기간을 바꾸는 동안 이전 표를 그대로
  });
  const payload = api.data?.payload as GetScopeSummaryResponse | null | undefined;
  const data = payload?.statusCode === 200 ? payload.data : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <p className="text-sm text-ink-2">
          주제마다 먼저 찾는 자료를 정해 두었어요. '전체로 넓힘'이 잦은 주제는 먼저 찾는 자료에 빠진 곳이 있다는 뜻이에요.
        </p>
        <Segmented
          options={PERIODS}
          value={days}
          onChange={changeDays}
          itemClassName="min-w-[4rem] px-3 py-1.5 text-sm font-semibold"
          className="w-fit max-w-full shrink-0"
        />
      </div>

      <div className={`min-w-0 rounded-2xl border border-line p-3 sm:p-5 transition-opacity ${api.isPlaceholderData ? 'opacity-60' : ''}`}>
        {!data ? (
          api.isPending || api.isFetching ? (
            <div className="flex flex-col gap-3" aria-busy="true" aria-label="불러오는 중">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-xl bg-card" />
              ))}
            </div>
          ) : (
            <LoadError message="검색 범위 요약을 불러오지 못했어요." onRetry={() => api.refetch()} />
          )
        ) : data.topics.length === 0 ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center gap-1 text-center">
            <p className="font-semibold text-ink-2">이 기간에 기록된 AI 답변이 없어요</p>
            <p className="text-sm text-ink-3">학생 질문이 쌓이면 주제별로 보여 줘요. 실제 질문이 몇 주 쌓여야 의미 있는 숫자가 돼요.</p>
          </div>
        ) : (
          <>
            <p className="mb-3 text-sm text-ink-3">
              최근 {data.days}일 AI 답변 <strong className="text-ink-2 tabular-nums">{data.total.toLocaleString()}개</strong> · 넓힌 비율이
              높은 순서
            </p>
            {data.total < ENOUGH_QUESTIONS && (
              <p className="mb-3 rounded-lg bg-card-2 px-3 py-2 text-sm text-ink-2">
                아직 질문이 {data.total.toLocaleString()}개뿐이라 비율이 크게 흔들려요. 실제 질문이 몇 주 쌓여야 의미 있는 숫자가 돼요.
              </p>
            )}
            <ul className="flex flex-col gap-2.5">
              {data.topics.map((t) => (
                <TopicRow key={t.topic ?? 'none'} t={t} />
              ))}
            </ul>
            <p className="mt-3 text-xs text-ink-3">
              넓힌 비율 {SUGGEST_RATE}% 이상이고 질문이 {SUGGEST_MIN_QUESTIONS}개 이상인 주제에 제안을 보여 줘요. 안내 = 홈페이지·학사 안내,
              공지 = 게시판 공지.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ScopeSummary;
