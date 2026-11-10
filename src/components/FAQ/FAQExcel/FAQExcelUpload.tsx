import React, { useEffect, useRef, useState } from 'react';
import Icon from '../../ui/Icon';
import { appAlert, appChoice } from '../../ui/Dialog';
import {
  applyFaqExcel,
  ExcelApplyResult,
  ExcelChange,
  ExcelIssue,
  ExcelPreview,
  ExcelScope,
  FaqBackup,
  listFaqBackups,
  previewFaqExcel,
  restoreFaqBackup,
  SheetPreview,
  SheetSummary,
  SimpleSheetPreview,
} from './faqExcelApi';

/**
 * 엑셀로 올리기 — 파일 고르기 → 바뀔 내용 미리보기(시트마다) → 적용하기
 *   시트: FAQ(행정실 FAQ) · 선배 FAQ · 담당자 · 이메일 · 키워드 규칙 · 프로필 항목 — 파일에 없는 시트는 바뀐 것 없음
 *   scope 'senior'(근로장학생 계정): 선배 FAQ 시트만 읽고, 되돌리기도 선배 FAQ만 저장한 상태만
 *   고쳐야 할 부분(problems)이 있으면 적용 버튼을 막고 그 목록을 맨 위에 보여 줌
 *   아래에는 '이전 상태로 되돌리기' (적용할 때마다 자동으로 저장해 둔 상태)
 */
type Step = 'pick' | 'reading' | 'preview' | 'applying' | 'done';

const rowLabel = (row: number | null, sheet?: string) => (row ? `${sheet ? `${sheet} ` : ''}${row}번째 줄` : '파일');
const issueLabel = (p: ExcelIssue) => (p.sheet ? `${p.sheet} · ${rowLabel(p.row)}` : rowLabel(p.row));

const formatTime = (iso: string) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

