import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { chatApi, ChatMessage, ChatSession, EDIT_WINDOW_MS, fileUrl, ListedSession } from '../../api/chat';
import { useChat } from './ChatProvider';
import { appAlert, appConfirm } from '../ui/Dialog';
import SlidingIndicator from '../ui/SlidingIndicator';
import Segmented from '../ui/Segmented';
import LanguageBadge from '../ui/LanguageBadge';
import Badge from '../ui/Badge';
import ChatSettings from './ChatSettings';

/**
 * 채팅 화면 (담당자) — 왼쪽: 대기·진행·종료 목록 / 가운데: 대화 / 오른쪽: 학생 정보·최근 호빗 대화
 */
type Tab = 'waiting' | 'active' | 'closed';

const PROFILE_LABEL: Record<string, string> = {
  program: '과정',
  name: '이름',
  student_id: '학번',
  department: '학과',
  student_status: '학적',
  admission_year: '입학년도',
  grade: '학년',
  major_type: '전공 유형',
};
const PROFILE_ORDER = Object.keys(PROFILE_LABEL);
const PROGRAM_LABEL: Record<string, string> = { undergrad: '학부', grad: '대학원' };
type ProgramFilter = 'all' | 'undergrad' | 'grad';
/** 과정으로 거르기 — 과정 정보가 없는 예전 채팅은 '전체'에서만 보임 */
const byProgram = (f: ProgramFilter) => (s: { profile?: Record<string, string> | null }) => f === 'all' || s.profile?.program === f;

