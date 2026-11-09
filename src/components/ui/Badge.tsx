import React from 'react';

/**
 * 작은 알약 배지 — 언어(KO/EN)·과정(학부/대학원)·선배 등 목록 옆 표시를 같은 크기·높이로
 *   <Badge tone="link">EN</Badge>
 */
const TONES = {
  neutral: 'bg-ink/[0.07] text-ink-2 dark:bg-ink/10', // 회색 카드(card-2) 위에서도 알약 모양이 보이게
  link: 'bg-link/15 text-link',
  senior: 'bg-orange-500/15 text-orange-700 dark:bg-orange-400/15 dark:text-orange-300', // 근로장학생(선배)
  yellow: 'bg-amber-400/20 text-amber-700 dark:bg-amber-300/15 dark:text-amber-300', // 학부
  green: 'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300', // KO
  purple: 'bg-violet-500/15 text-violet-700 dark:bg-violet-400/15 dark:text-violet-300', // EN
  accent: 'bg-accent/10 text-accent-ink dark:bg-accent-ink/15',
} as const;

const Badge: React.FC<{ tone?: keyof typeof TONES; className?: string; title?: string; children: React.ReactNode }> = ({
  tone = 'neutral',
  className = '',
  title,
  children,
}) => (
  <span title={title} className={`inline-flex h-6 shrink-0 items-center rounded-full px-2.5 text-xs font-semibold leading-none ${TONES[tone]} ${className}`}>
    {children}
  </span>
);

export default Badge;
