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
  replyToId?: number | null; // 답글이면 원래 메시지 id
};
/** 보낸 뒤 이 시간 안에만 내 메시지 수정·삭제 (서버도 같은 기준) */
export const EDIT_WINDOW_MS = 5 * 60 * 1000;
export type ChatSession = {
  id: string;
  mode: 'staff' | 'senior';
  program?: 'undergraduate' | 'graduate'; // 학부/대학원 (학생 화면 스위치) — 예전 서버는 없음
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
  unreadByMode?: { staff: number; senior: number }; // 행정실 채팅 / 근로장학생 채팅
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

export type ChatFeatures = { staff: boolean; senior: boolean; emailVerification: boolean };

/** 챗봇 설정 (답변 자유도·주변 장소·학식·과다 사용) — 채팅 서버 src/services/bot_settings.ts와 같은 모양 */
export type BotSettings = {
  temperature: number;
  maxTokens: number;
  placeEnabled: boolean;
  placeRadiusM: number;
  placeSize: number;
  blockFarPlace: boolean;
  menuEnabled: boolean;
  gradEnabled: boolean;
  sessionPerMin: number;
  sessionPerDay: number;
  ipPerMin: number;
  ipPerDay: number;
  maxQuestionChars: number;
  dailyCharBudget: number;
  repeatNoticeAt: number;
  repeatStrikeAt: number;
  meaninglessStrikeAt: number;
  warnLimit: number;
  suspendMinutes: [number, number, number];
  blockPersonalUse: boolean;
};
export type BotNumberKey = { [K in keyof BotSettings]: BotSettings[K] extends number ? K : never }[keyof BotSettings];
export type BotSettingsResponse = {
  settings: BotSettings;
  defaults: BotSettings;
  limits: Record<BotNumberKey | 'suspendMinutes', { min: number; max: number; step: number }>;
  updatedAt: string | null;
  updatedBy: string | null;
};

/** 정기 수집 (채팅 서버 src/services/crawl_pages.ts · RAG /crawl/status) */
export type CrawlPage = { url: string; title: string; enabled: boolean };
export type CrawlRun = {
  started_at: string | null;
  finished_at: string | null;
  scope: 'all' | 'boards' | 'static' | string | null;
  changes: { added?: number; updated?: number; deleted?: number; restored?: number };
  errors: number;
  problems: string[];
  custom_pages: { pages: number; items: number; errors: Record<string, string> } | null;
  custom_pages_error: string | null;
};
export type CrawlSchedule = { quickMin: number; boardsHours: number; allTime: string; recDay: number; recTime: string };
export type CrawlSources = { boards: boolean; infoPages: boolean; registrar: boolean; campusLife: boolean; customPages: boolean };
export type CrawlResponse = {
  pages: CrawlPage[];
  schedule: CrawlSchedule;
  sources: CrawlSources;
  defaults: { schedule: CrawlSchedule; sources: CrawlSources };
  options: { quickMin: number[]; boardsHours: number[] };
  tickAt: string | null;
  updatedAt: string | null;
  updatedBy: string | null;
  maxPages: number;
  status: { latest: { available: boolean; finished_at?: string; scope?: string; ok?: boolean; problems?: string[]; last_ok_at?: string }; runs: CrawlRun[] } | null;
};
export type CrawlPreview = { title: string; sections: number; chars: number; text: string };

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
  /** 종료된 채팅 기록 삭제 (메시지·첨부 파일까지, 되돌릴 수 없음) — 행정실·개발자 계정만 */
  deleteSessions: (ids: string[]) => call<{ deleted: number }>('POST', '/agent/sessions/delete', { ids }),
  /** 번역 미리보기 — 영어로 받는 학생에게 이 답변이 어떻게 번역돼 갈지 (보낼 때 서버가 같은 번역을 씀) */
  translatePreview: (sessionId: string, body: string) =>
    call<{ needed: boolean; translation: string | null }>('POST', `/agent/sessions/${sessionId}/translate-preview`, { body }),
  getHours: () => call<{ hours: HoursSettings }>('GET', '/agent/settings'),
  /** 채팅 켜고 끄기 — 행정실 채팅·근로장학생 채팅·학교 메일 인증 (끈 채팅은 호빗 화면에 안 보임) */
  getFeatures: () => call<{ features: ChatFeatures }>('GET', '/agent/features'),
  setFeatures: (features: Partial<ChatFeatures>) => call<{ features: ChatFeatures }>('PUT', '/agent/features', { features }),
  /** 챗봇 설정 — 보기는 담당자 누구나, 저장은 행정실·개발자만 (범위를 벗어난 값은 서버가 끝값으로 맞춤) */
  getBotSettings: () => call<BotSettingsResponse>('GET', '/agent/bot-settings'),
  setBotSettings: (settings: Partial<BotSettings>) => call<BotSettingsResponse>('PUT', '/agent/bot-settings', { settings }),
  /** 정기 수집 — 시간표·최근 기록·관리자가 더한 학교 페이지 (저장은 행정실·개발자만) */
  getCrawl: () => call<CrawlResponse>('GET', '/agent/crawl'),
  setCrawl: (body: { pages?: CrawlPage[]; schedule?: CrawlSchedule; sources?: Partial<CrawlSources> }) => call<CrawlResponse>('PUT', '/agent/crawl', body),
  previewCrawlPage: (url: string) => call<CrawlPreview>('POST', '/agent/crawl/preview', { url }),
  /** 학생 화면과 같은 상태 (운영 중·운영 시간 아님·자리 비움·꺼짐) */
  status: (mode: 'staff' | 'senior') =>
    call<{ open: boolean; reason: string; hours: { today: { start: string; end: string } | null } | null }>('GET', `/status?mode=${mode}`),
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
