import React, { useState } from 'react';
import { useChat } from '../Chat/ChatProvider';
import { revealRef } from '../ui/motion';
import Segmented from '../ui/Segmented';
import FAQExcelButtons from '../FAQ/FAQExcel/FAQExcelButtons';
import { EmbeddedProvider } from './embedded';
import FAQCategoryRename from './FAQ/Rename/FAQCategoryRename';
import FAQCategoryReorder from './FAQ/Reorder/FAQCategoryReorder';
import SeniorFAQCategoryRename from './SeniorFAQ/Rename/SeniorFAQCategoryRename';
import SeniorFAQCategoryReorder from './SeniorFAQ/Reorder/SeniorFAQCategoryReorder';
import BulkUpdateAdmin from './Admin/BulkUpdateAdmin';
import BulkDeleteAdmin from './Admin/BulkDeleteAdmin';
import BulkUpdateEmail from './Email/BulkUpdateEmail';
import BulkDeleteEmail from './Email/BulkDeleteEmail';

/** 편집 칸 하나 — 제목·설명 + 끼워 넣은 화면 */
const Block: React.FC<{ title: string; desc: string; danger?: boolean; children: React.ReactNode }> = ({ title, desc, danger, children }) => (
  <div ref={revealRef} className={`relative min-w-0 rounded-2xl border p-4 sm:p-5 ${danger ? 'border-danger/30' : 'border-line'}`}>
    <h5 className={`pr-20 font-semibold ${danger ? 'text-danger' : 'text-ink'}`}>{title}</h5>
    <p className="mb-3 mt-0.5 pr-20 text-sm text-ink-3">{desc}</p>
    <EmbeddedProvider>{children}</EmbeddedProvider>
  </div>
);

/**
 * 관리 — 헤더 아래 줄 탭: 카테고리 · 프로필 항목(별도 화면) · 담당자·이메일 · 채팅 운영
 * 예전엔 링크 목록을 한 번 더 눌러 들어갔음 → 탭 안에서 바로 고침. 엑셀에 같은 정보가 있어 엑셀 받기·올리기도 함께
 */
const CategoryMain: React.FC<{ section?: 'category' | 'bulk' }> = ({ section = 'category' }) => {
  const { role } = useChat();
  const senior = role === 'senior'; // 근로장학생은 선배 FAQ 카테고리만
  const [faqKind, setFaqKind] = useState<'faq' | 'senior'>(senior ? 'senior' : 'faq');
  const [bulkKind, setBulkKind] = useState<'admin' | 'email'>('admin');

  if (section === 'bulk') {
    return (
      <section className="panel p-4 sm:p-6">
        {/* 제목과 엑셀 받기·올리기를 한 줄에 (휴대폰에서 버튼이 따로 한 줄을 차지하던 여백) */}
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-xl font-bold text-ink">담당자·이메일</h4>
          <div className="flex shrink-0 gap-2">
            <FAQExcelButtons />
          </div>
        </div>
        <p className="mt-1 text-sm text-ink-3">모든 답변의 담당자 이름·이메일을 한 번에 바꾸거나 지워요.</p>
        <Segmented
          className="mt-3 w-fit max-w-full"
          itemClassName="px-4 py-1.5 text-sm font-semibold"
          options={[['admin', '담당자'], ['email', '이메일']] as const}
          value={bulkKind}
          onChange={setBulkKind}
        />
        <div key={bulkKind} className="mt-4 grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
          {bulkKind === 'admin' ? (
            <>
              <Block title="담당자 변경" desc="한 담당자의 이름을 모든 FAQ에서 바꿔요."><BulkUpdateAdmin /></Block>
              <Block title="담당자 삭제" desc="모든 FAQ에서 그 담당자를 지워요. 되돌릴 수 없어요." danger><BulkDeleteAdmin /></Block>
            </>
          ) : (
            <>
              <Block title="이메일 변경" desc="한 이메일을 모든 답변에서 바꿔요."><BulkUpdateEmail /></Block>
              <Block title="이메일 삭제" desc="모든 답변에서 그 이메일을 지워요. 되돌릴 수 없어요." danger><BulkDeleteEmail /></Block>
            </>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="panel p-4 sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-xl font-bold text-ink">카테고리</h4>
        {!senior && (
          <div className="flex shrink-0 gap-2">
            <FAQExcelButtons />
          </div>
        )}
      </div>
      <p className="mt-1 text-sm text-ink-3">학생 메뉴에 보이는 FAQ 분류의 이름·순서를 바꿔요.</p>
      {!senior && (
        <Segmented
          className="mt-3 w-fit max-w-full"
          itemClassName="px-4 py-1.5 text-sm font-semibold"
          options={[['faq', '행정실 FAQ'], ['senior', '선배 FAQ']] as const}
          value={faqKind}
          onChange={setFaqKind}
        />
      )}
      <div key={faqKind} className="mt-4 grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        {faqKind === 'faq' ? (
          <>
            <Block title="이름 수정" desc="대분류·소분류 이름을 그 분류의 모든 FAQ에서 한 번에 바꿔요."><FAQCategoryRename /></Block>
            <Block title="순서 수정" desc="끌어서 학생 메뉴에 보이는 순서를 바꿔요."><FAQCategoryReorder /></Block>
          </>
        ) : (
          <>
            <Block title="이름 수정" desc="대분류·소분류·세부 항목 이름을 한 번에 바꿔요."><SeniorFAQCategoryRename /></Block>
            <Block title="순서 수정" desc="끌어서 학생 메뉴에 보이는 순서를 바꿔요."><SeniorFAQCategoryReorder /></Block>
          </>
        )}
      </div>
    </section>
  );
};

export default CategoryMain;
