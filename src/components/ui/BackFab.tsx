import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { prefetchRoute } from '../../routes';

/**
 * 하위 화면(상세·만들기·수정·관리 세부)에서 왼쪽 아래에 떠 있는 "← 목록으로" 버튼
 *  - 목록 화면으로 감 (뒤로가기 기록이 아니라 그 화면의 목록 — 새 탭으로 열었어도 같은 곳으로)
 *  - 목록 화면·홈·로그인 화면에서는 안 보임
 */
const LIST_PAGES = /^\/(faqs\/graduate|categories\/(profile-options|bulk|chat)|logs\/(admin|analytics))\/?$/; // 헤더 탭으로 여는 목록 화면
const PARENTS: { match: RegExp; to: string; label: string }[] = [
  { match: /^\/faqs\/.+/, to: '/faqs', label: 'FAQ 목록' },
  { match: /^\/seniorfaqs\/.+/, to: '/seniorfaqs', label: '선배 FAQ 목록' },
  { match: /^\/categories\/(email|admin)\/.+/, to: '/categories/bulk', label: '담당자·이메일' },
  { match: /^\/categories\/.+/, to: '/categories', label: '카테고리' },
  { match: /^\/adminlogs\/.+/, to: '/logs/admin', label: '관리자 로그' },
];

// 불투명 배경 — 떠 있는 버튼에 흐림(backdrop-blur)을 주면 휴대폰에서 스크롤할 때마다 뒤를 다시 흐려 버벅였음
const BackFab: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const parent = LIST_PAGES.test(pathname) ? undefined : PARENTS.find((p) => p.match.test(pathname));
  if (!parent) return null;
  return (
    <>
    {/* 휴대폰: 버튼이 마지막 내용을 가리지 않게 아래 빈 자리 */}
    <div className="h-20 sm:hidden" aria-hidden="true" />
    <button
      key={pathname} // 화면이 바뀔 때마다 살짝 떠오름
      type="button"
      onClick={() => navigate(parent.to)}
      onMouseEnter={() => prefetchRoute(parent.to)}
      aria-label={`${parent.label} 화면으로 돌아가기`}
      className="back-fab fixed bottom-4 left-4 z-30 flex h-11 items-center gap-2 rounded-full border border-line bg-surface pl-3 pr-4 text-[15px] sm:bottom-6 sm:left-6 sm:h-12 sm:pl-3.5 sm:pr-5 font-semibold text-ink-2 shadow-lg transition-colors hover:border-accent-ink/40 hover:text-accent-ink 2xl:left-10"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="back-fab-icon h-5 w-5" aria-hidden="true">
        <path d="M15 18l-6-6 6-6" />
      </svg>
      {parent.label}
    </button>
    </>
  );
};

export default BackFab;
