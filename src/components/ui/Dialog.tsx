import { useEffect, useRef, useState } from 'react';

/**
 * 공통 알림창 — 브라우저 기본 alert/confirm 대신 (호빗 사용자 화면의 Dialog와 같은 모양)
 *   if (await appConfirm('지울까요?', { danger: true })) { ... }
 *   appAlert('저장되었습니다.');
 *   const pick = await appChoice('저장할까요?', [{ label: '저장 안 함', value: 'discard' }, { label: '저장', value: 'save', primary: true }]);
 *     → 누른 버튼의 value, 바깥을 누르거나 Esc면 null
 * 화면에는 <DialogHost />가 한 번만 있으면 됨 (App.tsx). 여러 개가 동시에 오면 차례로 보여줌.
 */
type Choice = { label: string; value: string; primary?: boolean };
type DialogRequest = {
  kind: 'alert' | 'confirm' | 'choice';
  message: string;
  danger?: boolean;
  choices?: Choice[];
  cancelLabel?: string;
  resolve: (ok: boolean, value?: string) => void;
};

let enqueue: ((request: DialogRequest) => void) | null = null;

export const appConfirm = (message: string, options?: { danger?: boolean }) =>
  new Promise<boolean>((resolve) => {
    if (enqueue) enqueue({ kind: 'confirm', message, danger: options?.danger, resolve });
    else resolve(window.confirm(message)); // DialogHost가 아직 없을 때만
  });

export const appAlert = (message: string) =>
  new Promise<void>((resolve) => {
    if (enqueue) enqueue({ kind: 'alert', message, resolve: () => resolve() });
    else {
      window.alert(message);
      resolve();
    }
  });

/** 버튼 여러 개 중 하나 (예: 저장 / 저장 안 함) — 바깥·Esc·취소 버튼은 null */
export const appChoice = (message: string, choices: Choice[], cancelLabel = '계속 편집') =>
  new Promise<string | null>((resolve) => {
    if (enqueue) enqueue({ kind: 'choice', message, choices, cancelLabel, resolve: (_ok, value) => resolve(value ?? null) });
    else resolve(window.confirm(message) ? choices.find((c) => c.primary)?.value ?? null : null);
  });

export const DialogHost: React.FC = () => {
  const [queue, setQueue] = useState<DialogRequest[]>([]);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const current = queue[0];

  useEffect(() => {
    enqueue = (request) => setQueue((q) => [...q, request]);
    return () => {
      enqueue = null;
    };
  }, []);

  useEffect(() => {
    confirmRef.current?.focus(); // Enter = 확인, Esc = 취소
  }, [current]);

  if (!current) return null;

  const close = (ok: boolean, value?: string) => {
    current.resolve(ok, value);
    setQueue((q) => q.slice(1));
  };

  return (
    <div
      role="presentation"
      onClick={() => close(false)}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={current.message}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.key === 'Escape' && close(false)}
        className="animate-appear w-full max-w-[420px] rounded-[20px] bg-surface px-[26px] pt-[26px] pb-[20px] shadow-xl"
      >
        <p className="whitespace-pre-line break-keep font-medium text-[17px] leading-relaxed text-ink">{current.message}</p>
        {current.kind === 'choice' ? (
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => close(false)}
              className="rounded-full px-4 py-2.5 text-[15px] font-medium text-ink-2 hover:bg-card outline-none focus-visible:ring-2 focus-visible:ring-line"
            >
              {current.cancelLabel ?? '취소'}
            </button>
            {current.choices?.map((c) => (
              <button
                key={c.value}
                ref={c.primary ? confirmRef : undefined}
                type="button"
                onClick={() => close(true, c.value)}
                className={`rounded-full px-5 py-2.5 text-[15px] font-medium outline-none focus-visible:ring-2 ${
                  c.primary ? 'bg-accent text-white hover:bg-accent/85 focus-visible:ring-accent/30' : 'bg-card text-ink hover:bg-card-2 focus-visible:ring-line'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        ) : (
        <div className="mt-5 flex justify-end gap-2">
          {current.kind === 'confirm' && (
            <button
              type="button"
              onClick={() => close(false)}
              className="rounded-full bg-card px-5 py-2.5 text-[15px] font-medium text-ink-2 hover:bg-card-2 outline-none focus-visible:ring-2 focus-visible:ring-line"
            >
              취소
            </button>
          )}
          <button
            ref={confirmRef}
            type="button"
            onClick={() => close(true)}
            className={`rounded-full px-5 py-2.5 text-[15px] font-medium text-white outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              current.danger ? 'bg-danger hover:bg-danger/85 focus-visible:ring-danger/30' : 'bg-accent hover:bg-accent/85 focus-visible:ring-accent/30'
            }`}
          >
            {current.kind === 'confirm' && current.danger ? '삭제' : '확인'}
          </button>
        </div>
        )}
      </div>
    </div>
  );
};
