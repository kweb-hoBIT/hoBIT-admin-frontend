import { io, Socket } from 'socket.io-client';
import envs from '../config/envs';

/**
 * 실시간 채팅 (담당자) — 토큰은 관리자 백엔드가 로그인 쿠키를 보고 발급 (15분),
 * 채팅 서버(hoBIT-backend)에는 그 토큰으로 붙음
 */
export const CHAT_SERVER = process.env.REACT_APP_HOBIT_CHAT_ENDPOINT || 'http://localhost:4001';
const CHAT_API = `${CHAT_SERVER}/api/v0/chat`;

export type AgentRole = 'staff' | 'senior'; // 채팅에서의 역할 (개발자는 staff)
export type AccountRole = 'developer' | 'staff' | 'senior'; // 관리자 사이트 계정 역할
export const ROLE_LABEL: Record<AccountRole, string> = { developer: '개발자', staff: '행정실', senior: '근로장학생' };
export type Attachment = { id: string; name: string; mime: string; size: number; width: number | null; height: number | null; url: string | null };
export type ChatMessage = {
  id: number;
  sessionId: string;
  sender: 'student' | 'agent' | 'system';
  senderName: string | null;
  body: string;
  createdAt: string;
  attachment: Attachment | null;
  translation: { text: string; lang: string } | null; // 자동 번역 (학생 영어 → 한국어 / 내 한국어 → 영어)
  senderUserId?: number | null; // 담당자 메시지를 보낸 계정
  editedAt?: string | null; // 보낸 사람이 고침
  removed?: boolean; // 보낸 사람이 지움 (내용 없음)
};
/** 보낸 뒤 이 시간 안에만 내 메시지 수정·삭제 (서버도 같은 기준) */
export const EDIT_WINDOW_MS = 5 * 60 * 1000;
export type ChatSession = {
  id: string;
  mode: 'staff' | 'senior';
  status: 'waiting' | 'active' | 'closed';
  studentEmail: string;
  language: string;
  studentLang: string | null; // en이면 자동 번역 중
  profile: Record<string, string> | null;
  botContext: { q: string; a: string }[] | null;
  assignedUserId: number | null;
  assignedName: string | null;
  createdAt: string;
  startedAt: string | null;
  closedAt: string | null;
  closedBy: string | null;
  rating: number | null;
  ratingComment: string | null;
};
/** 목록·요약에서 함께 오는 값 */
export type SessionExtras = {
  unread?: number;
  lastMessage?: { body: string; sender: string; createdAt: string; attachment: boolean } | null;
};
export type ListedSession = ChatSession & SessionExtras;
export type ChatSummary = {
  waiting: ListedSession[];
  mine: ListedSession[];
  activeCount: number;
  unread: number;
  unreadByMode?: { staff: number; senior: number }; // 행정실 채팅 / 선배 채팅
  closedToday: number;
  avgRatingToday: number | null;
  seniorsAvailable: number;
};

export type HourRange = { start: string; end: string };
export type HoursSettings = {
  semester: HourRange;
  vacation: HourRange;
  lunch: HourRange | null;
  weekdays: number[];
  semesters: { start: string; end: string }[];
  holidays: string[];
};

type TokenInfo = { token: string; role: AgentRole; accountRole: AccountRole; name: string; user_id: number; exp: number };
let cached: TokenInfo | null = null;
let pending: Promise<TokenInfo> | null = null;

/** 담당자 토큰 (만료 1분 전이면 새로) */
export function getAgentToken(force = false): Promise<TokenInfo> {
  if (!force && cached && Date.now() < cached.exp - 60_000) return Promise.resolve(cached);
  if (!pending) {
    pending = fetch(`${envs.HOBIT_ADMIN_BACKEND_ENDPOINT}/chat/token`, { credentials: 'include' })
      .then(async (r) => {
        if (!r.ok) throw new Error(`token ${r.status}`);
        const d = (await r.json()).data;
        cached = { token: d.token, role: d.role, accountRole: d.accountRole ?? d.role, name: d.name, user_id: d.user_id, exp: Date.now() + d.expiresIn * 1000 };
        return cached;
      })
      .finally(() => {
        pending = null;
      });
  }
  return pending;
}

export function forgetAgentToken() {
  cached = null;
}

async function call<T>(method: string, path: string, body?: unknown): Promise<T> {
  const { token } = await getAgentToken();
  const res = await fetch(`${CHAT_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body !== undefined && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.ok === false) throw Object.assign(new Error(json.message || json.error || 'error'), { status: res.status, code: json.error });
  return json as T;
}

export const chatApi = {
  sessions: (status: 'waiting' | 'active' | 'closed') => call<{ sessions: ListedSession[] }>('GET', `/agent/sessions?status=${status}`),
  summary: () => call<ChatSummary>('GET', '/agent/summary'),
  upload: (sessionId: string, file: File) => {
    const form = new FormData();
    form.append('file', file);
    return call<{ message: ChatMessage }>('POST', `/sessions/${sessionId}/attachments`, form);
  },
  fileLink: (attachmentId: string) => call<{ url: string }>('GET', `/attachments/${attachmentId}/link`),
  block: (sessionId: string, reason: string) => call('POST', '/agent/blocks', { sessionId, reason }),
  getHours: () => call<{ hours: HoursSettings }>('GET', '/agent/settings'),
  setHours: (hours: HoursSettings) => call<{ hours: HoursSettings }>('PUT', '/agent/settings', { hours }),
  /** 그 해 공휴일 (Google 대한민국 휴일 캘린더) — 골라서 휴무일에 추가 */
  getHolidays: (year: number) => call<{ year: number; holidays: { date: string; name: string }[] }>('GET', `/agent/holidays?year=${year}`),
};

export const fileUrl = (path: string) => `${CHAT_SERVER}${path}`;

/** 담당자 역할 관리 (관리자 백엔드) */
export const agentsApi = {
  list: async () => {
    const r = await fetch(`${envs.HOBIT_ADMIN_BACKEND_ENDPOINT}/chat/agents`, { credentials: 'include' });
    if (!r.ok) throw new Error(String(r.status));
    return (await r.json()).data.agents as { user_id: number; username: string; email: string; role: AccountRole }[];
  },
  setRole: async (userId: number, role: AccountRole) => {
    const r = await fetch(`${envs.HOBIT_ADMIN_BACKEND_ENDPOINT}/chat/agents/${userId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).message || String(r.status));
  },
};

export function connectAgent(): Socket {
  return io(CHAT_SERVER, {
    path: '/api/v0/chat/socket',
    // 다시 연결할 때마다 새 토큰 (15분 만료)
    auth: (cb) => {
      getAgentToken()
        .then((t) => cb({ kind: 'agent', token: t.token }))
        .catch(() => cb({ kind: 'agent', token: '' }));
    },
    transports: ['websocket', 'polling'],
  });
}
