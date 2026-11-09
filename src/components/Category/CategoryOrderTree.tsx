import React, { useState } from 'react';
import { appAlert } from '../ui/Dialog';

/**
 * 카테고리 순서 — 프로필 항목과 같은 방식: 줄 왼쪽 ▲▼로 한 칸씩 옮기면 바로 저장.
 * 이름 칸을 누르면 아래로 하위 분류가 펼쳐지고, 하위도 같은 방식으로 옮김 (선배 FAQ는 세부 항목까지 3단계)
 * (예전엔 끌어서 놓은 뒤 '순서 변경'을 눌러야 저장됐고, 휴대폰에서는 끌기가 잘 안 됐음)
 */
export type OrderNode = { name: string; children?: OrderNode[] };

const clone = (nodes: OrderNode[]): OrderNode[] => JSON.parse(JSON.stringify(nodes));

/** path = 위에서부터 몇 번째인지 (예: [2, 0] = 3번째 대분류의 첫 소분류) */
function siblingsAt(nodes: OrderNode[], parentPath: number[]): OrderNode[] {
  let list = nodes;
  for (const i of parentPath) list = list[i].children ?? [];
  return list;
}

const Rows: React.FC<{
  list: OrderNode[];
  parentPath: number[];
  parentKey: string;
  depth: number;
  busy: boolean;
  open: Set<string>;
  onToggle: (key: string) => void;
  onMove: (parentPath: number[], index: number, dir: -1 | 1) => void;
  childLabel: (depth: number) => string;
}> = ({ list, parentPath, parentKey, depth, busy, open, onToggle, onMove, childLabel }) => (
  <ul className={depth === 0 ? 'divide-y divide-line' : 'divide-y divide-line border-t border-line bg-card/40'}>
    {list.map((node, i) => {
      const path = [...parentPath, i];
      const key = `${parentKey}/${node.name}`; // 이름으로 — 옮겨도 펼친 칸이 그대로 펼쳐져 있게
      const kids = node.children ?? [];
      const expanded = open.has(key);
      return (
        <li key={`${node.name}-${i}`}>
          <div className="flex items-center gap-2 py-2 pr-3 sm:pr-4" style={{ paddingLeft: `${12 + depth * 20}px` }}>
            <div className="flex shrink-0 flex-col">
              <button
                type="button"
                aria-label={`${node.name} 위로`}
                disabled={busy || i === 0}
                onClick={() => onMove(parentPath, i, -1)}
                className="px-2 py-1 text-xs text-ink-3 hover:text-ink disabled:opacity-30 sm:px-1 sm:py-0"
              >
                ▲
              </button>
              <button
                type="button"
                aria-label={`${node.name} 아래로`}
                disabled={busy || i === list.length - 1}
                onClick={() => onMove(parentPath, i, 1)}
                className="px-2 py-1 text-xs text-ink-3 hover:text-ink disabled:opacity-30 sm:px-1 sm:py-0"
              >
                ▼
              </button>
            </div>
            <span className="w-6 shrink-0 text-right text-sm tabular-nums text-ink-3">{i + 1}</span>
            {kids.length ? (
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => onToggle(key)}
                className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-card"
              >
                <span className={`min-w-0 flex-1 truncate ${depth === 0 ? 'font-bold text-ink' : 'font-medium text-ink'}`}>{node.name}</span>
                <span className="shrink-0 text-xs text-ink-3">
                  {childLabel(depth)} {kids.length}
                </span>
                <span className={`shrink-0 text-ink-3 transition-transform ${expanded ? 'rotate-90' : ''}`} aria-hidden="true">
                  ›
                </span>
              </button>
            ) : (
              <span className={`min-w-0 flex-1 truncate px-2 py-1.5 ${depth === 0 ? 'font-bold text-ink' : 'font-medium text-ink'}`}>{node.name}</span>
            )}
          </div>
          {expanded && kids.length > 0 && (
            <div className="animate-appear">
              <Rows
                list={kids}
                parentPath={path}
                parentKey={key}
                depth={depth + 1}
                busy={busy}
                open={open}
                onToggle={onToggle}
                onMove={onMove}
                childLabel={childLabel}
              />
            </div>
          )}
        </li>
      );
    })}
  </ul>
);

const CategoryOrderTree: React.FC<{
  nodes: OrderNode[];
  loading?: boolean;
  /** 바뀐 전체 순서를 저장 — 성공하면 true */
  onSave: (nodes: OrderNode[]) => Promise<boolean>;
  childLabel?: (depth: number) => string;
}> = ({ nodes: initial, loading, onSave, childLabel = (d) => (d === 0 ? '하위' : '세부') }) => {
  const [nodes, setNodes] = useState<OrderNode[]>(initial);
  const [synced, setSynced] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState<Set<string>>(new Set());

  // 서버에서 새로 받으면 그걸로 (저장 중이 아닐 때만)
  if (initial !== synced && !busy) {
    setSynced(initial);
    setNodes(initial);
  }

  const toggle = (key: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const move = async (parentPath: number[], index: number, dir: -1 | 1) => {
    const before = nodes;
    const next = clone(nodes);
    const list = siblingsAt(next, parentPath);
    [list[index], list[index + dir]] = [list[index + dir], list[index]];
    setNodes(next);
    setBusy(true);
    const ok = await onSave(next);
    setBusy(false);
    if (!ok) {
      setNodes(before);
      appAlert('순서를 저장하지 못했어요. 다시 시도해주세요.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-11 animate-pulse rounded-xl bg-card" />
        ))}
      </div>
    );
  }
  if (!nodes.length) return <p className="py-8 text-center text-sm text-ink-3">아직 카테고리가 없어요</p>;

  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <Rows list={nodes} parentPath={[]} parentKey="" depth={0} busy={busy} open={open} onToggle={toggle} onMove={move} childLabel={childLabel} />
    </div>
  );
};

export default CategoryOrderTree;
