import envs from '../../../config/envs';

/**
 * hoBIT 데이터 엑셀 API (FAQ·선배 FAQ·담당자·이메일·키워드 규칙·프로필 항목) — 파일 받기·올리기는 JSON이 아니라 공통 API 함수 대신 fetch를 바로 씀
 *   scope 'senior': 선배 FAQ만 (근로장학생 계정) — 모든 요청에 ?scope=senior
 */
const endpoint = `${envs.HOBIT_ADMIN_BACKEND_ENDPOINT!}`;

export type ExcelScope = 'all' | 'senior';
const withScope = (path: string, scope: ExcelScope = 'all') => (scope === 'senior' ? `${path}?scope=senior` : path);

export type ExcelIssue = {
  sheet?: string;
  row: number | null;
  message: string;
};
export type ExcelChange = {
  field: string;
  label: string;
  before: string;
  after: string;
  auto_translate?: boolean;
};

export type SheetSummary = {
  created: number;
  updated: number;
  deleted: number;
  unchanged: number;
  missing_from_file: number;
};
export type SheetPreview = {
  summary: SheetSummary;
  created: {
    row: number;
    sheet?: string;
    question: string;
    maincategory: string;
    subcategory: string;
    audience?: string;
    answers: string[];
  }[];
  updated: {
    id: number;
    row: number;
    sheet?: string;
    question: string;
    changes: ExcelChange[];
  }[];
  deleted: { id: number; row: number; sheet?: string; question: string }[];
};

/** 키워드 규칙·프로필 항목 시트 — title: 한 줄 이름, details: 새로 생기는 내용 요약 */
export type SimpleSheetPreview = {
  summary: SheetSummary;
  created: { row: number; title: string; details: string[] }[];
  updated: { id: number; row: number; title: string; changes: ExcelChange[] }[];
  deleted: { id: number; row: number; title: string }[];
};

/** 미리보기 — 시트마다 (FAQ / 선배 FAQ / 담당자 / 이메일 / 키워드 규칙 / 프로필 항목). 파일에 없는 시트는 null·빈 목록 */
export type ExcelPreview = {
  scope?: ExcelScope;
  plan_id: string | null;
  auto_translate: boolean;
  translate_count: number;
  missing_sheets: string[];
  faq: SheetPreview | null;
  senior: SheetPreview | null;
  managers: {
    row: number;
    from: string;
    to: string;
    faq_count: number;
    senior_count: number;
  }[];
  emails: { row: number; from: string; to: string; count: number }[];
  keywords?: SimpleSheetPreview | null;
  profileOptions?: SimpleSheetPreview | null;
  problems: ExcelIssue[];
  warnings: ExcelIssue[];
};

type Counts = { created: number; updated: number; deleted: number };
export type ExcelApplyResult = {
  faq: Counts;
  senior: Counts;
  managers: number;
  emails: number;
  keywords?: Counts;
  profileOptions?: Counts;
  backup_id: number;
  untranslated: number;
};
export type RestoreResult = {
  scope?: ExcelScope;
  faq: Counts;
  senior: Counts;
  keywords?: Counts;
  profileOptions?: Counts;
};
export type FaqBackup = {
  id: number;
  created_at: string;
  note: string;
  row_count: number;
  senior_row_count: number;
  username: string | null;
  scope?: ExcelScope; // 'senior' = 선배 FAQ만 저장한 상태
};

type Result<T> = { ok: true; data: T } | { ok: false; message: string };

const NETWORK_ERROR = '서버에 연결하지 못했어요. 잠시 후 다시 해 주세요.';

async function call<T>(path: string, init: RequestInit): Promise<Result<T>> {
  try {
    const resp = await fetch(`${endpoint}/${path}`, {
      mode: 'cors',
      credentials: 'include',
      ...init,
    });
    const json = await resp.json().catch(() => null);
    if (!resp.ok) return { ok: false, message: json?.message || NETWORK_ERROR };
    return { ok: true, data: json?.data as T };
  } catch {
    return { ok: false, message: NETWORK_ERROR };
  }
}

const todayKST = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date());

/** 엑셀을 내려받음 (scope 'senior'면 선배 FAQ만) — 실패하면 안내 문구 */
export async function downloadFaqExcel(scope: ExcelScope = 'all'): Promise<string | null> {
  try {
    const resp = await fetch(`${endpoint}/${withScope('faqs/excel', scope)}`, {
      mode: 'cors',
      credentials: 'include',
    });
    if (!resp.ok) {
      const json = await resp.json().catch(() => null);
      return json?.message || '엑셀 파일을 받지 못했어요. 잠시 후 다시 해 주세요.';
    }
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scope === 'senior' ? 'hoBIT_선배FAQ' : 'hoBIT_데이터'}_${todayKST()}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return null;
  } catch {
    return NETWORK_ERROR;
  }
}

export function previewFaqExcel(file: File, scope: ExcelScope = 'all') {
  const form = new FormData();
  form.append('file', file);
  return call<ExcelPreview>(withScope('faqs/excel/preview', scope), {
    method: 'POST',
    body: form,
  });
}

export function applyFaqExcel(planId: string, scope: ExcelScope = 'all') {
  return call<ExcelApplyResult>(withScope('faqs/excel/apply', scope), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan_id: planId }),
  });
}

export function listFaqBackups(scope: ExcelScope = 'all') {
  return call<{ backups: FaqBackup[] }>(withScope('faqs/excel/backups', scope), { method: 'GET' });
}

export function restoreFaqBackup(backupId: number, scope: ExcelScope = 'all') {
  return call<RestoreResult>(withScope('faqs/excel/restore', scope), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ backup_id: backupId }),
  });
}