const ago = (iso: string) => {
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 1) return '방금';
  if (min < 60) return `${min}분 전`;
  const h = Math.floor(min / 60);
  return h < 24 ? `${h}시간 전` : `${Math.floor(h / 24)}일 전`;
};
const clock = (iso: string) => new Date(iso).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
const size = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)}MB` : `${Math.max(1, Math.round(n / 1024))}KB`);

const ERRORS: Record<string, string> = {
  taken: '다른 담당자가 먼저 채팅을 시작했어요.',
  forbidden: '이 채팅에 대한 권한이 없어요.',
  closed: '이미 종료된 채팅이에요.',
  not_started: '채팅을 시작한 뒤에 보낼 수 있어요.',
  rate_limited: '너무 빠르게 보내고 있어요.',
  too_long: '메시지가 너무 길어요 (2,000자까지).',
  edit_expired: '보낸 지 5분이 지나 고치거나 지울 수 없어요.',
  not_editable: '파일은 고칠 수 없어요. 지우고 다시 보내 주세요.',
  removed: '이미 지운 메시지예요.',
};

/** 내 말풍선 옆 ⋯ — 수정(글만)·삭제 (보낸 뒤 5분 안) */
const MessageMenu: React.FC<{ canEdit: boolean; onEdit: () => void; onRemove: () => void }> = ({ canEdit, onEdit, onRemove }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  return (
    <div ref={ref} className="relative shrink-0 self-center">
      <button
        type="button"
        aria-label="메시지 메뉴"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-7 w-7 items-center justify-center rounded-full text-ink-3 transition-opacity hover:bg-card hover:text-ink-2 focus-visible:opacity-100 ${
          open ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <circle cx="5" cy="12" r="1.8" />
          <circle cx="12" cy="12" r="1.8" />
          <circle cx="19" cy="12" r="1.8" />
        </svg>
      </button>
      {open && (
        <div role="menu" className="pop-menu absolute bottom-full right-0 z-10 mb-1 min-w-[104px] rounded-xl border border-line bg-surface p-1 shadow-lg">
          {canEdit && (
            <button type="button" role="menuitem" onClick={() => (setOpen(false), onEdit())} className="block w-full rounded-lg px-3 py-1.5 text-left text-sm font-semibold text-ink hover:bg-card">
              수정
            </button>
          )}
          <button type="button" role="menuitem" onClick={() => (setOpen(false), onRemove())} className="block w-full rounded-lg px-3 py-1.5 text-left text-sm font-semibold text-danger hover:bg-danger-soft">
            삭제
          </button>
        </div>
      )}
    </div>
  );
};

const Bubble: React.FC<{ m: ChatMessage; canModify?: boolean; onEdit?: () => void; onRemove?: () => void }> = ({ m, canModify, onEdit, onRemove }) => {
  const [showOriginal, setShowOriginal] = useState(false);
  if (m.sender === 'system')
    return (
      <p className="my-3 text-center text-[13px] text-ink-3">
        {m.body}
        {/* 학생에게는 역할만, 담당자 화면에는 누가 들어왔는지 */}
        {m.senderName && <span className="ml-1 font-semibold text-ink-2">({m.senderName})</span>}
      </p>
    );
  const mine = m.sender === 'agent';
  if (m.removed) {
    // 지운 메시지 — 자리만 남김 (내용·첨부는 서버에서 실제로 지움)
    return (
      <div className={`my-2 flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
        <div className={`flex items-end gap-1.5 ${mine ? 'flex-row-reverse' : ''}`}>
          <span className="rounded-2xl border border-dashed border-line px-3.5 py-1.5 text-[13px] italic text-ink-3">삭제된 메시지예요</span>
          <span className="shrink-0 text-[11px] text-ink-3">{clock(m.createdAt)}</span>
        </div>
      </div>
    );
  }
  // 학생 메시지: 한국어 번역을 먼저, 원문은 눌러서 / 내 메시지: 내가 쓴 한국어 + 학생에게 간 영어
  const studentTranslated = !mine && m.translation?.lang === 'ko';
  const open = async () => {
    if (!m.attachment) return;
    try {
      const { url } = await chatApi.fileLink(m.attachment.id);
      window.open(fileUrl(url), '_blank', 'noopener,noreferrer');
    } catch {
      appAlert('파일을 열 수 없어요. 보관 기간이 지나 삭제되었을 수 있어요.');
    }
  };
  return (
    <div className={`my-2 flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
      {/* 보낸 담당자 이름은 붙이지 않음 — 다른 담당자가 들어오면 "OO 담당자가 연결되었어요" 안내가 대신 */}
      <div className={`group flex items-end gap-1.5 ${mine ? 'flex-row-reverse' : ''}`}>
        {m.attachment ? (
          // 첨부는 말풍선 없이 — 사진은 사진만, PDF는 흰 파일 카드
          !m.attachment.url ? (
            <span className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink-3">보관 기간이 지나 삭제된 파일</span>
          ) : m.attachment.mime.startsWith('image/') ? (
            <button type="button" onClick={open} className="block overflow-hidden rounded-2xl border border-line" aria-label={m.attachment.name}>
              <img src={fileUrl(m.attachment.url)} alt={m.attachment.name} className="block max-h-[280px] max-w-[320px] object-cover" />
            </button>
          ) : (
            <button
              type="button"
              onClick={open}
              className="flex max-w-[360px] items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-2.5 text-left hover:bg-card"
            >
              <span className="flex h-10 w-8 shrink-0 items-end justify-center rounded-md bg-[#e5484d] pb-1 text-[10px] font-bold text-white">PDF</span>
              <span className="min-w-0">
                <span className="block truncate text-[15px] font-semibold text-ink">{m.attachment.name}</span>
                <span className="text-xs text-ink-3">PDF · {size(m.attachment.size)}</span>
              </span>
            </button>
          )
        ) : (
          <div
            className={`max-w-[460px] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-[14px] leading-[1.5] ${
              mine ? 'rounded-br-md bg-accent text-white' : 'rounded-bl-md bg-card text-ink'
            }`}
          >
            {studentTranslated && !showOriginal ? m.translation!.text : m.body}
          </div>
        )}
        <span className="shrink-0 text-[11px] text-ink-3">
          {m.editedAt && '수정됨 · '}
          {clock(m.createdAt)}
        </span>
        {canModify && onRemove && <MessageMenu canEdit={!m.attachment && !!onEdit} onEdit={onEdit ?? (() => undefined)} onRemove={onRemove} />}
      </div>
      {studentTranslated && (
        <button type="button" onClick={() => setShowOriginal((v) => !v)} className="ml-1 mt-0.5 flex items-center gap-1 text-[11px] text-ink-3 hover:text-ink">
          <span className="rounded bg-link/15 px-1 font-bold text-link">EN</span>
          {showOriginal ? '번역 보기' : '자동 번역됨 · 원문 보기'}
        </button>
      )}
      {mine && m.translation?.lang === 'en' && (
        <p className="mr-1 mt-0.5 max-w-[460px] text-right text-[11px] text-ink-3">
          <span className="mr-1 rounded bg-link/15 px-1 font-bold text-link">EN</span>학생에게: {m.translation.text}
        </p>
      )}
    </div>
  );
};

/** 칸 사이 세로선 — 끌어서 너비 조절, 두 번 클릭하면 기본 너비, 키보드 ←→ */
const ResizeHandle: React.FC<{ label: string; onDrag: (dx: number, start: boolean) => void; onReset: () => void; onKey: (dir: -1 | 1) => void }> = ({
  label,
  onDrag,
  onReset,
  onKey,
}) => (
  <div
    role="separator"
    aria-orientation="vertical"
    aria-label={label}
    tabIndex={0}
    onDoubleClick={onReset}
    onKeyDown={(e) => {
      if (e.key === 'ArrowLeft') onKey(-1);
      if (e.key === 'ArrowRight') onKey(1);
    }}
    onPointerDown={(e) => {
      e.preventDefault();
      const el = e.currentTarget;
      const x0 = e.clientX;
      el.setPointerCapture(e.pointerId);
      document.body.style.userSelect = 'none';
      onDrag(0, true);
      const move = (ev: PointerEvent) => onDrag(ev.clientX - x0, false);
      const end = () => {
        document.body.style.userSelect = '';
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerup', end);
        el.removeEventListener('pointercancel', end);
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', end);
      el.addEventListener('pointercancel', end);
    }}
    className="group relative z-10 -mx-1 w-2 shrink-0 cursor-col-resize outline-none"
  >
    <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-line transition-colors group-hover:w-0.5 group-hover:bg-accent-ink/50 group-focus-visible:bg-accent-ink" />
  </div>
);

const LAYOUT_KEY = 'hobit-admin-chat-layout';
const LIST_W = { def: 300, min: 220, max: 480 };
const INFO_W = { def: 320, min: 240, max: 560 };
const clampW = (w: number, r: { min: number; max: number }) => Math.round(Math.min(r.max, Math.max(r.min, w)));
const MIN_CONV = 380; // 대화 칸 최소 너비 — 이보다 좁으면 버튼·글자가 세로로 쪼개졌음
const HANDLES = 16;

/** 화면(틀) 너비에 맞춘 실제 너비 — 학생 정보 칸부터 줄이고, 그다음 목록, 그래도 안 되면 학생 정보 칸을 접음 */
function fitLayout(l: Layout, total: number): { list: number; info: number; infoShown: boolean } {
  if (!total) return { list: l.list, info: l.info, infoShown: l.infoOpen };
  const room = total - MIN_CONV - HANDLES;
  let list = l.list;
  let info = l.infoOpen ? l.info : 0;
  if (list + info > room && l.infoOpen) info = Math.max(INFO_W.min, room - list);
  if (list + info > room) list = Math.max(LIST_W.min, room - info);
  if (l.infoOpen && list + info > room) return { list: Math.max(LIST_W.min, Math.min(list, room)), info: 0, infoShown: false };
  return { list, info, infoShown: l.infoOpen };
}
type Layout = { list: number; info: number; infoOpen: boolean };
const loadLayout = (): Layout => {
  const fallback = { list: LIST_W.def, info: INFO_W.def, infoOpen: window.innerWidth >= 1400 };
  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(LAYOUT_KEY) || '{}') };
  } catch {
    return fallback;
  }
};

const ChatMain: React.FC = () => {
  const chat = useChat();
  const { socket, role, uid, waiting } = chat;
  const [params, setParams] = useSearchParams();
  const [tab, setTab] = useState<Tab>('waiting');
  const [program, setProgram] = useState<ProgramFilter>('all'); // 학부 / 대학원 탭
  const [lists, setLists] = useState<{ active: ListedSession[]; closed: ListedSession[] }>({ active: [], closed: [] });
  const [selectedId, setSelectedId] = useState<string | null>(params.get('session'));
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [studentTyping, setStudentTyping] = useState(false);
  const [unread, setUnread] = useState<Record<string, number>>({});
  const [uploading, setUploading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  // 칸 너비·학생 정보 칸 펼침 — 이 기기에 기억
  const [layout, setLayout] = useState<Layout>(loadLayout);
  const dragStart = useRef(0);
  const frameRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [frameW, setFrameW] = useState(0);
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setFrameW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const fit = fitLayout(layout, frameW);
  // 끌 때 다른 칸을 밀어내지 않는 범위까지만
  const listMax = Math.min(LIST_W.max, Math.max(LIST_W.min, frameW - MIN_CONV - HANDLES - fit.info));
  const infoMax = Math.min(INFO_W.max, Math.max(INFO_W.min, frameW - MIN_CONV - HANDLES - fit.list));
  // 좁은 화면에서 위에 겹쳐 뜨는 학생 정보 칸 — 이것도 끌어서 너비 조절
  // 대화가 다 가려지지 않게 대화 칸의 55%까지만 (대화 칸 = 틀 - 목록)
  const overlayMax = Math.min(INFO_W.max, Math.max(INFO_W.min, Math.round((frameW - fit.list - HANDLES) * 0.55)));
  const overlayW = clampW(layout.info, { min: INFO_W.min, max: overlayMax });
  const saveLayout = (next: Layout) => {
    setLayout(next);
    try {
      localStorage.setItem(LAYOUT_KEY, JSON.stringify(next));
    } catch {
      /* 이번 화면에서만 */
    }
  };
  const listRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const typingTimer = useRef<number | null>(null);
  const lastTyping = useRef(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 답변 입력칸: 줄 수에 맞춰 늘어남 (Shift+Enter 줄바꿈, 최대 8줄)
  useLayoutEffect(() => {
    const ta = inputRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    const cs = getComputedStyle(ta);
    const line = parseFloat(cs.lineHeight) || 22;
    ta.style.height = `${Math.min(ta.scrollHeight, line * 8 + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom))}px`;
  }, [text, session?.id]);
  const selectedRef = useRef<string | null>(selectedId);
  selectedRef.current = selectedId;

  const refreshLists = useCallback(async () => {
    try {
      const [a, c] = await Promise.all([chatApi.sessions('active'), chatApi.sessions('closed')]);
      setLists({ active: a.sessions, closed: c.sessions });
      // 안 읽은 수는 서버 기준 (새로고침·다른 화면에 있었어도 정확)
      setUnread(Object.fromEntries(a.sessions.filter((x) => x.id !== selectedRef.current).map((x) => [x.id, x.unread ?? 0])));
    } catch {
      /* 다음 갱신 때 */
    }
  }, []);

  useEffect(() => {
    if (chat.connected) refreshLists();
  }, [chat.connected, refreshLists]);

  // 채팅방 들어가기 (기록 받기)
  const join = useCallback(
    (id: string) => {
      if (!socket) return;
      socket.emit('session:join', { sessionId: id }, (r: any) => {
        if (!r?.ok) return appAlert(ERRORS[r?.error] ?? '채팅을 열 수 없어요.');
        setSession(r.session);
        setMessages(r.messages);
        setUnread((u) => ({ ...u, [id]: 0 }));
        chat.refreshSummary(); // 서버가 읽음 처리함 → 헤더 배지·홈 갱신
      });
    },
    [socket]
  );

  useEffect(() => {
    if (selectedId && chat.connected) join(selectedId);
  }, [selectedId, chat.connected, join]);

  // 실시간 이벤트
  useEffect(() => {
    if (!socket) return;
    const onMessage = (m: ChatMessage) => {
      if (m.sessionId === selectedRef.current) {
        setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
        if (m.sender === 'student') {
          setStudentTyping(false);
          socket.emit('session:read', { sessionId: m.sessionId }); // 보고 있으니 읽음
        }
      } else if (m.sender === 'student') {
        setUnread((u) => ({ ...u, [m.sessionId]: (u[m.sessionId] ?? 0) + 1 }));
      }
    };
    const onUpdate = (s: ChatSession) => {
      if (s.id === selectedRef.current) setSession(s);
      refreshLists();
    };
    const onTyping = (p: { sessionId: string; from: string }) => {
      if (p.sessionId !== selectedRef.current || p.from !== 'student') return;
      setStudentTyping(true);
      if (typingTimer.current) window.clearTimeout(typingTimer.current);
      typingTimer.current = window.setTimeout(() => setStudentTyping(false), 3000);
    };
    // 자동 번역이 늦게 도착 — 그 메시지에 덧붙임
    const onTranslated = (p: { id: number; sessionId: string; translation: ChatMessage['translation'] }) => {
      if (p.sessionId !== selectedRef.current) return;
      setMessages((prev) => prev.map((x) => (x.id === p.id ? { ...x, translation: p.translation } : x)));
    };
    // 고치거나 지운 메시지 (나·학생 모두)
    const onUpdated = (m: ChatMessage) => {
      if (m.sessionId !== selectedRef.current) return;
      setMessages((prev) => prev.map((x) => (x.id === m.id ? m : x)));
    };
    socket.on('message', onMessage);
    socket.on('message:translated', onTranslated);
    socket.on('message:updated', onUpdated);
    socket.on('session:update', onUpdate);
    socket.on('typing', onTyping);
    return () => {
      socket.off('message:translated', onTranslated);
      socket.off('message:updated', onUpdated);
      socket.off('message', onMessage);
      socket.off('session:update', onUpdate);
      socket.off('typing', onTyping);
    };
  }, [socket, refreshLists]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length, studentTyping]);

  const select = (id: string) => {
    setSelectedId(id);
    setParams({ session: id }, { replace: true });
  };

  const claim = () => {
    if (!socket || !session) return;
    socket.emit('session:claim', { sessionId: session.id }, (r: any) => {
      if (!r?.ok) return appAlert(ERRORS[r?.error] ?? '채팅을 시작하지 못했어요.');
      setSession(r.session);
      setMessages(r.messages);
      setTab('active');
      refreshLists();
    });
  };

  // 내 메시지 수정·삭제 (보낸 뒤 5분 안)
  const [editing, setEditing] = useState<ChatMessage | null>(null);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 15_000);
    return () => window.clearInterval(id);
  }, []);
  useEffect(() => setEditing(null), [session?.id]);
  const canModify = (m: ChatMessage) =>
    m.sender === 'agent' && m.senderUserId === uid && !m.removed && session?.status !== 'closed' && now - new Date(m.createdAt).getTime() < EDIT_WINDOW_MS;
  const startEdit = (m: ChatMessage) => {
    setEditing(m);
    setText(m.body);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  };
  const cancelEdit = () => {
    setEditing(null);
    setText('');
  };
  const removeMsg = async (m: ChatMessage) => {
    if (!socket || !(await appConfirm('이 메시지를 삭제할까요? 학생 화면에서도 사라지고 되돌릴 수 없어요.', { danger: true }))) return;
    socket.emit('message:remove', { messageId: m.id }, (r: any) => {
      if (!r?.ok) return appAlert(ERRORS[r?.error] ?? '지우지 못했어요.');
      setMessages((prev) => prev.map((x) => (x.id === m.id ? r.message : x)));
    });
    if (editing?.id === m.id) cancelEdit();
  };

  const send = () => {
    const body = text.trim();
    if (!body || !socket || !session) return;
    if (editing) {
      if (body === editing.body) return cancelEdit();
      socket.emit('message:edit', { messageId: editing.id, body }, (r: any) => {
        if (!r?.ok) return appAlert(ERRORS[r?.error] ?? '고치지 못했어요.');
        setMessages((prev) => prev.map((x) => (x.id === r.message.id ? r.message : x)));
        cancelEdit();
      });
      return;
    }
    socket.emit('message:send', { sessionId: session.id, body }, (r: any) => {
      if (!r?.ok) return appAlert(ERRORS[r?.error] ?? '보내지 못했어요.');
      setMessages((prev) => (prev.some((x) => x.id === r.message.id) ? prev : [...prev, r.message]));
      setText('');
    });
  };

  const onType = (v: string) => {
    setText(v);
    if (session && Date.now() - lastTyping.current > 2000 && v.trim()) {
      lastTyping.current = Date.now();
      socket?.emit('typing', { sessionId: session.id });
    }
  };

  const upload = async (file?: File) => {
    if (!file || !session) return;
    setUploading(true);
    try {
      const r = await chatApi.upload(session.id, file);
      setMessages((prev) => (prev.some((x) => x.id === r.message.id) ? prev : [...prev, r.message]));
    } catch {
      appAlert('파일을 올리지 못했어요. 사진(JPG·PNG·WEBP·GIF)이나 PDF, 10MB까지 보낼 수 있어요.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const end = async () => {
    if (!session || !(await appConfirm('채팅을 종료할까요? 학생에게 만족도 평가가 표시돼요.'))) return;
    socket?.emit('session:close', { sessionId: session.id }, (r: any) => {
      if (!r?.ok) appAlert(ERRORS[r?.error] ?? '종료하지 못했어요.');
      refreshLists();
    });
  };

  const block = async () => {
    if (!session || !(await appConfirm(`${session.studentEmail} 학생을 차단할까요?\n채팅이 종료되고, 이 메일로는 다시 채팅할 수 없어요.`, { danger: true }))) return;
    try {
      await chatApi.block(session.id, '담당자 차단');
      refreshLists();
    } catch {
      appAlert('차단하지 못했어요.');
    }
  };

  const items = (tab === 'waiting' ? waiting : lists[tab]).filter(byProgram(program));
  const waitingOf = (f: ProgramFilter) => waiting.filter(byProgram(f)).length;
  const canWrite = session?.status === 'active' && (role === 'staff' || session.assignedUserId === uid);
  const totalUnread = useMemo(() => Object.values(unread).reduce((a, b) => a + b, 0), [unread]);

  return (
    <div className="py-6">
      {/* 상단: 연결 상태 · (근로장학생) 채팅 가능 · (행정실) 설정 */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="text-[1.9rem] font-bold text-ink">채팅</h1>
        <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm ${chat.connected ? 'bg-success-soft text-success' : 'bg-card text-ink-3'}`}>
          <i className={`h-2 w-2 rounded-full ${chat.connected ? 'bg-success' : 'bg-ink-3'}`} />
          {chat.connected ? '실시간 연결됨' : '연결 중…'}
        </span>
        {role === 'senior' && (
          <button
            type="button"
            onClick={() => chat.setAvailable(!chat.available)}
            aria-pressed={chat.available}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              chat.available ? 'bg-success text-white' : 'bg-card text-ink-2 hover:bg-card-2'
            }`}
          >
            <span className={`relative h-5 w-9 rounded-full ${chat.available ? 'bg-white/30' : 'bg-card-3'}`}>
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${chat.available ? 'left-[18px]' : 'left-0.5'}`} />
            </span>
            {chat.available ? '채팅 가능' : '자리비움'}
          </button>
        )}
        {role === 'staff' && (
          <span className="text-sm text-ink-3">선배 {chat.seniorsAvailable}명 채팅 가능</span>
        )}
        <div className="ml-auto flex items-center gap-2">
          {chat.notifyPermission === 'default' && (
            <button type="button" onClick={chat.enableNotifications} className="rounded-full bg-card px-4 py-2 text-sm font-semibold text-ink hover:bg-card-2">
              🔔 브라우저 알림 켜기
            </button>
          )}
          {role === 'staff' && (
            <button type="button" onClick={() => setShowSettings(true)} className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink-2 hover:bg-card">
              채팅 설정
            </button>
          )}
        </div>
      </div>

      <div ref={frameRef} className="relative flex h-[calc(100vh-11.5rem)] min-h-[520px] overflow-hidden rounded-2xl border border-line bg-surface">
        {/* 목록 */}
        <aside className="flex min-h-0 shrink-0 flex-col" style={{ width: fit.list }}>
          {/* 학부 / 대학원 — 대기 수를 함께 */}
          {/* 높이를 오른쪽 대화 머리(학생 메일·상태)와 같게 — 아래 선이 한 줄로 이어짐 */}
          <div className="flex h-[62px] shrink-0 items-center border-b border-line px-3">
            <Segmented
              className="w-full"
              stretch
              itemClassName="py-1.5"
              options={[
                ['all', `전체${waitingOf('all') ? ` ${waitingOf('all')}` : ''}`],
                ['undergrad', `학부${waitingOf('undergrad') ? ` ${waitingOf('undergrad')}` : ''}`],
                ['grad', `대학원${waitingOf('grad') ? ` ${waitingOf('grad')}` : ''}`],
              ] as const}
              value={program}
              onChange={setProgram}
            />
          </div>
          <div ref={tabsRef} className="relative flex border-b border-line px-2" role="tablist">
            <SlidingIndicator containerRef={tabsRef} activeKey={tab} variant="underline" className="bg-accent-ink" />
            {([
              ['waiting', `대기 ${waiting.filter(byProgram(program)).length}`],
              ['active', `진행 ${lists.active.filter(byProgram(program)).length}`],
              ['closed', '종료'],
            ] as [Tab, string][]).map(([key, label]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={tab === key}
                data-active={tab === key ? 'true' : undefined}
                onClick={() => setTab(key)}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  tab === key ? 'text-accent-ink' : 'text-ink-2 hover:text-ink'
                }`}
              >
                {label}
                {key === 'active' && totalUnread > 0 && <span className="ml-1 rounded-full bg-accent px-1.5 text-xs text-white">{totalUnread}</span>}
              </button>
            ))}
          </div>
          <ul className="min-h-0 flex-1 overflow-y-auto">
            {items.length === 0 && <li className="px-4 py-10 text-center text-sm text-ink-3">{tab === 'waiting' ? '기다리는 채팅이 없어요' : '채팅이 없어요'}</li>}
            {items.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => select(s.id)}
                  className={`flex w-full flex-col gap-1 border-b border-line px-4 py-3 text-left hover:bg-card ${selectedId === s.id ? 'bg-card' : ''}`}
                >
                  <span className="flex items-center gap-2">
                    {s.mode === 'senior' && role !== 'senior' && <Badge tone="senior">선배</Badge>}
                    {s.profile?.program && <Badge tone="accent">{PROGRAM_LABEL[s.profile.program] ?? s.profile.program}</Badge>}
                    <LanguageBadge language={s.language} />
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">
                      {s.profile?.name ? `${s.profile.name}${s.profile.student_id ? ` · ${s.profile.student_id}` : ''}` : s.studentEmail}
                    </span>
                    {(unread[s.id] ?? 0) > 0 && <span className="rounded-full bg-accent px-1.5 text-xs text-white">{unread[s.id]}</span>}
                  </span>
                  <span className="truncate text-xs text-ink-2">
                    {s.botContext?.length ? `“${s.botContext[s.botContext.length - 1]?.q}”` : s.profile?.department ?? '최근 호빗 대화 없음'}
                  </span>
                  <span className="text-[11px] text-ink-3">
                    {tab === 'closed' && s.closedAt ? `${ago(s.closedAt)} 종료${s.rating ? ` · ★${s.rating}` : ''}` : `${ago(s.createdAt)} 요청`}
                    {s.assignedName && tab !== 'waiting' ? ` · ${s.assignedName}` : ''}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* 대화 */}
        <ResizeHandle
          label="목록 너비 조절"
          onDrag={(dx, start) => {
            if (start) dragStart.current = fit.list;
            else saveLayout({ ...layout, list: clampW(dragStart.current + dx, { min: LIST_W.min, max: listMax }) });
          }}
          onReset={() => saveLayout({ ...layout, list: LIST_W.def })}
          onKey={(dir) => saveLayout({ ...layout, list: clampW(fit.list + dir * 24, { min: LIST_W.min, max: listMax }) })}
        />

        <section className="flex min-h-0 min-w-0 flex-1 flex-col">
          {!session ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-ink-3">
              <p className="text-lg font-semibold text-ink-2">채팅을 고르세요</p>
              <p className="text-sm">새 채팅이 들어오면 소리와 알림으로 알려드려요.</p>
            </div>
          ) : (
            <>
              <div className="flex h-[62px] shrink-0 items-center gap-3 border-b border-line px-5">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">{session.studentEmail}</p>
                  <p className="mt-0.5 flex min-w-0 items-center gap-2 overflow-hidden text-[13px] text-ink-3">
                    <span className="truncate">
                      {session.status === 'waiting' ? '대기 중' : session.status === 'active' ? `${session.assignedName} 채팅 중` : '종료됨'}
                    </span>
                    {(session.studentLang === 'en' || session.language === 'EN') && (
                      <span className="shrink-0 rounded-full bg-link/15 px-2 py-0.5 font-semibold text-link" title="자동 번역 EN ↔ 한국어">
                        자동 번역 EN ↔ 한국어
                      </span>
                    )}
                  </p>
                </div>
                {session.status === 'waiting' && (
                  <button type="button" onClick={claim} className="shrink-0 whitespace-nowrap rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-accent/90">
                    채팅 시작
                  </button>
                )}
                {session.status !== 'closed' && session.status !== 'waiting' && (role === 'staff' || session.assignedUserId === uid) && (
                  <button type="button" onClick={end} className="shrink-0 whitespace-nowrap rounded-full bg-card px-4 py-2 text-sm font-semibold text-ink hover:bg-card-2">
                    채팅 종료
                  </button>
                )}
                {role === 'staff' && session.status !== 'closed' && (
                  <button type="button" onClick={block} className="shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold text-danger hover:bg-danger-soft">
                    차단
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => saveLayout({ ...layout, infoOpen: !layout.infoOpen })}
                  aria-pressed={layout.infoOpen}
                  title={layout.infoOpen ? '학생 정보 접기' : '학생 정보·최근 호빗 대화 보기'}
                  className={`flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-sm font-semibold transition-colors ${
                    layout.infoOpen ? 'bg-card text-ink' : 'text-ink-2 hover:bg-card hover:text-ink'
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="16" rx="3" />
                    <path d="M15 4v16" />
                  </svg>
                  학생 정보
                  {!layout.infoOpen && (session.botContext?.length ?? 0) > 0 && (
                    <span className="rounded-full bg-accent px-1.5 text-xs text-white">{session.botContext!.length}</span>
                  )}
                </button>
              </div>
              <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                {messages.map((m) => (
                  <Bubble key={m.id} m={m} canModify={canModify(m)} onEdit={() => startEdit(m)} onRemove={() => removeMsg(m)} />
                ))}
                {studentTyping && <p className="ml-1 text-xs text-ink-3">학생이 입력 중…</p>}
                {session.status === 'closed' && session.rating && (
                  <p className="mt-3 text-center text-sm text-ink-2">
                    만족도 {'★'.repeat(session.rating)}
                    {session.ratingComment ? ` · “${session.ratingComment}”` : ''}
                  </p>
                )}
              </div>
              {canWrite ? (
                <div className="border-t border-line">
                {editing && (
                  <div className="flex items-center justify-between bg-card px-5 py-1.5 text-xs">
                    <span className="flex min-w-0 items-center gap-1.5 text-ink-2">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
                        <path d="M4 20h4L19 9l-4-4L4 16v4Z" />
                      </svg>
                      <span className="shrink-0 font-semibold">메시지 수정 중</span>
                      <span className="truncate text-ink-3">{editing.body}</span>
                    </span>
                    <button type="button" onClick={cancelEdit} className="ml-2 shrink-0 rounded-full px-2 py-0.5 font-semibold text-ink-2 hover:bg-card-2">
                      취소 (Esc)
                    </button>
                  </div>
                )}
                <div className="flex items-end gap-2 px-4 py-3">
                  <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,application/pdf" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
                  <button
                    type="button"
                    title="파일 첨부 (사진·PDF, 10MB)"
                    disabled={uploading}
                    onClick={() => fileRef.current?.click()}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-2 hover:bg-card disabled:opacity-40"
                  >
                    {uploading ? (
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-accent-ink" />
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                        <path d="M21 11.5 12.5 20a5 5 0 0 1-7-7l9-9a3.3 3.3 0 0 1 4.7 4.7l-9 9a1.7 1.7 0 0 1-2.4-2.4l8.3-8.3" />
                      </svg>
                    )}
                  </button>
                  <textarea
                    ref={inputRef}
                    value={text}
                    onChange={(e) => onType(e.target.value.slice(0, 2000))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                        e.preventDefault();
                        send();
                      }
                      if (e.key === 'Escape' && editing) cancelEdit();
                    }}
                    rows={1}
                    placeholder={session.studentLang === 'en' || session.language === 'EN' ? '한국어로 쓰면 영어로 번역돼 전달돼요 · Shift+Enter 줄바꿈' : '답변을 입력하세요 · Shift+Enter 줄바꿈'}
                    className="flex-1 resize-none overflow-y-auto rounded-2xl border border-line px-4 py-2.5"
                  />
                  <button type="button" onClick={send} disabled={!text.trim()} className="h-11 shrink-0 rounded-full bg-accent px-5 font-semibold text-white disabled:opacity-40">
                    {editing ? '수정' : '보내기'}
                  </button>
                </div>
                </div>
              ) : (
                session.status === 'active' && <p className="border-t border-line px-5 py-3 text-sm text-ink-3">{session.assignedName} 담당자가 맡은 채팅이에요.</p>
              )}
            </>
          )}
        </section>

        {/* 학생 정보 */}
        {fit.infoShown && (
          <ResizeHandle
            label="학생 정보 너비 조절"
            onDrag={(dx, start) => {
              if (start) dragStart.current = fit.info;
              else saveLayout({ ...layout, info: clampW(dragStart.current - dx, { min: INFO_W.min, max: infoMax }) });
            }}
            onReset={() => saveLayout({ ...layout, info: INFO_W.def })}
            onKey={(dir) => saveLayout({ ...layout, info: clampW(fit.info - dir * 24, { min: INFO_W.min, max: infoMax }) })}
          />
        )}
        {layout.infoOpen && !fit.infoShown && (
          // 겹쳐 뜬 칸 바깥(대화)을 누르면 닫힘
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 z-[15] bg-black/5 dark:bg-black/20"
            style={{ right: overlayW }}
            onMouseDown={() => saveLayout({ ...layout, infoOpen: false })}
          />
        )}
        {layout.infoOpen && !fit.infoShown && (
          <div className="absolute inset-y-0 z-30 flex" style={{ right: overlayW - 4 }}>
            <ResizeHandle
              label="학생 정보 너비 조절"
              onDrag={(dx, start) => {
                if (start) dragStart.current = overlayW;
                else saveLayout({ ...layout, info: clampW(dragStart.current - dx, { min: INFO_W.min, max: overlayMax }) });
              }}
              onReset={() => saveLayout({ ...layout, info: INFO_W.def })}
              onKey={(dir) => saveLayout({ ...layout, info: clampW(overlayW - dir * 24, { min: INFO_W.min, max: overlayMax }) })}
            />
          </div>
        )}
        {layout.infoOpen && (
        <aside
          className={
            fit.infoShown
              ? 'min-h-0 shrink-0 overflow-y-auto p-5'
              : 'absolute inset-y-0 right-0 z-20 overflow-y-auto border-l border-line bg-surface p-5 shadow-2xl'
          }
          style={{ width: fit.infoShown ? fit.info : overlayW }}
        >
          {session ? (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="mb-2 text-sm font-semibold text-ink-3">학생</h2>
                <p className="break-all font-semibold text-ink">{session.studentEmail}</p>
                <div className="mt-1 flex items-center gap-2">
                  <LanguageBadge language={session.language} />
                  {session.mode === 'senior' && role !== 'senior' && <Badge tone="senior">선배 채팅</Badge>}
                </div>
              </div>
              {session.profile && (
                <div>
                  <h2 className="mb-2 text-sm font-semibold text-ink-3">학생 정보</h2>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                    {Object.entries(session.profile)
                      .sort(([a], [b]) => (PROFILE_ORDER.indexOf(a) + 99) % 99 - ((PROFILE_ORDER.indexOf(b) + 99) % 99))
                      .map(([k, v]) => (
                        <React.Fragment key={k}>
                          <dt className="text-ink-3">{PROFILE_LABEL[k] ?? k}</dt>
                          <dd className="text-ink">{k === 'program' ? PROGRAM_LABEL[v] ?? v : v}</dd>
                        </React.Fragment>
                      ))}
                  </dl>
                </div>
              )}
              <div>
                <h2 className="mb-2 text-sm font-semibold text-ink-3">최근 호빗 대화</h2>
                {session.botContext?.length ? (
                  <ol className="flex flex-col gap-3">
                    {session.botContext.map((c, i) => (
                      <li key={i} className="rounded-xl bg-card p-3 text-sm">
                        <p className="font-semibold text-ink">Q. {c.q}</p>
                        {c.a && <p className="mt-1 line-clamp-4 text-ink-2">{c.a}</p>}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-sm text-ink-3">호빗에게 물어본 내용 없이 바로 채팅을 요청했어요.</p>
                )}
              </div>
              <div className="text-xs text-ink-3">
                <p>요청 {new Date(session.createdAt).toLocaleString('ko-KR')}</p>
                {session.startedAt && <p>시작 {new Date(session.startedAt).toLocaleString('ko-KR')}</p>}
                {session.closedAt && <p>종료 {new Date(session.closedAt).toLocaleString('ko-KR')}</p>}
              </div>
            </div>
          ) : (
            <p className="text-sm text-ink-3">채팅을 고르면 학생 정보와 최근 호빗 대화가 보여요.</p>
          )}
        </aside>
        )}
      </div>

      {showSettings && <ChatSettings onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export default ChatMain;
