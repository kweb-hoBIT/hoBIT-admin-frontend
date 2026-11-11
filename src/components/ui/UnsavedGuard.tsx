import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { appChoice } from './Dialog';

/**
 * 저장하지 않은 변경이 있을 때 다른 화면으로 가려 하면 묻기 — "저장하지 않은 사항이 있어요. 저장하시겠어요?"
 *
 * 화면에서: useUnsavedChanges(dirty, save)  — save는 저장에 성공하면 true
 * 앱에 한 번: <UnsavedGuardHost /> (Router 안)
 *
 * BrowserRouter라 react-router의 useBlocker(데이터 라우터 전용)를 못 써서, 사이트 안 링크(<a href="/...">, 상단·하위 탭) 클릭을
 * 먼저 가로채 물은 뒤 직접 이동함. 창 닫기·새로고침은 브라우저 기본 경고(beforeunload — 문구는 브라우저가 정함).
 * 브라우저 뒤로 가기는 막지 못함.
 */
// describe: 바뀐 항목 (예: '답변 자유도: 0.3 → 0.5') — 알림창에 같이 보여 줌
type Guard = { dirty: boolean | (() => boolean); save: () => Promise<boolean>; describe?: () => string[] };
const isDirty = (g: Guard) => (typeof g.dirty === 'function' ? g.dirty() : g.dirty);
const guards = new Map<number, Guard>();
let seq = 0;

const anyDirty = () => Array.from(guards.values()).some(isDirty);

/** 이동해도 되면 true — 바뀐 내용이 있으면 저장/저장 안 함/계속 편집을 물음 */
export async function confirmLeave(): Promise<boolean> {
  const dirty = Array.from(guards.values()).filter(isDirty);
  if (!dirty.length) return true;
  const items = dirty.flatMap((g) => g.describe?.() ?? []);
  const list = items.length > 6 ? [...items.slice(0, 6), `외 ${items.length - 6}개`] : items;
  const message = `저장하지 않은 사항이 있어요. 저장하시겠어요?${list.length ? `\n\n${list.map((t) => `· ${t}`).join('\n')}` : ''}`;
  const pick = await appChoice(message, [
    { label: '저장 안 함', value: 'discard' },
    { label: '저장', value: 'save', primary: true },
  ]);
  if (pick === 'discard') return true;
  if (pick !== 'save') return false; // 계속 편집
  for (const g of dirty) if (!(await g.save())) return false; // 저장 실패·취소면 머묾
  return true;
}

/** dirty는 값 또는 함수 (자식 화면의 상태를 물을 때는 함수로 — 부모가 다시 그려지지 않아도 지금 값) */
export function useUnsavedChanges(dirty: boolean | (() => boolean), save: () => Promise<boolean>, describe?: () => string[]) {
  const id = useRef(0);
  if (!id.current) id.current = ++seq;
  // 최신 값으로 (렌더마다)
  guards.set(id.current, { dirty, save, describe });
  useEffect(() => {
    const key = id.current;
    return () => {
      guards.delete(key);
    };
  }, []);
}

export const UnsavedGuardHost: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const onClick = async (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || !anyDirty()) return;
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      const to = url.pathname + url.search + url.hash;
      if (to === window.location.pathname + window.location.search + window.location.hash) return;
      e.preventDefault();
      e.stopPropagation();
      if (await confirmLeave()) navigate(to);
    };
    const onUnload = (e: BeforeUnloadEvent) => {
      if (!anyDirty()) return;
      e.preventDefault();
      e.returnValue = '';
    };
    document.addEventListener('click', onClick, true); // 링크의 이동보다 먼저
    window.addEventListener('beforeunload', onUnload);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('beforeunload', onUnload);
    };
  }, [navigate]);
  return null;
};
