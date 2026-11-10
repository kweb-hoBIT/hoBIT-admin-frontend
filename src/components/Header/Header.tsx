import React, { useState, useRef, useEffect, useLayoutEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { selectAuth } from "../../redux/authSlice";
import {
  clearFAQFilterState,
  clearFAQSortState,
  clearSeniorFAQFilterState,
  clearSeniorFAQSortState,
  clearLogFilterState,
  clearAdminLogFilterState,
  clearQuestionLogFilterState,
  clearLogAnalysisFilterState,
  clearFeedbackFilterState,
} from "../../redux/filterSlice";
import { prefetchRoute } from "../../routes";
import { useChat } from "../Chat/ChatProvider";
import SlidingIndicator from "../ui/SlidingIndicator";
import { THEME_EVENT } from "../../theme";
import { ROLE_LABEL } from "../../api/chat";
import Badge from "../ui/Badge";
import MenuItem from "../ui/MenuItem";
import Icon from "../ui/Icon";
import Logout from "./Logout";
import DeleteAccount from "./DeleteAccount";

const THEME_KEY = "hobit-theme"; // 호빗 사용자 화면과 같은 키
const HOBIT_URL = process.env.REACT_APP_HOBIT_URL || "https://www.hobit.kr";

type SubItem = { path: string; label: string };
type NavGroup = { key: string; label: string; pin?: boolean; children: SubItem[] };

/**
 * 메뉴 — 비슷한 화면은 한 메뉴로 묶고, 묶음 안 화면은 헤더 아래 줄의 탭으로 고름
 *   FAQ: 학부 FAQ · 대학원 FAQ · 선배 FAQ / 로그: 로그 · 로그 분석 / 피드백: 피드백 · FAQ 후보 · 답변 확인
 */
const NAV: NavGroup[] = [
  { key: "faq", label: "FAQ", children: [
    { path: "/faqs", label: "학부 FAQ" },
    { path: "/faqs/graduate", label: "대학원 FAQ" },
    { path: "/seniorfaqs", label: "선배 FAQ" },
  ] },
  { key: "keywords", label: "키워드", children: [{ path: "/keywords", label: "키워드" }] },
  { key: "logs", label: "로그", children: [
    { path: "/logs", label: "유저 로그" },
    { path: "/logs/admin", label: "관리자 로그" },
    { path: "/logs/analytics", label: "로그 분석" },
  ] },
  { key: "feedback", label: "피드백", children: [
    { path: "/userfeedbacks", label: "피드백" },
    { path: "/faq-candidates", label: "FAQ 후보" }, // 답을 못 찾은 질문을 묶은 것 (예전엔 피드백에 한 줄씩 섞여 있었음)
    { path: "/answer-reviews", label: "답변 확인" },
  ] },
  { key: "categories", label: "관리", children: [
    { path: "/categories", label: "카테고리" },
    { path: "/categories/profile-options", label: "프로필 항목" },
    { path: "/categories/bulk", label: "담당자·이메일" },
    { path: "/categories/chat", label: "채팅 운영" }, // 채팅 켜고 끄기·메일 인증 — 위 메뉴 '채팅'(대화 화면)과 헷갈리지 않게
    { path: "/categories/bot", label: "챗봇 설정" }, // 답변 자유도·주변 장소·학식·과다 사용 기준
  ] },
  // 맨 뒤 — 대기·안 읽은 메시지가 있으면 배지, 좁아도 "더보기"로 접지 않음
  { key: "chats", label: "채팅", pin: true, children: [{ path: "/chats", label: "채팅" }] },
];

/** 지금 화면 → (메뉴 묶음, 하위 화면). 상세·수정 화면도 해당 목록으로 표시 */
function activeNav(pathname: string): { group?: string; child?: string } {
  const at = (p: string) => pathname === p || pathname.startsWith(p + "/");
  let child: string | undefined;
  if (at("/faqs/graduate")) child = "/faqs/graduate";
  else if (at("/faqs")) child = "/faqs";
  else if (at("/seniorfaqs") || pathname.startsWith("/adminlogs/seniorfaqlogs")) child = "/seniorfaqs";
  else if (at("/logs/analytics")) child = "/logs/analytics";
  else if (at("/logs/admin") || pathname.startsWith("/adminlogs")) child = "/logs/admin";
  else if (at("/logs")) child = "/logs";
  else if (at("/categories/profile-options")) child = "/categories/profile-options";
  else if (at("/categories/chat")) child = "/categories/chat";
  else if (at("/categories/bot")) child = "/categories/bot";
  else if (at("/categories/bulk") || at("/categories/email") || at("/categories/admin")) child = "/categories/bulk";
  else if (at("/categories")) child = "/categories";
  else child = NAV.flatMap((g) => g.children).find((c) => at(c.path))?.path;
  const group = NAV.find((g) => g.children.some((c) => c.path === child))?.key;
  return { group, child };
}

// 묶음마다 마지막으로 본 화면 — 위 메뉴를 다시 누르면 그 화면으로 (이 탭 안에서만)
const lastChild: Record<string, string> = {};
const SENIOR_OK = ["/seniorfaqs", "/categories", "/chats"];

type NavItem = { key: string; path: string; label: string; pin?: boolean };
const NAV_GAP = 4;
// inline-flex items-center — 글자 기준선에 맞춰지면 옆의 작은 숫자 배지가 아래로 처져 보였음
const NAV_ITEM = "relative z-[1] inline-flex shrink-0 items-center rounded-full px-[1.1rem] py-2.5 text-[length:max(17px,1.0625rem)] font-semibold leading-6 transition-colors";

/**
 * 메뉴 줄 — 자리가 모자라면 뒤쪽 메뉴부터 "더보기"로 접음 (가로 스크롤로 숨겨져 안 보이던 문제)
 * 선택 표시는 옆으로 미끄러지며 이동 (SlidingIndicator)
 */
const NavBar: React.FC<{
  items: NavItem[];
  current?: string;
  onGo: (path: string) => void;
  badge: (item: NavItem) => React.ReactNode;
}> = ({ items, current, onGo, badge }) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(items.length);
  const [open, setOpen] = useState(false);

  // 보이지 않는 줄에 전부 그려 두고 너비를 재서, 들어가는 만큼만 보여줌
  useLayoutEffect(() => {
    setCount(items.length);
    const outer = outerRef.current;
    const measure = measureRef.current;
    if (!outer || !measure) return;
    const fit = () => {
      const all = Array.from(measure.children).map((el) => (el as HTMLElement).offsetWidth);
      const moreW = all.pop() ?? 0; // 마지막은 "더보기" 버튼
      const widths = all.filter((_, i) => !items[i].pin);
      const pinned = all.filter((_, i) => items[i].pin).reduce((a, w) => a + w + NAV_GAP, 0);
      const avail = outer.clientWidth - pinned;
      const total = widths.reduce((a, w) => a + w + NAV_GAP, -NAV_GAP);
      if (total <= avail) return setCount(widths.length);
      let used = moreW;
      let n = 0;
      while (n < widths.length && used + NAV_GAP + widths[n] <= avail) used += NAV_GAP + widths[n++];
      setCount(n);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(outer);
    ro.observe(measure);
    return () => ro.disconnect();
  }, [items]);

  // 바깥을 누르거나 화면을 옮기면 닫음
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => moreRef.current && !moreRef.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);
  useEffect(() => setOpen(false), [current]);

  // 고정 메뉴(채팅)는 항상 보이고, 나머지는 뒤에서부터 "더보기"로
  const free = items.filter((i) => !i.pin);
  const shown = free.slice(0, count);
  const hidden = free.slice(count);
  const pinned = items.filter((i) => i.pin);
  const hiddenActive = hidden.some((i) => i.key === current);
  const hiddenBadge = hidden.map(badge).filter(Boolean);

  const renderItem = (item: NavItem, measuring = false) => {
    const active = current === item.key;
    return (
      <button
        key={item.key}
        type="button"
        tabIndex={measuring ? -1 : undefined}
        data-active={!measuring && active ? "true" : undefined}
        onClick={() => onGo(item.path)}
        onMouseEnter={() => prefetchRoute(item.path)}
        onFocus={() => prefetchRoute(item.path)}
        aria-current={active ? "page" : undefined}
        className={`${NAV_ITEM} ${active ? "text-accent-ink" : "text-ink-2 hover:bg-card hover:text-ink"}`}
      >
        {item.label}
        {badge(item)}
      </button>
    );
  };
  const moreLabel = (
    <>
      더보기
      <svg viewBox="0 0 20 20" fill="currentColor" className={`ml-1 inline h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true">
        <path d="M5.5 7.5 10 12l4.5-4.5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </>
  );

  return (
    // 휴대폰(md 미만)에서는 숨기고 햄버거 메뉴(MobileDrawer)로
    <nav ref={outerRef} className="relative hidden min-w-0 flex-1 md:block">
      {/* 너비 재기용 (안 보임) */}
      <div ref={measureRef} aria-hidden="true" className="pointer-events-none invisible fixed left-0 top-0 flex" style={{ gap: NAV_GAP }}>
        {items.map((i) => renderItem(i, true))}
        <button type="button" tabIndex={-1} className={NAV_ITEM}>{moreLabel}</button>
      </div>

      <div ref={rowRef} className="relative flex items-center" style={{ gap: NAV_GAP }}>
        <SlidingIndicator containerRef={rowRef} activeKey={`${current}|${count}`} className="rounded-full bg-accent/10 dark:bg-accent-ink/15" />
        {shown.map((i) => renderItem(i))}
        {hidden.length > 0 && (
          <div ref={moreRef} className="relative" data-active={hiddenActive ? "true" : undefined}>
            <button
              type="button"
              aria-expanded={open}
              aria-haspopup="menu"
              onClick={() => setOpen((v) => !v)}
              className={`${NAV_ITEM} ${hiddenActive ? "text-accent-ink" : "text-ink-2 hover:bg-card hover:text-ink"}`}
            >
              {moreLabel}
              {hiddenBadge.length > 0 && hiddenBadge[0]}
            </button>
            {open && (
              <div role="menu" className="pop-menu absolute left-0 top-[3.25rem] z-50 min-w-[11rem] rounded-2xl border border-line bg-surface p-1.5 shadow-xl">
                {hidden.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    role="menuitem"
                    onClick={() => onGo(item.path)}
                    onMouseEnter={() => prefetchRoute(item.path)}
                    className={`flex w-full items-center rounded-xl px-3.5 py-2.5 text-left text-[length:max(16px,1rem)] font-semibold ${
                      current === item.key ? "bg-accent/10 text-accent-ink dark:bg-accent-ink/15" : "text-ink-2 hover:bg-card hover:text-ink"
                    }`}
                  >
                    {item.label}
                    {badge(item)}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {pinned.map((i) => renderItem(i))}
      </div>
    </nav>
  );
};

const ThemeToggle: React.FC = () => {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next ? "#1e1e22" : "#ffffff");
    try {
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch {}
    window.dispatchEvent(new Event(THEME_EVENT)); // 홈은 이걸 듣고 숫자·그래프 등장 모션을 다시 재생
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "라이트 모드" : "나이트 모드"}
      title={dark ? "라이트 모드" : "나이트 모드"}
      className="wiggle flex h-11 items-center gap-2 rounded-full px-2.5 text-ink-2 hover:bg-card hover:text-ink transition-colors sm:h-12 sm:px-3.5"
    >
      {dark ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="wiggle-icon h-7 w-7" aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" />
          <path strokeLinecap="round" d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="wiggle-icon h-7 w-7" aria-hidden="true">
          <path strokeLinejoin="round" d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" />
        </svg>
      )}
      {/* 누르면 바뀔 모드 — 호빗 사용자 화면과 같이 항상 영어 */}
      <span className="hidden text-[length:max(17px,1.0625rem)] font-semibold xl:inline">{dark ? "Light" : "Night"}</span>
    </button>
  );
};

/**
 * 휴대폰 메뉴 (md 미만) — 햄버거를 누르면 헤더 아래로 펼쳐짐. 묶음마다 하위 화면을 모두 나열하고 지금 화면을 표시
 * 화면을 옮기거나, 바깥을 누르거나, Esc를 누르면 닫힘. 열려 있는 동안 뒤 화면은 스크롤되지 않음
 */
const MobileDrawer: React.FC<{
  open: boolean;
  onClose: () => void;
  groups: NavGroup[];
  currentChild?: string;
  onGo: (path: string) => void;
  chatBadge: number;
}> = ({ open, onClose, groups, currentChild, onGo, chatBadge }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // 화면을 넓혀 데스크톱 메뉴가 보이면 닫음 (스크롤 잠금이 남지 않게)
    const mq = window.matchMedia("(min-width: 768px)");
    const onWide = (e: MediaQueryListEvent) => e.matches && onClose();
    mq.addEventListener?.("change", onWide);
    return () => {
      mq.removeEventListener?.("change", onWide);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 top-[4.5rem] z-40 md:hidden">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden="true" />
      <nav
        id="mobile-nav"
        aria-label="메뉴"
        className="pop-menu relative max-h-full overflow-y-auto overscroll-contain border-b border-line bg-surface px-4 pb-5 pt-2 shadow-xl"
      >
        {/* 채팅(대화 화면)은 가장 급한 일이라 맨 위에 따로 — 관리 > 채팅 운영(설정)과 붙어 있으면 헷갈렸음 */}
        {[...groups.filter((g) => g.pin), ...groups.filter((g) => !g.pin)].map((g) => {
          const single = g.children.length === 1;
          return (
            <div key={g.key} className="border-b border-line/70 py-2 last:border-b-0">
              {!single && <p className="px-3 pb-1 pt-1.5 text-[length:max(13px,0.8125rem)] font-bold tracking-wide text-ink-3">{g.label}</p>}
              {g.children.map((c) => {
                const on = c.path === currentChild;
                return (
                  <button
                    key={c.path}
                    type="button"
                    aria-current={on ? "page" : undefined}
                    onClick={() => onGo(c.path)}
                    className={`flex min-h-[max(44px,2.75rem)] w-full items-center rounded-xl px-3 text-left text-[length:max(16px,1rem)] font-semibold ${
                      on ? "bg-accent/10 text-accent-ink dark:bg-accent-ink/15" : "text-ink-2 active:bg-card"
                    }`}
                  >
                    {g.key === "chats" ? "실시간 채팅" : c.label}
                    {g.key === "chats" && chatBadge > 0 && (
                      <span className="ml-2 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-accent px-1.5 text-xs font-bold text-white">
                        {chatBadge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
        <a
          href={HOBIT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex min-h-[max(44px,2.75rem)] items-center gap-2 rounded-xl px-3 text-[length:max(16px,1rem)] font-semibold text-ink-2 active:bg-card"
        >
          <Icon name="external" className="h-5 w-5" />
          챗봇 보기
        </a>
      </nav>
    </div>
  );
};

const Header: React.FC = () => {
  const { username } = useSelector((state: RootState) => selectAuth(state));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // 메뉴 밖을 누르면 닫힘
  useEffect(() => {
    if (!showPopup) return;
    const onDown = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) setShowPopup(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [showPopup]);

  // 화면을 옮기면 사용자 메뉴·휴대폰 메뉴는 닫음
  const [drawer, setDrawer] = useState(false);
  const closeDrawer = useCallback(() => setDrawer(false), []);
  useEffect(() => {
    setShowPopup(false);
    setDrawer(false);
  }, [location.pathname]);

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
  const { group: current, child: currentChild } = activeNav(location.pathname);
  if (current && currentChild) lastChild[current] = currentChild;
  const { role, accountRole, waiting, summary } = useChat();
  const chatBadge = waiting.length + (summary?.unread ?? 0);
  // 근로장학생 계정은 선배 FAQ · 관리(선배 FAQ 카테고리) · 채팅(선배 채팅)만
  // 메뉴 배열은 바뀔 때만 새로 만듦 — 메뉴 줄이 배열이 바뀔 때마다 너비를 다시 재서, 매번 새로 만들면 계속 다시 그림
  const groups: NavGroup[] = useMemo(
    () =>
      role === "senior"
        ? NAV.map((g) => ({ ...g, children: g.children.filter((c) => SENIOR_OK.includes(c.path)) })).filter((g) => g.children.length)
        : NAV,
    [role]
  );
  const nav: NavItem[] = useMemo(
    () =>
      groups.map((g) => ({
        key: g.key,
        label: g.label,
        pin: g.pin,
        path: g.children.find((c) => c.path === lastChild[g.key])?.path ?? g.children[0].path,
      })),
    [groups, currentChild]
  );
  const subItems = groups.find((g) => g.key === current)?.children ?? [];
  // 휴대폰 알약에 보일 이름 — 묶음 이름 (홈·마이페이지 등 묶음 밖이면 그 화면 이름)
  const currentLabel =
    groups.find((g) => g.key === current)?.label ??
    (location.pathname.startsWith("/mypage") ? "마이페이지" : location.pathname.startsWith("/home") ? "홈" : "메뉴");
  const subRef = useRef<HTMLDivElement>(null);

  // 좁은 화면에서 하위 탭 줄이 넘치면 지금 탭이 보이도록 가로로 스크롤
  useEffect(() => {
    const row = subRef.current;
    const el = row?.querySelector<HTMLElement>('[data-active="true"]');
    if (!row || !el || row.scrollWidth <= row.clientWidth) return;
    row.scrollLeft = el.offsetLeft - (row.clientWidth - el.offsetWidth) / 2;
  }, [currentChild]);

  const handleNavigation = (path: string) => {
    dispatch(clearFAQFilterState());
    dispatch(clearFAQSortState());
    dispatch(clearSeniorFAQFilterState());
    dispatch(clearSeniorFAQSortState());
    dispatch(clearLogFilterState());
    dispatch(clearAdminLogFilterState());
    dispatch(clearQuestionLogFilterState());
    dispatch(clearLogAnalysisFilterState());
    dispatch(clearFeedbackFilterState());
    setDrawer(false);
    navigate(path);
    if (location.pathname === path) {
      navigate(0);
    }
  };

  // 불투명 배경 — backdrop-filter·transform이 있으면 메뉴 안 회원탈퇴 확인창(fixed)이 헤더 안에 갇힘
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface">
      {/* 윗줄을 아래 탭 줄보다 위 층에 — 사용자 메뉴·더보기 펼침이 아래 탭 글자에 비쳐 보이던 문제 */}
      <div className="relative z-30 mx-auto flex h-[4.5rem] max-w-[var(--page-max)] items-center gap-2 px-4 sm:gap-4 sm:px-6 xl:gap-8 2xl:px-10">
        <button
          type="button"
          disabled={isAuthPage}
          onClick={() => handleNavigation(role === "senior" ? "/chats" : "/home")}
          onMouseEnter={() => prefetchRoute("/home")}
          className="-mx-2 flex shrink-0 items-center gap-3 rounded-xl px-2 py-1 disabled:cursor-default"
        >
          <img src="/hoBIT64.ico" alt="" className="h-9 w-9 rounded-full sm:h-10 sm:w-10" />
          {/* 로고 글자 바로 아래에 작게: 행정실·개발자 = 관리자, 근로장학생 = 선배 (옆에 알약으로 두면 메뉴 탭처럼 보였음) */}
          <span className="flex flex-col items-start leading-none">
            <span className="text-[length:max(22px,1.375rem)] font-bold tracking-tight text-accent-ink sm:text-[length:max(26px,1.625rem)]">hoBIT</span>
            {role === "senior" ? (
              // 호빗 화면의 선배모드 표시(Senior)와 같은 모양
              <span className="mt-1 w-fit rounded-full bg-senior px-2 py-0.5 text-[length:max(12px,0.75rem)] font-semibold text-red-600">senior</span>
            ) : (
              <span className="mt-1 text-[length:max(12px,0.75rem)] font-bold tracking-[0.08em] text-ink-3">admin</span>
            )}
          </span>
        </button>

        {/* 휴대폰: 로고 옆 알약 — 지금 메뉴 이름을 보여 주고, 누르면 아래로 메뉴가 펼쳐짐 (채팅 대기·안 읽은 메시지는 숫자) */}
        {!isAuthPage && (
          <button
            type="button"
            onClick={() => {
              setShowPopup(false);
              setDrawer((v) => !v);
            }}
            aria-expanded={drawer}
            aria-controls="mobile-nav"
            aria-label={`메뉴 ${drawer ? "닫기" : "열기"} (지금: ${currentLabel})`}
            className={`relative flex h-10 min-w-0 items-center gap-1.5 rounded-full px-3.5 text-[length:max(15px,0.9375rem)] font-semibold transition-colors md:hidden ${
              drawer ? "bg-accent/15 text-accent-ink dark:bg-accent-ink/20" : "bg-card text-accent-ink hover:bg-card-2"
            }`}
          >
            <span className="truncate">{currentLabel}</span>
            <svg viewBox="0 0 20 20" className={`h-4 w-4 shrink-0 transition-transform ${drawer ? "rotate-180" : ""}`} aria-hidden="true">
              <path d="M5.5 7.5 10 12l4.5-4.5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {chatBadge > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex min-w-[1.1rem] items-center justify-center rounded-full bg-accent px-1 text-[length:max(11px,0.6875rem)] font-bold leading-[1.1rem] text-white">
                {chatBadge}
              </span>
            )}
          </button>
        )}

        {!isAuthPage && (
          <NavBar
            items={nav}
            current={current}
            onGo={handleNavigation}
            badge={(item) =>
              item.key === "chats" && chatBadge > 0 ? (
                <span
                  title={`대기 ${waiting.length} · 안 읽은 메시지 ${summary?.unread ?? 0}`}
                  className="ml-1.5 inline-flex h-5 min-w-[1.25rem] animate-pulse items-center justify-center rounded-full bg-accent px-1.5 text-xs font-bold leading-none tabular-nums text-white"
                >
                  {chatBadge}
                </span>
              ) : null
            }
          />
        )}

        <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1">
          {/* 학생이 보는 호빗 챗봇을 새 탭으로 */}
          <a
            href={HOBIT_URL}
            title="챗봇 보기"
            target="_blank"
            rel="noopener noreferrer"
            // 휴대폰에서는 메뉴(햄버거) 안으로
            className="wiggle hidden h-12 items-center gap-2 rounded-full px-3.5 text-[length:max(17px,1.0625rem)] font-semibold text-ink-2 transition-colors hover:bg-card hover:text-ink sm:flex"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="wiggle-icon h-6 w-6" aria-hidden="true">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
            {/* 좁으면 아이콘만 — 메뉴에 자리를 더 줌 */}
            <span className="hidden xl:inline">챗봇 보기</span>
          </a>
          <ThemeToggle />
          {!isAuthPage && (
            <div className="relative" ref={popupRef}>
              <button
                type="button"
                onClick={() => {
                  setDrawer(false); // 펼친 메뉴가 사용자 메뉴를 가리지 않게
                  setShowPopup((v) => !v);
                }}
                aria-expanded={showPopup}
                className="wiggle flex h-11 items-center gap-3 rounded-full px-1 text-ink-2 hover:bg-card hover:text-ink transition-colors sm:h-12 sm:pl-1.5 sm:pr-4"
              >
                <span className="wiggle-icon flex h-9 w-9 items-center justify-center rounded-full bg-accent text-[length:max(17px,1.0625rem)] font-bold text-white">
                  {(username || "?").slice(0, 1)}
                </span>
                <span className="hidden max-w-[max(160px,10rem)] truncate text-[length:max(17px,1.0625rem)] font-semibold lg:inline">{username}</span>
              </button>
              {showPopup && (
                <div role="menu" className="pop-menu absolute right-0 top-[3.5rem] z-50 w-64 max-w-[calc(100vw-2rem)] rounded-2xl border border-line bg-surface p-2 shadow-xl">
                  {/* 나 — 동그라미 + 이름 + 권한 */}
                  <div className="flex items-center gap-3 px-3 pb-3 pt-2">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-[length:max(17px,1.0625rem)] font-bold text-white">
                      {(username || "?").slice(0, 1)}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-ink">{username}</span>
                      {accountRole && (
                        <Badge tone={accountRole === "senior" ? "senior" : accountRole === "developer" ? "link" : "accent"} className="mt-1">
                          {ROLE_LABEL[accountRole]}
                        </Badge>
                      )}
                    </span>
                  </div>
                  <div className="border-t border-line pt-1.5">
                    <MenuItem icon="user" onClick={() => handleNavigation("/mypage")} onMouseEnter={() => prefetchRoute("/mypage")}>
                      마이페이지
                    </MenuItem>
                    <Logout />
                  </div>
                  <div className="mt-1.5 border-t border-line pt-1.5">
                    <DeleteAccount />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {!isAuthPage && (
        <MobileDrawer open={drawer} onClose={closeDrawer} groups={groups} currentChild={currentChild} onGo={handleNavigation} chatBadge={chatBadge} />
      )}
      {/* 하위 화면 탭 — 묶음 안에 화면이 둘 이상일 때만 (FAQ·로그·피드백) */}
      {!isAuthPage && subItems.length > 1 && (
        <div className="border-t border-line/70">
          <div ref={subRef} className="no-scrollbar relative mx-auto flex h-12 max-w-[var(--page-max)] items-center gap-1 overflow-x-auto px-4 sm:px-6 2xl:px-10">
            <SlidingIndicator containerRef={subRef} activeKey={currentChild} variant="underline" className="bg-accent-ink" />
            {subItems.map((s) => {
              const on = s.path === currentChild;
              return (
                <button
                  key={s.path}
                  type="button"
                  data-active={on ? "true" : undefined}
                  aria-current={on ? "page" : undefined}
                  onClick={() => handleNavigation(s.path)}
                  onMouseEnter={() => prefetchRoute(s.path)}
                  className={`relative z-[1] shrink-0 h-full px-4 text-[length:max(15px,0.9375rem)] font-semibold transition-colors ${
                    on ? "text-accent-ink" : "text-ink-3 hover:text-ink"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
