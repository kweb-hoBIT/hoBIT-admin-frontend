import React, { useState } from 'react';
import Icon from '../../ui/Icon';
import { appAlert } from '../../ui/Dialog';
import { downloadFaqExcel } from './faqExcelApi';
import FAQExcelUpload from './FAQExcelUpload';

/** FAQ 목록 위 [엑셀로 받기] [엑셀로 올리기] — 파일 하나에 FAQ·선배 FAQ·담당자·이메일 시트 */
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
    'inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-2 text-sm font-semibold text-ink hover:bg-card disabled:opacity-60';

  return (
    <>
      <button type="button" onClick={download} disabled={downloading} className={btn}>
        <Icon name="download" />
        {downloading ? '만드는 중…' : '엑셀로 받기 (FAQ·선배 FAQ·담당자·이메일)'}
      </button>
      <button type="button" onClick={() => setUploadOpen(true)} className={btn}>
        <Icon name="upload" />
        엑셀로 올리기
      </button>
      {uploadOpen && <FAQExcelUpload onClose={() => setUploadOpen(false)} />}
    </>
  );
};

export default FAQExcelButtons;
