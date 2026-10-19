import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useChat } from '../Chat/ChatProvider';
import { useHobitQueryGetApi } from '../../hooks/hobitAdmin';
import { GetDashboardRequest, GetDashboardResponse } from '../../types/dashboard';
import { prefetchRoute } from '../../routes';
import { CountUp, Reveal } from '../ui/motion';
import LanguageBadge from '../ui/LanguageBadge';
import LiveChatCard from './LiveChatCard';
import { THEME_EVENT } from '../../theme';

type Dashboard = GetDashboardResponse['data'];

// 관리자 사이트 변경 이력 (최신이 위)
const CHANGES = [
  { date: '2026년 10월 10일', text: '대시보드·키워드 관리(추천 질문 고정, 연관 단어)·나이트 모드 추가' },
  { date: '2026년 2월 22일 (일요일)', text: '전체 삭제 로직 추가' },
  { date: '2026년 2월 19일 (목요일)', text: '카테고리 순서, 전체관리(이메일, 관리자) 추가' },
  { date: '2026년 2월 16일 (월요일)', text: '피드백 유해성 검사 수정 & 피드백 ui 개선' },
  { date: '2026년 2월 15일 (일요일)', text: '답변카드 질문 표시 & 선배모드 동작 로직 수정' },
  { date: '2026년 1월 21일 (수요일)', text: 'DeepL 에러 수정 & FAQ 미리보기 수정' },
  { date: '2026년 1월 18일 (일요일)', text: '모델 학습 실패 시 이메일 & 에러 페이지 추가' },
];

const pct = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 100) : 0);

const shortDate = (iso: string) => {
  const [, m, d] = iso.split('-');
  return `${Number(m)}/${Number(d)}`;
};

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 60) return `${Math.max(min, 1)}분 전`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
};

const Card: React.FC<{ title: string; action?: React.ReactNode; className?: string; children: React.ReactNode }> = ({
  title,
  action,
  className = '',
  children,
}) => (
  <section className={`flex h-full flex-col rounded-2xl border border-line bg-surface p-5 ${className}`}>
    <div className="mb-4 flex items-center justify-between">
      <h2 className="font-bold text-ink">{title}</h2>
      {action}
    </div>
    {children}
  </section>
);

const StatCard: React.FC<{ label: string; value: number; sub?: React.ReactNode; index: number; to?: string; tone?: 'accent' }> = ({
  label,
  value,
  sub,
  index,
  to,
  tone,
}) => {
  const body = (
    <div
      className={`h-full rounded-2xl border p-5 transition-all ${
        tone === 'accent' && value > 0 ? 'border-accent-ink/40 bg-accent/5 dark:bg-accent-ink/10' : 'border-line bg-surface'
      } ${to ? 'hover:-translate-y-0.5 hover:shadow-lg' : ''}`}
    >
      <p className="text-sm font-semibold text-ink-2">{label}</p>
      <p className={`mt-2 text-[2.2rem] font-bold leading-none tracking-tight ${tone === 'accent' && value > 0 ? 'text-accent-ink' : 'text-ink'}`}>
        <CountUp value={value} delay={index * 80} />
      </p>
      {sub && <p className="mt-2 text-sm text-ink-2">{sub}</p>}
    </div>
  );
  return (
    <Reveal index={index}>
      {to ? (
        <Link to={to} onMouseEnter={() => prefetchRoute(to)} className="block h-full">
          {body}
        </Link>
      ) : (
        body
      )}
    </Reveal>
  );
};

