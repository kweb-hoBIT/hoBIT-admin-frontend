import React from 'react';
import Segmented from '../ui/Segmented';
import Badge from '../ui/Badge';
import { FAQAudience, FAQ_AUDIENCE_OPTIONS } from '../../types/faq';

/** FAQ 만들기·고치기의 '대상' 선택 (학부 / 대학원 / 공통) */
const FAQAudienceField: React.FC<{ value: FAQAudience; onChange: (v: FAQAudience) => void }> = ({ value, onChange }) => (
  <div className="p-6 border border-line rounded-xl bg-card space-y-3">
    <h3 className="text-xl font-bold text-ink">대상</h3>
    <Segmented options={FAQ_AUDIENCE_OPTIONS} value={value} onChange={onChange} className="w-fit" itemClassName="px-5 py-1.5" />
    <p className="text-sm text-ink-3">대학원을 고르면 대학원 모드에서만, 공통은 둘 다 보여요.</p>
  </div>
);

/** FAQ 목록의 작은 표시 — 학부는 표시 없음 */
export const FAQAudienceBadge: React.FC<{ audience?: FAQAudience }> = ({ audience }) => {
  if (audience === 'graduate') return <Badge tone="accent">대학원</Badge>;
  if (audience === 'all') return <Badge tone="link">공통</Badge>;
  return <Badge tone="yellow">학부</Badge>; // 대상이 비어 있는 예전 FAQ도 학부
};

export default FAQAudienceField;
