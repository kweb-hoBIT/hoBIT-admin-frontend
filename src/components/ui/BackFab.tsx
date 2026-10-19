import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { prefetchRoute } from '../../routes';

/**
 * 하위 화면(상세·만들기·수정·관리 세부)에서 왼쪽 아래에 떠 있는 "← 목록으로" 버튼
 *  - 목록 화면으로 감 (뒤로가기 기록이 아니라 그 화면의 목록 — 새 탭으로 열었어도 같은 곳으로)
 *  - 목록 화면·홈·로그인 화면에서는 안 보임
 */
const PARENTS: { match: RegExp; to: string; label: string }[] = [
  { match: /^\/faqs\/.+/, to: '/faqs', label: 'FAQ 목록' },
  { match: /^\/seniorfaqs\/.+/, to: '/seniorfaqs', label: '선배 FAQ 목록' },
  { match: /^\/categories\/.+/, to: '/categories', label: '관리' },
  { match: /^\/adminlogs\/.+/, to: '/logs', label: '로그 목록' },
];

const BackFab: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const parent = PARENTS.find((p) => p.match.test(pathname));
  if (!parent) return null;
  return (
    <button
      key={pathname} // 화면이 바뀔 때마다 살짝 떠오름
      type="button"
      onClick={() => navigate(parent.to)}
      onMouseEnter={() => prefetchRoute(parent.to)}
      aria-label={`${parent.label} 화면으로 돌아가기`}
      className="back-fab fixed bottom-6 left-6 z-30 flex h-12 items-center gap-2 rounded-full border border-line bg-surface/95 pl-3.5 pr-5 text-[15px] font-semibold text-ink-2 shadow-lg backdrop-blur transition-colors hover:border-accent-ink/40 hover:text-accent-ink 2xl:left-10"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="back-fab-icon h-5 w-5" aria-hidden="true">
        <path d="M15 18l-6-6 6-6" />
      </svg>
      {parent.label}
    </button>
  );
};

export default BackFab;