/** 최근 14일 질문 수 — 막대가 왼쪽부터 차례로 자람 (한국어 아래, 영어 위로 쌓음) */
const DailyChart: React.FC<{ daily: Dashboard['daily'] }> = ({ daily }) => {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...daily.map((d) => d.ko + d.en));
  // 옆 카드(최근 피드백) 높이에 맞춰 막대 영역이 남는 높이를 채움 (고정 높이면 아래가 비었음)
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex min-h-[150px] flex-1 items-end gap-[6px]">
        {daily.map((d, i) => {
          const total = d.ko + d.en;
          return (
            <div
              key={d.date}
              className="relative flex h-full flex-1 flex-col justify-end"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              {hover === i && (
                <div className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-xl border border-line bg-surface px-3 py-2 text-xs shadow-lg">
                  <p className="font-semibold text-ink">{shortDate(d.date)} · {total}건</p>
                  <p className="text-ink-2">한국어 {d.ko} · 영어 {d.en}</p>
                </div>
              )}
              <div
                className="grow-y flex w-full flex-col justify-end overflow-hidden rounded-t-md"
                style={{ height: `${(total / max) * 100}%`, animationDelay: `${200 + i * 45}ms`, minHeight: total ? 3 : 0 }}
              >
                <div className="bg-link/70" style={{ height: `${pct(d.en, total)}%` }} />
                <div className={`flex-1 ${hover === i ? 'bg-accent-ink' : 'bg-accent-ink/80'}`} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-[6px] text-center text-[11px] text-ink-3">
        {daily.map((d, i) => (
          <span key={d.date} className="flex-1">
            {i % 2 === 1 || i === daily.length - 1 ? shortDate(d.date) : ''}
          </span>
        ))}
      </div>
      <div className="mt-3 flex gap-4 text-xs text-ink-2">
        <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-accent-ink/80" />한국어</span>
        <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-link/70" />영어</span>
      </div>
    </div>
  );
};

/** 순위 막대 목록 — 막대가 차례로 뻗어 나감 */
const RankBars: React.FC<{ items: { label: string; count: number; to?: string }[]; empty: string }> = ({ items, empty }) => {
  if (!items.length) return <p className="py-6 text-center text-sm text-ink-3">{empty}</p>;
  const max = Math.max(...items.map((i) => i.count));
  return (
    <ol className="flex flex-col gap-3">
      {items.map((item, i) => {
        const label = (
          <span className="truncate text-sm text-ink" title={item.label}>
            <span className="mr-2 font-bold text-ink-3">{i + 1}</span>
            {item.label}
          </span>
        );
        return (
          <li key={i} className="reveal" style={{ animationDelay: `${250 + i * 60}ms` }}>
            <div className="mb-1 flex items-center justify-between gap-3">
              {item.to ? (
                <Link to={item.to} className="min-w-0 truncate hover:text-accent-ink">
                  {label}
                </Link>
              ) : (
                label
              )}
              <span className="shrink-0 text-sm font-semibold text-ink-2">{item.count}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-card">
              <div
                className="grow-x h-full rounded-full bg-accent-ink/70"
                style={{ width: `${(item.count / max) * 100}%`, animationDelay: `${300 + i * 60}ms` }}
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
};

const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse rounded-2xl bg-card ${className}`} />
);

/** 불러오는 중이면 깜빡이는 상자, 실패했으면 안내 문구 */
const Placeholder: React.FC<{ failed: boolean; className?: string }> = ({ failed, className = '' }) =>
  failed ? (
    <div className={`flex items-center justify-center rounded-2xl border border-dashed border-line text-sm text-ink-3 ${className}`}>
      불러오지 못했어요
    </div>
  ) : (
    <Skeleton className={className} />
  );

const SEEN_KEY = 'hobit-admin-seen-update';

/** 관리자 사이트 업데이트 — 홈 제목 옆 버튼. 새 항목이 있으면 점 표시 (이 브라우저에서 열어 보면 사라짐) */
const UpdatesButton: React.FC = () => {
  const latest = CHANGES[0]?.date ?? '';
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(() => {
    try {
      return localStorage.getItem(SEEN_KEY) === latest;
    } catch {
      return true;
    }
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const toggle = () => {
    setOpen((v) => !v);
    if (!seen) {
      setSeen(true);
      try {
        localStorage.setItem(SEEN_KEY, latest);
      } catch {}
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="relative flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink-2 hover:bg-card hover:text-ink"
      >
        업데이트 내역
        {!seen && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent-ink ring-2 ring-page" aria-label="새 업데이트" />}
      </button>
      {open && (
        <div className="select-menu absolute right-0 top-full z-30 mt-2 w-[360px] !p-4" style={{ position: 'absolute' }}>
          <ul className="max-h-[360px] space-y-3 overflow-y-auto pr-1">
            {CHANGES.map((c, i) => (
              <li key={i} className="border-l-2 border-accent-ink/40 pl-3">
                <p className="text-xs font-semibold text-ink-3">{c.date}</p>
                <p className="text-sm text-ink">{c.text}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const Home: React.FC = () => {
  const { role } = useChat();
  // 나이트·라이트 모드를 바꾸면 카드가 떠오르고 숫자가 올라가는 모션을 다시 재생 (아래 내용을 새로 그림 — 데이터는 캐시 그대로)
  const [replay, setReplay] = useState(0);
  useEffect(() => {
    const onTheme = () => setReplay((n) => n + 1);
    window.addEventListener(THEME_EVENT, onTheme);
    return () => window.removeEventListener(THEME_EVENT, onTheme);
  }, []);
  const { data, isLoading } = useHobitQueryGetApi<GetDashboardRequest, GetDashboardResponse>('dashboard');
  const dash = data?.payload?.data;
  const t = dash?.totals;
  const weekDiff = t ? pct(t.week - t.prev_week, t.prev_week || 0) : 0;
  // 요청이 끝났는데 데이터가 없으면 실패 (예전엔 빈 상자가 계속 떠 있었음)
  const failed = !isLoading && !dash;

  if (role === 'senior') return <Navigate to="/chats" replace />; // 근로장학생은 채팅 화면으로

  return (
    <div className="py-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-[1.9rem] font-bold text-ink">관리자 홈</h1>
          <p className="text-ink-2">
            {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
          </p>
        </div>
        <UpdatesButton />
      </div>

      <div key={replay}>
      {/* 실시간 채팅 — 가장 급한 일이라 맨 위 */}
      <LiveChatCard />

      {failed && (
        <div className="mb-4 rounded-2xl border border-danger/30 bg-danger-soft px-5 py-4">
          <p className="font-semibold text-danger">대시보드 통계를 불러오지 못했어요.</p>
          <p className="mt-1 text-sm text-ink-2">
            관리자 백엔드가 최신 버전(hobit_renewal/hoBIT-admin-backend)으로 실행 중인지 확인해 주세요. 잠시 후 새로고침해도 돼요.
          </p>
        </div>
      )}

      {/* 숫자 카드 */}
      {!t ? (
        <div className="grid grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (failed ? <div key={i} className="h-[124px] rounded-2xl border border-dashed border-line" /> : <Skeleton key={i} className="h-[124px]" />))}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          <StatCard index={1} label="오늘 질문" value={t.today} sub="오늘 0시부터" />
          <StatCard
            index={2}
            label="최근 7일 질문"
            value={t.week}
            sub={
              t.prev_week > 0 ? (
                <span className={weekDiff >= 0 ? 'text-success' : 'text-danger'}>
                  지난주보다 {weekDiff >= 0 ? '▲' : '▼'} {Math.abs(weekDiff)}%
                </span>
              ) : (
                '지난주 기록 없음'
              )
            }
          />
          <StatCard index={3} label="최근 30일 질문" value={t.month} sub={`영어 질문 ${pct(t.month_en, t.month)}%`} />
          <StatCard
            index={4}
            label="해결 안 된 피드백"
            value={t.unresolved_feedbacks}
            sub={`이번 주 새 피드백 ${t.week_feedbacks}건`}
            to="/userfeedbacks"
            tone="accent"
          />
        </div>
      )}

      {/* 그래프 + 최근 피드백 */}
      <div className="mt-4 grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-4">
        <Reveal index={4}>
          <Card title="최근 14일 질문 수">
            {dash ? <DailyChart daily={dash.daily} /> : <Placeholder failed={failed} className="h-[180px]" />}
          </Card>
        </Reveal>
        <Reveal index={5}>
          <Card
            title="해결 안 된 최근 피드백"
            action={
              <Link to="/userfeedbacks" className="text-sm font-semibold text-accent-ink hover:underline">
                전체 보기 →
              </Link>
            }
          >
            {!dash ? (
              <Placeholder failed={failed} className="h-[180px]" />
            ) : dash.recent_feedbacks.length === 0 ? (
              <p className="py-10 text-center text-sm text-ink-3">해결 안 된 피드백이 없어요 🎉</p>
            ) : (
              <ul className="flex flex-col divide-y divide-line">
                {dash.recent_feedbacks.slice(0, 4).map((f, i) => (
                  <li key={f.user_feedback_id} className="reveal py-2 first:pt-0 last:pb-0" style={{ animationDelay: `${300 + i * 70}ms` }}>
                    <div className="mb-0.5 flex items-center gap-2">
                      <LanguageBadge language={f.language} />
                      {f.feedback_reason && <span className="truncate text-sm font-semibold text-ink">{f.feedback_reason}</span>}
                      <span className="ml-auto shrink-0 text-xs text-ink-3">{timeAgo(f.created_at)}</span>
                    </div>
                    <p className="truncate text-sm text-ink-2">
                      {f.feedback_detail || f.user_question || f.question_ko || '(내용 없음)'}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </Reveal>
      </div>

      {/* 많이 본 FAQ · FAQ 없이 들어온 질문 */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <Reveal index={6}>
          <Card title="이번 주 많이 본 FAQ">
            {dash ? (
              <RankBars
                items={dash.top_faqs.map((f) => ({ label: f.question_ko, count: f.count, to: `/faqs/${f.faq_id}` }))}
                empty="이번 주 FAQ 조회 기록이 없어요"
              />
            ) : (
              <Placeholder failed={failed} className="h-[200px]" />
            )}
          </Card>
        </Reveal>
        <Reveal index={7}>
          <Card title="FAQ 없이 많이 들어온 질문" action={<span className="text-xs text-ink-3">FAQ로 만들면 좋은 후보</span>}>
            {dash ? (
              <RankBars
                items={dash.top_questions.map((q) => ({ label: q.question, count: q.count }))}
                empty="이번 주 기록이 없어요"
              />
            ) : (
              <Placeholder failed={failed} className="h-[200px]" />
            )}
          </Card>
        </Reveal>
      </div>
      </div>
    </div>
  );
};

export default Home;
