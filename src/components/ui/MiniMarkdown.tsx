import React from 'react';

/**
 * AI 답변(마크다운)을 관리자 화면에서 읽기 좋게 — '###'·'**'가 그대로 보이지 않게
 * 제목·글머리표·번호 목록·굵게·링크만 처리 (라이브러리 없이), 출처 표시 [S1]은 지움
 */
const inline = (text: string, key: string): React.ReactNode[] => {
  const out: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|(https?:\/\/[^\s)]+)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${key}-${i++}`;
    if (m[1]) out.push(<strong key={k} className="font-semibold text-ink">{m[1]}</strong>);
    else {
      const href = m[3] ?? m[4];
      out.push(
        <a key={k} href={href} target="_blank" rel="noreferrer" className="text-link underline break-all">
          {m[2] ?? href}
        </a>
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
};

const MiniMarkdown: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const lines = text.replace(/\s*\[S\d+\]/g, '').split('\n');
  const blocks: React.ReactNode[] = [];
  let list: { ordered: boolean; items: { indent: boolean; body: string; n?: string }[] } | null = null;

  const flush = () => {
    if (!list) return;
    const k = `l${blocks.length}`;
    blocks.push(
      <ul key={k} className="flex flex-col gap-0.5">
        {list.items.map((it, j) => (
          <li key={j} className={`flex gap-1.5 ${it.indent ? 'pl-5' : ''}`}>
            <span className="shrink-0 text-ink-3">{it.n ? `${it.n}.` : '•'}</span>
            <span className="min-w-0">{inline(it.body, `${k}-${j}`)}</span>
          </li>
        ))}
      </ul>
    );
    list = null;
  };

  lines.forEach((raw, idx) => {
    const line = raw.replace(/\s+$/, '');
    const k = `b${idx}`;
    if (!line.trim()) return flush();
    const h = line.match(/^\s*#{1,6}\s+(.*)$/);
    if (h) {
      flush();
      blocks.push(<p key={k} className="font-semibold text-ink">{inline(h[1].replace(/\*\*/g, ''), k)}</p>);
      return;
    }
    const b = line.match(/^(\s*)[-*•]\s+(.*)$/);
    const n = line.match(/^(\s*)(\d+)[.)]\s+(.*)$/);
    if (b || n) {
      const indent = ((b ?? n)![1] ?? '').length >= 2;
      if (!list) list = { ordered: !!n, items: [] };
      list.items.push(n ? { indent, body: n[3], n: n[2] } : { indent, body: b![2] });
      return;
    }
    flush();
    blocks.push(<p key={k}>{inline(line.trim(), k)}</p>);
  });
  flush();
  return <div className={`flex flex-col gap-2 leading-relaxed ${className}`}>{blocks}</div>;
};

export default MiniMarkdown;