const Chip: React.FC<{ label: string; n: number; tone: string }> = ({ label, n, tone }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${tone}`}>
    {label} <span className="tabular-nums">{n}</span>
  </span>
);

const Section: React.FC<{
  title: string;
  count: number;
  children: React.ReactNode;
}> = ({ title, count, children }) => (
  <section className="rounded-2xl border border-line p-4">
    <h3 className="mb-3 !text-base">
      {title} <span className="text-ink-3 tabular-nums">{count}</span>
    </h3>
    <div className="space-y-3">{children}</div>
  </section>
);

const IssueList: React.FC<{ items: ExcelIssue[]; tone: 'danger' | 'warn' }> = ({ items, tone }) => (
  <ul className="space-y-1.5 text-sm">
    {items.map((p, i) => (
      <li key={i} className="flex gap-2">
        <span className={`shrink-0 font-semibold ${tone === 'danger' ? 'text-danger' : 'text-warn'}`}>{issueLabel(p)}</span>
        <span className="text-ink">{p.message}</span>
      </li>
    ))}
  </ul>
);

/** 시트 요약 칩 + 파일에 없는 줄 안내 */
const SummaryChips: React.FC<{ s: SheetSummary; noun: string }> = ({ s, noun }) => (
  <>
    <div className="flex flex-wrap gap-2">
      <Chip label="새로 생김" n={s.created} tone="bg-success-soft text-success" />
      <Chip label="바뀜" n={s.updated} tone="bg-accent/10 text-accent-ink dark:bg-accent-ink/15" />
      <Chip label="삭제" n={s.deleted} tone="bg-danger-soft text-danger" />
      <Chip label="그대로" n={s.unchanged} tone="bg-card-2 text-ink-2" />
      <Chip label="파일에 없음(그대로 둠)" n={s.missing_from_file} tone="bg-card-2 text-ink-2" />
    </div>
    {s.missing_from_file > 0 && (
      <p className="text-sm text-ink-3">
        파일에 없는 {noun} {s.missing_from_file}개는 지우지 않고 그대로 둬요. 지우려면 그 줄의 '삭제' 칸에서 '삭제'를 골라 주세요.
      </p>
    )}
  </>
);

/** 바뀌는 칸 목록 (전 → 후) */
const ChangeList: React.FC<{ changes: ExcelChange[] }> = ({ changes }) => (
  <div className="mt-2 space-y-2">
    {changes.map((c) => (
      <div key={c.field} className="grid grid-cols-1 gap-1 sm:grid-cols-[96px_minmax(0,1fr)]">
        <div className="text-xs font-semibold text-ink-3 sm:pt-1">{c.label}</div>
        <div className="flex flex-wrap items-start gap-1.5">
          <span className="whitespace-pre-line rounded-lg bg-danger-soft px-2 py-1 text-ink line-through decoration-danger/60">
            {c.before || '(비어 있음)'}
          </span>
          <Icon name="arrowRight" className="mt-1.5 h-3.5 w-3.5 text-ink-3" />
          <span className="whitespace-pre-line rounded-lg bg-success-soft px-2 py-1 font-medium text-ink">
            {c.auto_translate ? '(적용할 때 자동 번역)' : c.after || '(비어 있음)'}
          </span>
        </div>
      </div>
    ))}
  </div>
);

/** FAQ / 선배 FAQ 시트 하나의 바뀔 내용 */
const SheetBlock: React.FC<{
  title: string;
  sheet: SheetPreview;
  noun: string;
}> = ({ title, sheet, noun }) => {
  return (
    <section className="space-y-3 rounded-2xl border border-line p-4">
      <h3 className="!text-base">{title}</h3>
      <SummaryChips s={sheet.summary} noun={noun} />

      {sheet.created.length > 0 && (
        <Section title="새로 생김" count={sheet.created.length}>
          {sheet.created.map((c) => (
            <div key={`${c.sheet ?? ''}-${c.row}`} className="rounded-xl bg-card p-3 text-sm">
              <div className="font-semibold text-ink">{c.question}</div>
              <div className="mt-0.5 text-xs text-ink-3">
                {c.audience ? `${c.audience} · ` : ''}
                {c.maincategory} › {c.subcategory} · {rowLabel(c.row, c.sheet)}
              </div>
              <ul className="mt-2 space-y-1 text-ink-2">
                {c.answers.map((a, i) => (
                  <li key={i} className="whitespace-pre-line line-clamp-3">
                    {c.answers.length > 1 && <span className="mr-1 text-ink-3">답변 {i + 1}.</span>}
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {sheet.updated.length > 0 && (
        <Section title="바뀜" count={sheet.updated.length}>
          {sheet.updated.map((u) => (
            <div key={u.id} className="rounded-xl bg-card p-3 text-sm">
              <div className="font-semibold text-ink">
                <span className="mr-1.5 text-ink-3 tabular-nums">#{u.id}</span>
                {u.question}
              </div>
              <ChangeList changes={u.changes} />
            </div>
          ))}
        </Section>
      )}

      {sheet.deleted.length > 0 && (
        <Section title="삭제" count={sheet.deleted.length}>
          {sheet.deleted.map((d) => (
            <div key={d.id} className="rounded-xl bg-danger-soft p-3 text-sm text-ink">
              <span className="mr-1.5 text-ink-3 tabular-nums">#{d.id}</span>
              {d.question}
            </div>
          ))}
        </Section>
      )}
    </section>
  );
};

/** 키워드 규칙 / 프로필 항목 시트 하나의 바뀔 내용 */
const SimpleSheetBlock: React.FC<{
  title: string;
  sheet: SimpleSheetPreview;
  noun: string;
  note?: string;
}> = ({ title, sheet, noun, note }) => (
  <section className="space-y-3 rounded-2xl border border-line p-4">
    <h3 className="!text-base">{title}</h3>
    <SummaryChips s={sheet.summary} noun={noun} />
    {note && <p className="text-sm text-ink-3">{note}</p>}

    {sheet.created.length > 0 && (
      <Section title="새로 생김" count={sheet.created.length}>
        {sheet.created.map((c) => (
          <div key={c.row} className="rounded-xl bg-card p-3 text-sm">
            <div className="font-semibold text-ink">{c.title}</div>
            <div className="mt-0.5 text-xs text-ink-3">{rowLabel(c.row)}</div>
            {c.details.length > 0 && (
              <ul className="mt-2 space-y-1 text-ink-2">
                {c.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </Section>
    )}

    {sheet.updated.length > 0 && (
      <Section title="바뀜" count={sheet.updated.length}>
        {sheet.updated.map((u) => (
          <div key={u.id} className="rounded-xl bg-card p-3 text-sm">
            <div className="font-semibold text-ink">
              <span className="mr-1.5 text-ink-3 tabular-nums">#{u.id}</span>
              {u.title}
            </div>
            <ChangeList changes={u.changes} />
          </div>
        ))}
      </Section>
    )}

    {sheet.deleted.length > 0 && (
      <Section title="삭제" count={sheet.deleted.length}>
        {sheet.deleted.map((d) => (
          <div key={d.id} className="rounded-xl bg-danger-soft p-3 text-sm text-ink">
            <span className="mr-1.5 text-ink-3 tabular-nums">#{d.id}</span>
            {d.title}
          </div>
        ))}
      </Section>
    )}
  </section>
);

const sheetCount = (x?: { summary: SheetSummary } | null) => (x ? x.summary.created + x.summary.updated + x.summary.deleted : 0);

/** 담당자·이메일 바꾸기 목록 */
const RenameBlock: React.FC<{
  title: string;
  items: { row: number; from: string; to: string; note: string }[];
}> = ({ title, items }) => (
  <section className="rounded-2xl border border-line p-4">
    <h3 className="mb-3 !text-base">
      {title} <span className="text-ink-3 tabular-nums">{items.length}</span>
    </h3>
    <ul className="space-y-2 text-sm">
      {items.map((it) => (
        <li key={it.row} className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-lg bg-danger-soft px-2 py-1 text-ink line-through decoration-danger/60">{it.from}</span>
          <Icon name="arrowRight" className="h-3.5 w-3.5 text-ink-3" />
          <span className="rounded-lg bg-success-soft px-2 py-1 font-medium text-ink">{it.to}</span>
          <span className="text-xs text-ink-3">{it.note}</span>
        </li>
      ))}
    </ul>
  </section>
);

const FAQExcelUpload: React.FC<{ onClose: () => void; scope?: ExcelScope }> = ({ onClose, scope = 'all' }) => {
  const senior = scope === 'senior';
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>('pick');
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState<ExcelPreview | null>(null);
  const [result, setResult] = useState<string>('');
  const [backups, setBackups] = useState<FaqBackup[] | null>(null);
  const [restoring, setRestoring] = useState(false);
  const changedSomething = useRef(false);

  const loadBackups = async () => {
    const r = await listFaqBackups(scope);
    setBackups(r.ok ? r.data.backups : []);
  };
  useEffect(() => {
    loadBackups();
  }, []);

  const close = () => {
    if (step === 'reading' || step === 'applying' || restoring) return;
    onClose();
    if (changedSomething.current) window.location.reload(); // 목록 새로 불러오기
  };

  const pickFile = async (file: File | undefined) => {
    if (!file) return;
    if (!/\.xlsx$/i.test(file.name)) {
      appAlert('엑셀(.xlsx) 파일만 올릴 수 있어요.');
      return;
    }
    setFileName(file.name);
    setStep('reading');
    const r = await previewFaqExcel(file, scope);
    if (fileRef.current) fileRef.current.value = '';
    if (!r.ok) {
      setStep('pick');
      appAlert(r.message);
      return;
    }
    setPreview(r.data);
    setStep('preview');
  };

  const apply = async () => {
    if (!preview?.plan_id) return;
    const pick = await appChoice(
      `${changeSummary(preview)}\n이대로 적용할까요? 적용하기 전 상태는 자동으로 저장해 둬요.`,
      [{ label: '적용하기', value: 'apply', primary: true }],
      '취소'
    );
    if (pick !== 'apply') return;
    setStep('applying');
    const r = await applyFaqExcel(preview.plan_id, scope);
    if (!r.ok) {
      setStep('preview');
      appAlert(r.message);
      return;
    }
    changedSomething.current = true;
    setResult(resultMessage(r.data));
    setStep('done');
    loadBackups();
  };

  const restore = async (b: FaqBackup) => {
    const seniorBackup = b.scope === 'senior';
    const pick = await appChoice(
      seniorBackup
        ? `${formatTime(b.created_at)} 상태(선배 FAQ ${b.senior_row_count}개)로 되돌릴까요?\n그 뒤에 고치거나 새로 만든 선배 FAQ도 그때 상태로 돌아가요. 다른 데이터는 그대로예요. 지금 상태는 자동으로 저장해 둬요.`
        : `${formatTime(b.created_at)} 상태(FAQ ${b.row_count}개 · 선배 FAQ ${b.senior_row_count}개)로 되돌릴까요?\n그 뒤에 고치거나 새로 만든 FAQ·선배 FAQ·키워드 규칙·프로필 항목도 그때 상태로 돌아가요. 지금 상태는 자동으로 저장해 둬요.`,
      [{ label: '되돌리기', value: 'restore', primary: true }],
      '취소'
    );
    if (pick !== 'restore') return;
    setRestoring(true);
    const r = await restoreFaqBackup(b.id, scope);
    setRestoring(false);
    if (!r.ok) {
      appAlert(r.message);
      return;
    }
    changedSomething.current = true;
    const zero = { created: 0, updated: 0, deleted: 0 };
    const { faq, senior: s, keywords = zero, profileOptions = zero } = r.data;
    const n = (c: { created: number; updated: number; deleted: number }) => c.created + c.updated + c.deleted;
    const lines = ['되돌렸어요.'];
    const line = (name: string, c: { created: number; updated: number; deleted: number }) => {
      if (n(c) > 0) lines.push(`${name}: 다시 생김 ${c.created}개 · 바뀜 ${c.updated}개 · 지움 ${c.deleted}개`);
    };
    line('FAQ', faq);
    line('선배 FAQ', s);
    line('키워드 규칙', keywords);
    line('프로필 항목', profileOptions);
    if (n(profileOptions) > 0) lines.push('프로필 항목은 1분쯤 뒤에 학생 화면에 반영돼요.');
    await appAlert(n(faq) + n(s) + n(keywords) + n(profileOptions) === 0 ? '이미 그때와 같은 상태라 바뀐 게 없어요.' : lines.join('\n'));
    loadBackups();
  };

  const problems = preview?.problems ?? [];
  const total = preview ? changeCount(preview) : 0;
  const canApply = !!preview?.plan_id && problems.length === 0 && total > 0 && step === 'preview';

  return (
    <div className="modal-overlay" role="presentation" onClick={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={senior ? '선배 FAQ 엑셀로 올리기' : '엑셀로 올리기'}
        onClick={(e) => e.stopPropagation()}
        className="modal-panel max-w-[760px] max-h-[90vh] overflow-y-auto space-y-5"
      >
        <div className="flex items-center justify-between">
          <h2>{senior ? '선배 FAQ 엑셀로 올리기' : '엑셀로 올리기'}</h2>
          <button type="button" onClick={close} aria-label="닫기" className="rounded-xl p-2 text-ink-3 hover:bg-card hover:text-ink">
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>

        {/* 파일 고르기 */}
        {step !== 'done' && (
          <div className="rounded-2xl border border-dashed border-line bg-card p-5 text-center">
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className="hidden"
              onChange={(e) => pickFile(e.target.files?.[0])}
            />
            <p className="mb-3 text-sm text-ink-2">
              {senior
                ? '[엑셀로 받기]로 받은 선배 FAQ 파일을 고쳐서 올려 주세요. 선배 FAQ 시트만 반영해요. 올리기만 하면 아직 아무것도 바뀌지 않아요.'
                : '[엑셀로 받기]로 받은 파일(FAQ·선배 FAQ·담당자·이메일·키워드 규칙·프로필 항목 시트)을 고쳐서 올려 주세요. 올리기만 하면 아직 아무것도 바뀌지 않아요.'}
            </p>
            <button
              type="button"
              disabled={step === 'reading' || step === 'applying'}
              onClick={() => fileRef.current?.click()}
              className="rounded-xl inline-flex items-center gap-1.5 bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-60"
            >
              <Icon name="file" />
              {step === 'reading' ? '읽는 중…' : preview ? '다른 파일 고르기' : '파일 고르기'}
            </button>
            {fileName && <p className="mt-2 text-xs text-ink-3">{fileName}</p>}
          </div>
        )}

        {/* 결과 */}
        {step === 'done' && (
          <div className="rounded-2xl border border-line bg-success-soft p-5">
            <p className="whitespace-pre-line font-semibold text-ink">{result}</p>
            <button type="button" onClick={close} className="rounded-xl mt-4 bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-accent/90">
              닫기
            </button>
          </div>
        )}

        {/* 미리보기 */}
        {preview && step !== 'done' && (
          <>
            {problems.length > 0 && (
              <section className="rounded-2xl border border-danger/40 bg-danger-soft p-4">
                <h3 className="mb-2 flex items-center gap-1.5 !text-base text-danger">
                  <Icon name="alert" /> 고쳐야 할 부분 {problems.length}개
                </h3>
                <p className="mb-3 text-sm text-ink-2">엑셀에서 고친 뒤 다시 올려 주세요. 이 부분을 고치기 전에는 적용할 수 없어요.</p>
                <IssueList items={problems} tone="danger" />
              </section>
            )}

            {preview.warnings.length > 0 && (
              <section className="rounded-2xl border border-line bg-warn-soft p-4">
                <h3 className="mb-2 !text-base">확인해 주세요 {preview.warnings.length}개</h3>
                <IssueList items={preview.warnings} tone="warn" />
              </section>
            )}

            {total === 0 && problems.length === 0 && <p className="rounded-2xl bg-card p-4 text-sm text-ink-2">바뀐 내용이 없어요.</p>}

            {!senior && preview.faq && <SheetBlock title="FAQ (행정실 FAQ)" sheet={preview.faq} noun="FAQ" />}
            {preview.senior && <SheetBlock title="선배 FAQ" sheet={preview.senior} noun="선배 FAQ" />}
            {!senior && preview.managers.length > 0 && (
              <RenameBlock
                title="담당자 바꿈"
                items={preview.managers.map((m) => ({
                  ...m,
                  note: `행정실 FAQ ${m.faq_count}개 · 선배 FAQ ${m.senior_count}개`,
                }))}
              />
            )}
            {!senior && preview.emails.length > 0 && (
              <RenameBlock
                title="이메일 바꿈"
                items={preview.emails.map((e) => ({
                  ...e,
                  note: `답변 ${e.count}개`,
                }))}
              />
            )}
            {!senior && preview.keywords && <SimpleSheetBlock title="키워드 규칙" sheet={preview.keywords} noun="규칙" />}
            {!senior && preview.profileOptions && (
              <SimpleSheetBlock
                title="프로필 항목"
                sheet={preview.profileOptions}
                noun="항목"
                note={
                  sheetCount(preview.profileOptions) > 0
                    ? '적용하면 1분쯤 뒤에 학생 화면의 선택지에 반영돼요. (호빗이 프로필 항목을 1분마다 새로 읽어요)'
                    : undefined
                }
              />
            )}
            {!senior && preview.missing_sheets.length > 0 && (
              <p className="text-sm text-ink-3">파일에 {preview.missing_sheets.join(', ')} 시트가 없어서 그 내용은 그대로 둬요.</p>
            )}

            {preview.auto_translate && preview.translate_count > 0 && problems.length === 0 && (
              <p className="text-sm text-ink-3">비어 있는 영어 칸 {preview.translate_count}개는 적용할 때 자동으로 번역해요.</p>
            )}

            <div className="flex justify-end gap-2 [&>button]:flex-1 sm:[&>button]:flex-none">
              <button type="button" onClick={close} className="rounded-xl bg-card px-5 py-2.5 text-sm font-semibold text-ink-2 hover:bg-card-2">
                취소
              </button>
              <button
                type="button"
                onClick={apply}
                disabled={!canApply}
                className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {step === 'applying' ? '적용하는 중…' : '적용하기'}
              </button>
            </div>
          </>
        )}

        {/* 이전 상태로 되돌리기 */}
        <section className="rounded-2xl border border-line p-4">
          <h3 className="mb-1 flex items-center gap-1.5 !text-base">
            <Icon name="undo" /> 이전 상태로 되돌리기
          </h3>
          <p className="mb-3 text-sm text-ink-3">
            {senior
              ? '엑셀을 적용하거나 되돌리기 전에 자동으로 저장해 둔 선배 FAQ 상태예요. 최근 20개까지 남아요.'
              : '엑셀을 적용하거나 되돌리기 전에 자동으로 저장해 둔 상태예요 (FAQ·선배 FAQ·키워드 규칙·프로필 항목, 선배 FAQ만 저장한 것도 있어요). 최근 20개까지 남아요.'}
          </p>
          {backups === null ? (
            <p className="text-sm text-ink-3">불러오는 중…</p>
          ) : backups.length === 0 ? (
            <p className="text-sm text-ink-3">아직 저장해 둔 상태가 없어요.</p>
          ) : (
            <ul className="divide-y divide-line">
              {backups.slice(0, 8).map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <div className="min-w-0">
                    <div className="truncate text-ink">{b.note || '저장해 둔 상태'}</div>
                    <div className="text-xs text-ink-3">
                      {formatTime(b.created_at)} · {b.username ?? '알 수 없음'} ·{' '}
                      {b.scope === 'senior'
                        ? `선배 FAQ만 · ${b.senior_row_count}개`
                        : `FAQ ${b.row_count}개 · 선배 FAQ ${b.senior_row_count}개`}
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={restoring || step === 'applying' || step === 'reading'}
                    onClick={() => restore(b)}
                    className="rounded-xl shrink-0 border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:bg-card disabled:opacity-50"
                  >
                    {restoring ? '되돌리는 중…' : '이때로 되돌리기'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

function changeCount(p: ExcelPreview): number {
  return (
    sheetCount(p.faq) + sheetCount(p.senior) + p.managers.length + p.emails.length + sheetCount(p.keywords) + sheetCount(p.profileOptions)
  );
}

function changeSummary(p: ExcelPreview): string {
  const lines: string[] = [];
  const sheet = (name: string, x?: { summary: SheetSummary } | null) => {
    if (x && sheetCount(x) > 0) {
      lines.push(`${name}: 새로 생김 ${x.summary.created}개 · 바뀜 ${x.summary.updated}개 · 삭제 ${x.summary.deleted}개`);
    }
  };
  sheet('FAQ', p.faq);
  sheet('선배 FAQ', p.senior);
  if (p.managers.length) lines.push(`담당자 바꿈 ${p.managers.length}개`);
  if (p.emails.length) lines.push(`이메일 바꿈 ${p.emails.length}개`);
  sheet('키워드 규칙', p.keywords);
  sheet('프로필 항목', p.profileOptions);
  return lines.join('\n');
}

function resultMessage(r: ExcelApplyResult): string {
  const lines = ['적용했어요.'];
  const sheet = (name: string, c: { created: number; updated: number; deleted: number }) => {
    if (c.created + c.updated + c.deleted > 0) lines.push(`${name}: 새로 생김 ${c.created}개 · 바뀜 ${c.updated}개 · 삭제 ${c.deleted}개`);
  };
  sheet('FAQ', r.faq);
  sheet('선배 FAQ', r.senior);
  if (r.managers) lines.push(`담당자 바꿈 ${r.managers}개`);
  if (r.emails) lines.push(`이메일 바꿈 ${r.emails}개`);
  if (r.keywords) sheet('키워드 규칙', r.keywords);
  if (r.profileOptions) {
    sheet('프로필 항목', r.profileOptions);
    if (r.profileOptions.created + r.profileOptions.updated + r.profileOptions.deleted > 0) {
      lines.push('프로필 항목은 1분쯤 뒤에 학생 화면에 반영돼요.');
    }
  }
  if (r.untranslated > 0) {
    lines.push(`영어 칸 ${r.untranslated}개는 번역하지 못해 비어 있어요. FAQ 화면에서 영어를 채워 주세요.`);
  }
  if (r.faq.created > 0) lines.push('비슷한 질문 목록은 뒤에서 만들고 있어요.');
  return lines.join('\n');
}

export default FAQExcelUpload;
