import React from 'react';

/**
 * 작은 알약 배지 — 언어(KO/EN)·과정(학부/대학원)·선배 등 목록 옆 표시를 같은 크기·높이로
 *   <Badge tone="link">EN</Badge>
 */
const TONES = {
  neutral: 'bg-card-2 text-ink-2',
  link: 'bg-link/15 text-link',
  senior: 'bg-senior text-accent-ink',
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
