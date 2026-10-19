import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Socket } from 'socket.io-client';
import { AccountRole, AgentRole, chatApi, ChatSession, ChatSummary, connectAgent, forgetAgentToken, getAgentToken } from '../../api/chat';

/**
 * 담당자 실시간 연결 — 로그인한 모든 화면에서 유지 (다른 메뉴를 보고 있어도 새 채팅 알림)
 * 알림: 소리 · 브라우저 알림(창이 안 보일 때) · 탭 제목 "(2) …" · 헤더 "채팅" 배지
 */
type ChatCtx = {
  ready: boolean;
  connected: boolean;
  role: AgentRole | null;
  accountRole: AccountRole | null; // 개발자 / 행정실 / 근로장학생 (관리자 사이트 권한)
  name: string | null;
  uid: number | null;
  waiting: ChatSession[];
  available: boolean;
  seniorsAvailable: number;
  setAvailable: (on: boolean) => void;
  socket: Socket | null;
  notifyPermission: NotificationPermission | 'unsupported';
  enableNotifications: () => void;
  summary: ChatSummary | null; // 홈·헤더용 (대기·내 채팅·안 읽음)
  refreshSummary: () => void;
};

const Ctx = createContext<ChatCtx>({
  ready: false,
  connected: false,
  role: null,
  accountRole: null,
  name: null,
  uid: null,
  waiting: [],
  available: false,
  seniorsAvailable: 0,
  setAvailable: () => undefined,
  socket: null,
  notifyPermission: 'unsupported',
  enableNotifications: () => undefined,
  summary: null,
  refreshSummary: () => undefined,
});

export const useChat = () => useContext(Ctx);

const BASE_TITLE = '호빗 관리자 사이트';

/** 새 채팅 알림음 (짧은 두 음) — 파일 없이 */
function chime() {
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AC();
    [880, 1320].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = freq;
      o.type = 'sine';
      g.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.16);
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + i * 0.16 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.16 + 0.25);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + i * 0.16);
      o.stop(ctx.currentTime + i * 0.16 + 0.3);
    });
    setTimeout(() => ctx.close(), 800);
  } catch {
    /* 소리 못 냄 (사용자 조작 전 등) */
  }
}

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/';
  const [state, setState] = useState<Omit<ChatCtx, 'setAvailable' | 'socket' | 'enableNotifications' | 'notifyPermission' | 'summary' | 'refreshSummary'>>({
    ready: false,
    connected: false,
    role: null,
    accountRole: null,
    name: null,
    uid: null,
    waiting: [],
    available: false,
    seniorsAvailable: 0,
  });
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifyPermission, setNotifyPermission] = useState<NotificationPermission | 'unsupported'>(
    typeof Notification === 'undefined' ? 'unsupported' : Notification.permission
  );
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;
  const [summary, setSummary] = useState<ChatSummary | null>(null);
  const summaryTimer = useRef<number | null>(null);

  // 요약은 이벤트가 몰려도 0.4초에 한 번만 다시 받음
  const refreshSummary = useCallback(() => {
    if (summaryTimer.current !== null) return;
    summaryTimer.current = window.setTimeout(() => {
      summaryTimer.current = null;
      chatApi.summary().then(setSummary).catch(() => undefined);
    }, 400);
  }, []);

  useEffect(() => {
    if (isAuthPage) return;
    let s: Socket | null = null;
    let cancelled = false;
    getAgentToken(true)
      .then((info) => {
        if (cancelled) return;
        setState((p) => ({ ...p, ready: true, role: info.role, accountRole: info.accountRole, name: info.name, uid: info.user_id }));
        s = connectAgent();
        setSocket(s);
        s.on('connect', () => {
          setState((p) => ({ ...p, connected: true }));
          refreshSummary();
        });
        // 새 메시지·채팅 변화가 있으면 요약(안 읽음 등) 갱신
        s.on('message', refreshSummary);
        s.on('session:update', refreshSummary);
        s.on('disconnect', () => setState((p) => ({ ...p, connected: false })));
        s.on('connect_error', () => forgetAgentToken()); // 다음 재연결 때 토큰 새로
        s.on('queue:update', (p: { waiting: ChatSession[] }) => {
          setState((st) => ({ ...st, waiting: p.waiting }));
          refreshSummary();
        });
        s.on('presence:self', (p: { available: boolean }) => setState((st) => ({ ...st, available: p.available })));
        s.on('presence:update', (p: { seniorsAvailable: number }) => setState((st) => ({ ...st, seniorsAvailable: p.seniorsAvailable })));
        s.on('session:new', (session: ChatSession) => {
          chime();
          if (typeof Notification !== 'undefined' && Notification.permission === 'granted' && document.hidden) {
            const n = new Notification(session.mode === 'senior' ? '새 선배 채팅 요청' : '새 채팅 요청', {
              body: `${session.studentEmail}${session.botContext?.length ? ` · "${session.botContext[session.botContext.length - 1]?.q}"` : ''}`,
              tag: session.id,
            });
            n.onclick = () => {
              window.focus();
              navigateRef.current(`/chats?session=${session.id}`);
              n.close();
            };
          }
        });
      })
      .catch(() => setState((p) => ({ ...p, ready: true, role: null, accountRole: null })));
    return () => {
      cancelled = true;
      s?.disconnect();
      setSocket(null);
    };
  }, [isAuthPage, refreshSummary]);

  // 탭 제목에 대기 수
  useEffect(() => {
    const n = state.waiting.length;
    document.title = n > 0 ? `(${n}) ${BASE_TITLE}` : BASE_TITLE;
  }, [state.waiting.length]);

  const setAvailable = useCallback(
    (on: boolean) => {
      socket?.emit('presence:set', { available: on }, (r: { available?: boolean }) =>
        setState((st) => ({ ...st, available: Boolean(r?.available) }))
      );
    },
    [socket]
  );

  const enableNotifications = useCallback(() => {
    if (typeof Notification === 'undefined') return;
    Notification.requestPermission().then(setNotifyPermission);
  }, []);

  return (
    <Ctx.Provider value={{ ...state, setAvailable, socket, notifyPermission, enableNotifications, summary, refreshSummary }}>
      {children}
    </Ctx.Provider>
  );
};
