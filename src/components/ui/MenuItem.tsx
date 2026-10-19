import React from 'react';

/** 펼침 메뉴의 한 줄 — 아이콘 + 글자, 왼쪽 정렬 (내 정보 메뉴 등) */
const ICONS = {
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  logout: (
    <>
      <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
      <path d="M10 17l-5-5 5-5M5 12h11" />
    </>
  ),
  leave: (
    <>
      <circle cx="10" cy="8" r="4" />
      <path d="M3 21a7 7 0 0 1 11.5-5.4M16 17h6" />
    </>
  ),
} as const;

const MenuItem: React.FC<{
  icon: keyof typeof ICONS;
  onClick: () => void;
  onMouseEnter?: () => void;
  danger?: boolean;
  children: React.ReactNode;
}> = ({ icon, onClick, onMouseEnter, danger, children }) => (
  <button
    type="button"
    role="menuitem"
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] font-semibold transition-colors ${
      danger ? 'text-danger hover:bg-danger-soft' : 'text-ink hover:bg-card'
    }`}
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 shrink-0 ${danger ? '' : 'text-ink-2'}`} aria-hidden="true">
      {ICONS[icon]}
    </svg>
    {children}
  </button>
);

export default MenuItem;
