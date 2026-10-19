import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useChat } from '../Chat/ChatProvider';
import { prefetchRoute } from '../../routes';
import { CountUp, Reveal } from '../ui/motion';
import LanguageBadge from '../ui/LanguageBadge';
import Badge from '../ui/Badge';
import type { ListedSession } from '../../api/chat';

/**
 * 관리자 홈 — 실시간 채팅 현황 (가장 급한 일이라 맨 위)
 * 대기 · 내 진행 중 · 안 읽은 메시지 · 오늘 처리, 그리고 바로 열 수 있는 채팅 목록
 */
const minutesSince = (iso: string, now: number) => Math.max(0, Math.floor((now - new Date(iso).getTime()) / 60000));
const waitLabel = (m: number) => (m < 1 ? '방금' : m < 60 ? `${m}분` : `${Math.floor(m / 60)}시간 ${m % 60}분`);

const Stat: React.FC<{ label: string; value: number; sub?: string; tone?: 'accent' | 'warn'; delay: number }> = ({ label, value, sub, tone, delay }) => (
  // 이름은 한 줄로 (줄바꿈되면 숫자 높이가 어긋남) — 넘치면 카드가 옆으로 늘어남
  <div className="shrink-0 whitespace-nowrap px-5 py-1">
    <p className="text-sm font-semibold text-ink-2">{label}</p>
    <p
      className={`mt-1 text-[1.9rem] font-bold leading-none tracking-tight ${
        value > 0 && tone === 'accent' ? 'text-accent-ink' : value > 0 && tone === 'warn' ? 'text-warn' : 'text-ink'
      }`}
    >
      <CountUp value={value} delay={delay} />
    </p>
    {sub && <p className="mt-1.5 truncate text-xs text-ink-3">{sub}</p>}
  </div>
);

const Row: React.FC<{ s: ListedSession; kind: 'waiting' | 'mine'; now: number; index: number }> = ({ s, kind, now, index }) => {
  const { role } = useChat(); // 근로장학생은 전부 선배 채팅이라 배지 생략
  const last = s.lastMessage;
  const preview = last
    ? `${last.sender === 'agent' ? '나: ' : ''}${last.attachment ? '📎 파일' : last.body}`
    : s.botContext?.length
      ? `“${s.botContext[s.botContext.length - 1]?.q}”`
      : '최근 호빗 대화 없음';
  const waited = minutesSince(s.createdAt, now);
  return (
    <li className="reveal" style={{ animationDelay: `${200 + index * 60}ms` }}>
      <Link
        to={`/chats?session=${s.id}`}
        onMouseEnter={() => prefetchRoute('/chats')}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-card"
      >
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${kind === 'waiting' ? 'animate-pulse bg-warn' : 'bg-success'}`} />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            {s.mode === 'senior' && role !== 'senior' && <Badge tone="senior">선배</Badge>}
            <LanguageBadge language={s.language} />
            <span className="truncate text-sm font-semibold text-ink">{s.studentEmail}</span>
          </span>
          <span className="mt-0.5 block truncate text-xs text-ink-2">{preview}</span>
        </span>
        {kind === 'waiting' ? (
          <span className={`shrink-0 text-xs font-semibold ${waited >= 5 ? 'text-danger' : 'text-warn'}`}>대기 {waitLabel(waited)}</span>
        ) : (s.unread ?? 0) > 0 ? (
          <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white">{s.unread}</span>
        ) : (
          <span className="shrink-0 text-xs text-ink-3">채팅 중</span>
        )}
      </Link>
    </li>
  );
};

const LiveChatCard: React.FC = () => {
  const { summary, connected, role, ready } = useChat();
  const [now, setNow] = useState(Date.now());

  // 대기 시간 표시를 30초마다 갱신
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  if (ready && !role) return null; // 채팅 서버에 연결할 수 없는 계정·상황 — 홈의 나머지는 그대로

  const waiting = summary?.waiting ?? [];
  const mine = summary?.mine ?? [];
  const oldest = waiting.length ? Math.max(...waiting.map((s) => minutesSince(s.createdAt, now))) : 0;
  const list = [...waiting.map((s) => ({ s, kind: 'waiting' as const })), ...mine.map((s) => ({ s, kind: 'mine' as const }))].slice(0, 4);
  const busy = waiting.length > 0 || (summary?.unread ?? 0) > 0;

  return (
    <Reveal index={0}>
      <section className={`mb-4 rounded-2xl border bg-surface p-5 ${busy ? 'border-accent-ink/40' : 'border-line'}`}>
        <div className="mb-4 flex items-center gap-3">
          <h2 className="font-bold text-ink">실시간 채팅</h2>
          <span className={`flex items-center gap-1.5 text-xs ${connected ? 'text-success' : 'text-ink-3'}`}>
            <i className={`h-2 w-2 rounded-full ${connected ? 'bg-success' : 'bg-ink-3'}`} />
            {connected ? '연결됨' : '연결 중…'}
          </span>
          {role === 'staff' && summary && <span className="text-xs text-ink-3">선배 {summary.seniorsAvailable}명 채팅 가능</span>}
          <Link to="/chats" onMouseEnter={() => prefetchRoute('/chats')} className="ml-auto text-sm font-semibold text-accent-ink hover:underline">
            채팅 화면 →
          </Link>
        </div>

        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
          {/* 네 칸을 같은 너비·같은 높이로 (가장 긴 이름에 맞춤) → 세로선 간격이 고름 */}
          <div className="grid auto-cols-fr grid-flow-col divide-x divide-line">
            <Stat label="대기" value={waiting.length} sub={waiting.length ? `가장 오래 ${waitLabel(oldest)}` : '없음'} tone="warn" delay={0} />
            <Stat label="내 진행 중" value={mine.length} sub={role === 'staff' && summary ? `전체 ${summary.activeCount}건` : undefined} delay={80} />
            <Stat
              label="안 읽은 메시지"
              value={summary?.unread ?? 0}
              // 행정실·개발자는 두 종류 채팅을 다 받으므로 나눠서 (근로장학생은 선배 채팅뿐)
              sub={role !== 'senior' && summary?.unreadByMode ? `행정실 ${summary.unreadByMode.staff} · 선배 ${summary.unreadByMode.senior}` : undefined}
              tone="accent"
              delay={160}
            />
            <Stat
              label="오늘 처리"
              value={summary?.closedToday ?? 0}
              sub={summary?.avgRatingToday ? `만족도 ★${summary.avgRatingToday}` : undefined}
              delay={240}
            />
          </div>
          {list.length ? (
            <ul className="flex flex-col">
              {list.map(({ s, kind }, i) => (
                <Row key={s.id} s={s} kind={kind} now={now} index={i} />
              ))}
            </ul>
          ) : (
            <p className="rounded-xl bg-card px-4 py-5 text-center text-sm text-ink-2">
              지금 기다리는 채팅이 없어요. 새 채팅이 오면 소리와 알림으로 알려드려요.
            </p>
          )}
        </div>
      </section>
    </Reveal>
  );
};

export default LiveChatCard;
