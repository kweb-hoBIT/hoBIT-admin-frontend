import envs from '../../../config/envs';

/** hoBIT 데이터 엑셀 API (FAQ·선배 FAQ·담당자·이메일) — 파일 받기·올리기는 JSON이 아니라 공통 API 함수 대신 fetch를 바로 씀 */
const endpoint = `${envs.HOBIT_ADMIN_BACKEND_ENDPOINT!}`;

export type ExcelIssue = { sheet?: string; row: number | null; message: string };
export type ExcelChange = { field: string; label: string; before: string; after: string; auto_translate?: boolean };

export type SheetSummary = { created: number; updated: number; deleted: number; unchanged: number; missing_from_file: number };
export type SheetPreview = {
  summary: SheetSummary;
  created: { row: number; question: string; maincategory: string; subcategory: string; audience?: string; answers: string[] }[];
  updated: { id: number; row: number; question: string; changes: ExcelChange[] }[];
  deleted: { id: number; row: number; question: string }[];
};

/** 미리보기 — 시트마다 (FAQ / 선배 FAQ / 담당자 / 이메일). 파일에 없는 시트는 null·빈 목록 */
export type ExcelPreview = {
  plan_id: string | null;
  auto_translate: boolean;
  translate_count: number;
  missing_sheets: string[];
  faq: SheetPreview | null;
  senior: SheetPreview | null;
  managers: { row: number; from: string; to: string; faq_count: number; senior_count: number }[];
  emails: { row: number; from: string; to: string; count: number }[];
  problems: ExcelIssue[];
  warnings: ExcelIssue[];
};

type Counts = { created: number; updated: number; deleted: number };
export type ExcelApplyResult = { faq: Counts; senior: Counts; managers: number; emails: number; backup_id: number; untranslated: number };
export type RestoreResult = { faq: Counts; senior: Counts };
export type FaqBackup = { id: number; created_at: string; note: string; row_count: number; senior_row_count: number; username: string | null };

type Result<T> = { ok: true; data: T } | { ok: false; message: string };

const NETWORK_ERROR = '서버에 연결하지 못했어요. 잠시 후 다시 해 주세요.';

async function call<T>(path: string, init: RequestInit): Promise<Result<T>> {
  try {
    const resp = await fetch(`${endpoint}/${path}`, { mode: 'cors', credentials: 'include', ...init });
    const json = await resp.json().catch(() => null);
    if (!resp.ok) return { ok: false, message: json?.message || NETWORK_ERROR };
    return { ok: true, data: json?.data as T };
  } catch {
    return { ok: false, message: NETWORK_ERROR };
  }
}

const todayKST = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date());

/** FAQ 전체 엑셀을 내려받음 — 실패하면 안내 문구 */
export async function downloadFaqExcel(): Promise<string | null> {
  try {
    const resp = await fetch(`${endpoint}/faqs/excel`, { mode: 'cors', credentials: 'include' });
    if (!resp.ok) {
      const json = await resp.json().catch(() => null);
      return json?.message || '엑셀 파일을 받지 못했어요. 잠시 후 다시 해 주세요.';
    }
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hoBIT_데이터_${todayKST()}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return null;
  } catch {
    return NETWORK_ERROR;
  }
}

export function previewFaqExcel(file: File) {
  const form = new FormData();
  form.append('file', file);
  return call<ExcelPreview>('faqs/excel/preview', { method: 'POST', body: form });
}

export function applyFaqExcel(planId: string) {
  return call<ExcelApplyResult>('faqs/excel/apply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan_id: planId }),
  });
}

export function listFaqBackups() {
  return call<{ backups: FaqBackup[] }>('faqs/excel/backups', { method: 'GET' });
}

export function restoreFaqBackup(backupId: number) {
  return call<RestoreResult>('faqs/excel/restore', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ backup_id: backupId }),
  });
}
