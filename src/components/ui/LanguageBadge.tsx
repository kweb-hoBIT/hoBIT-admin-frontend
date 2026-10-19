import React from 'react';
import Badge from './Badge';

/**
 * 피드백·질문을 남긴 화면 언어 — 영어 화면 사용자(대부분 외국인 학생)는 눈에 띄게.
 * 영어로 남긴 피드백은 영어 FAQ 번역을 더 신경 써서 보라는 표시.
 */
const LanguageBadge: React.FC<{ language?: string | null; className?: string }> = ({ language, className }) => {
  const lang = (language || '').toUpperCase();
  if (lang === 'EN') {
    return (
      <Badge tone="link" className={className} title="영어 화면에서 남긴 피드백 (외국인 학생일 가능성이 높아요)">
        EN · 영어 사용자
      </Badge>
    );
  }
  if (lang === 'KO') return <Badge className={className}>KO</Badge>;
  return null;
};

export default LanguageBadge;
