import React, { useState } from 'react';
import Icon from '../../ui/Icon';
import { appAlert } from '../../ui/Dialog';
import { downloadFaqExcel, ExcelScope } from './faqExcelApi';
import FAQExcelUpload from './FAQExcelUpload';

/**
 * FAQ 목록 위 [엑셀로 받기] [엑셀로 올리기] — 파일 하나에 FAQ·선배 FAQ·담당자·이메일·키워드 규칙·프로필 항목 시트
 *   scope 'senior': 선배 FAQ만 (근로장학생 계정 — 선배 FAQ 화면에서 씀)
 * 휴대폰: 아이콘 + 짧은 이름(받기·올리기)으로 정렬 칸과 한 줄에 들어가게
 */
const FAQExcelButtons: React.FC<{ scope?: ExcelScope }> = ({ scope = 'all' }) => {
  const [downloading, setDownloading] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const senior = scope === 'senior';

  const download = async () => {
    if (downloading) return;
    setDownloading(true);
    const error = await downloadFaqExcel(scope);
    setDownloading(false);
    if (error) appAlert(error);
  };

  const btn =
    'inline-flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-line bg-surface px-2.5 text-sm font-semibold text-ink hover:bg-card disabled:opacity-60 sm:px-3';

  return (
    <>
      <button
        type="button"
        onClick={download}
        disabled={downloading}
        className={btn}
        aria-label={senior ? '선배 FAQ만 엑셀로 받기' : '엑셀로 받기'}
        title={
          senior
            ? '선배 FAQ만 엑셀로 받아요'
            : '학부·대학원·공통 FAQ, 선배 FAQ, 담당자, 이메일, 키워드 규칙, 프로필 항목이 시트별로 들어 있어요'
        }
      >
        <Icon name="download" />
        {downloading ? (
          '만드는 중…'
        ) : (
          <>
            <span className="sm:hidden">받기</span>
            <span className="hidden sm:inline">{senior ? '선배 FAQ만 엑셀로 받기' : '엑셀로 받기'}</span>
          </>
        )}
      </button>
      <button
        type="button"
        onClick={() => setUploadOpen(true)}
        className={btn}
        aria-label={senior ? '선배 FAQ만 엑셀로 올리기' : '엑셀로 올리기'}
        title={senior ? '선배 FAQ만 엑셀로 올려요' : '엑셀로 올리기'}
      >
        <Icon name="upload" />
        <span className="sm:hidden">올리기</span>
        <span className="hidden sm:inline">{senior ? '선배 FAQ만 엑셀로 올리기' : '엑셀로 올리기'}</span>
      </button>
      {uploadOpen && <FAQExcelUpload scope={scope} onClose={() => setUploadOpen(false)} />}
    </>
  );
};

export default FAQExcelButtons;
