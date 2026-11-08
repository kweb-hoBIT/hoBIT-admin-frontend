import React, { useState } from 'react';
import Icon from '../../ui/Icon';
import { appAlert } from '../../ui/Dialog';
import { downloadFaqExcel } from './faqExcelApi';
import FAQExcelUpload from './FAQExcelUpload';

/**
 * FAQ 목록 위 [엑셀로 받기] [엑셀로 올리기] — 파일 하나에 FAQ·선배 FAQ·담당자·이메일 시트
 * 휴대폰: 아이콘 + 짧은 이름(받기·올리기)으로 정렬 칸과 한 줄에 들어가게
 */
const FAQExcelButtons: React.FC = () => {
  const [downloading, setDownloading] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const download = async () => {
    if (downloading) return;
    setDownloading(true);
    const error = await downloadFaqExcel();
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
        aria-label="엑셀로 받기"
        title="학부·대학원·공통 FAQ, 선배 FAQ, 담당자, 이메일이 시트별로 들어 있어요"
      >
        <Icon name="download" />
        {downloading ? (
          '만드는 중…'
        ) : (
          <>
            <span className="sm:hidden">받기</span>
            <span className="hidden sm:inline">엑셀로 받기</span>
          </>
        )}
      </button>
      <button type="button" onClick={() => setUploadOpen(true)} className={btn} aria-label="엑셀로 올리기" title="엑셀로 올리기">
        <Icon name="upload" />
        <span className="sm:hidden">올리기</span>
        <span className="hidden sm:inline">엑셀로 올리기</span>
      </button>
      {uploadOpen && <FAQExcelUpload onClose={() => setUploadOpen(false)} />}
    </>
  );
};

export default FAQExcelButtons;
