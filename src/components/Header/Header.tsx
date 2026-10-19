import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
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
import Logout from "./Logout";
import DeleteAccount from "./DeleteAccount";

const THEME_KEY = "hobit-theme"; // 호빗 사용자 화면과 같은 키
const HOBIT_URL = process.env.REACT_APP_HOBIT_URL || "https://www.hobit.kr";

const NAV: { path: string; label: string; pin?: boolean }[] = [
  { path: "/faqs", label: "FAQ" },
  { path: "/seniorfaqs", label: "선배 FAQ" },
  { path: "/keywords", label: "키워드" },
  { path: "/logs", label: "로그" },
  { path: "/logs/analytics", label: "로그 분석" },
  { path: "/userfeedbacks", label: "피드백" },
  { path: "/categories", label: "관리" },
  { path: "/chats", label: "채팅", pin: true }, // 맨 뒤 — 대기·안 읽은 메시지가 있으면 배지, 좁아도 "더보기"로 접지 않음
];

/** 지금 화면이 속한 메뉴 — 상세·수정 화면도 해당 목록 메뉴로 표시 */
function activeNav(pathname: string): string | undefined {
  if (pathname.startsWith("/logs/analytics")) return "/logs/analytics";
  if (pathname.startsWith("/adminlogs") || pathname.startsWith("/logs")) return "/logs";
  return NAV.find((n) => pathname === n.path || pathname.startsWith(n.path + "/"))?.path;
}

type NavItem = (typeof NAV)[number];
const NAV_GAP = 4;
const NAV_ITEM = "relative z-[1] shrink-0 rounded-full px-[1.1rem] py-2.5 text-[17px] font-semibold transition-colors";

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
  const hiddenActive = hidden.some((i) => i.path === current);
  const hiddenBadge = hidden.map(badge).filter(Boolean);

  const renderItem = (item: NavItem, measuring = false) => {
    const active = current === item.path;
    return (
      <button
        key={item.path}
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
    <nav ref={outerRef} className="relative min-w-0 flex-1">
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
                    key={item.path}
                    type="button"
                    role="menuitem"
                    onClick={() => onGo(item.path)}
                    onMouseEnter={() => prefetchRoute(item.path)}
                    className={`flex w-full items-center rounded-xl px-3.5 py-2.5 text-left text-[16px] font-semibold ${
                      current === item.path ? "bg-accent/10 text-accent-ink dark:bg-accent-ink/15" : "text-ink-2 hover:bg-card hover:text-ink"
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
      className="wiggle flex h-12 items-center gap-2 rounded-full px-3.5 text-ink-2 hover:bg-card hover:text-ink transition-colors"
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
      <span className="hidden text-[17px] font-semibold xl:inline">{dark ? "Light" : "Night"}</span>
    </button>
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

  // 화면을 옮기면 사용자 메뉴는 닫음
  useEffect(() => setShowPopup(false), [location.pathname]);

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
  const current = activeNav(location.pathname);
  const { role, accountRole, waiting, summary } = useChat();
  const chatBadge = waiting.length + (summary?.unread ?? 0);
  // 근로장학생 계정은 선배 FAQ · 관리(선배 FAQ 카테고리) · 채팅(선배 채팅)만
  const nav = role === "senior" ? NAV.filter((n) => ["/seniorfaqs", "/categories", "/chats"].includes(n.path)) : NAV;

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
    navigate(path);
    if (location.pathname === path) {
      navigate(0);
    }
  };

  // 불투명 배경 — backdrop-filter·transform이 있으면 메뉴 안 회원탈퇴 확인창(fixed)이 헤더 안에 갇힘
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface">
      <div className="mx-auto flex h-[4.5rem] max-w-[1680px] items-center gap-4 px-6 xl:gap-8 2xl:px-10">
        <button
          type="button"
          disabled={isAuthPage}
          onClick={() => handleNavigation(role === "senior" ? "/chats" : "/home")}
          onMouseEnter={() => prefetchRoute("/home")}
          className="-mx-2 flex shrink-0 items-center gap-3 rounded-xl px-2 py-1 disabled:cursor-default"
        >
          <img src="/hoBIT64.ico" alt="" className="h-10 w-10 rounded-full" />
          {/* 로고 글자 바로 아래에 작게: 행정실·개발자 = 관리자, 근로장학생 = 선배 (옆에 알약으로 두면 메뉴 탭처럼 보였음) */}
          <span className="flex flex-col items-start leading-none">
            <span className="text-[26px] font-bold tracking-tight text-accent-ink">hoBIT</span>
            {role === "senior" ? (
              // 호빗 화면의 선배모드 표시(Senior)와 같은 모양
              <span className="mt-1 w-fit rounded-full bg-senior px-2 py-0.5 text-[12px] font-semibold text-red-600">senior</span>
            ) : (
              <span className="mt-1 text-[12px] font-bold tracking-[0.08em] text-ink-3">admin</span>
            )}
          </span>
        </button>

        {!isAuthPage && (
          <NavBar
            items={nav}
            current={current}
            onGo={handleNavigation}
            badge={(item) =>
              item.path === "/chats" && chatBadge > 0 ? (
                <span
                  title={`대기 ${waiting.length} · 안 읽은 메시지 ${summary?.unread ?? 0}`}
                  className="ml-1.5 inline-flex min-w-[1.25rem] animate-pulse items-center justify-center rounded-full bg-accent px-1.5 text-xs font-bold text-white"
                >
                  {chatBadge}
                </span>
              ) : null
            }
          />
        )}

        <div className="ml-auto flex shrink-0 items-center gap-1">
          {/* 학생이 보는 호빗 챗봇을 새 탭으로 */}
          <a
            href={HOBIT_URL}
            title="챗봇 보기"
            target="_blank"
            rel="noopener noreferrer"
            className="wiggle flex h-12 items-center gap-2 rounded-full px-3.5 text-[17px] font-semibold text-ink-2 transition-colors hover:bg-card hover:text-ink"
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
                onClick={() => setShowPopup((v) => !v)}
                aria-expanded={showPopup}
                className="wiggle flex h-12 items-center gap-3 rounded-full pl-1.5 pr-4 text-ink-2 hover:bg-card hover:text-ink transition-colors"
              >
                <span className="wiggle-icon flex h-9 w-9 items-center justify-center rounded-full bg-accent text-[17px] font-bold text-white">
                  {(username || "?").slice(0, 1)}
                </span>
                <span className="hidden max-w-[160px] truncate text-[17px] font-semibold lg:inline">{username}</span>
              </button>
              {showPopup && (
                <div role="menu" className="pop-menu absolute right-0 top-[3.5rem] w-64 rounded-2xl border border-line bg-surface p-2 shadow-xl">
                  {/* 나 — 동그라미 + 이름 + 권한 */}
                  <div className="flex items-center gap-3 px-3 pb-3 pt-2">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-[17px] font-bold text-white">
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
    </header>
  );
};

export default Header;
