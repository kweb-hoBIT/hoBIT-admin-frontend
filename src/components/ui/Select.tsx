import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * 앱 디자인에 맞춘 선택 상자 — 브라우저 기본 <select> 대신 (macOS 회색 메뉴 등 기기마다 모양이 달랐음)
 * <select>와 같은 방식으로 씀: value, onChange(e => e.target.value), 안에 <option value>이름</option>
 * 메뉴는 화면 맨 위(portal)에 그려서 카드·모달 안에서도 잘리지 않음. 키보드: ↑↓ Enter Esc
 */
type Opt = { value: string; label: React.ReactNode; text: string; disabled?: boolean };

interface SelectProps {
  value?: string | number | readonly string[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
  children?: React.ReactNode;
  'aria-label'?: string;
}

const textOf = (node: React.ReactNode): string =>
  React.Children.toArray(node)
    .map((c) => (typeof c === 'string' || typeof c === 'number' ? String(c) : React.isValidElement(c) ? textOf((c.props as any).children) : ''))
    .join('');

/** <option>들을 꺼냄 (map으로 만든 배열·Fragment 안에 있어도) */
function collectOptions(children: React.ReactNode, out: Opt[] = []): Opt[] {
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    const props = child.props as any;
    if (child.type === 'option') {
      out.push({
        value: props.value === undefined ? textOf(props.children) : String(props.value),
        label: props.children,
        text: textOf(props.children),
        disabled: props.disabled,
      });
    } else if (props?.children) {
      collectOptions(props.children, out);
    }
  });
  return out;
}

const Select: React.FC<SelectProps> = ({ value, onChange, className = '', disabled, name, id, children, ...rest }) => {
  const options = useMemo(() => collectOptions(children), [children]);
  const current = String(value ?? '');
  const selected = options.find((o) => o.value === current);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState<{ left: number; top: number; width: number; maxHeight: number; up: boolean } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const place = useCallback(() => {
    const r = buttonRef.current?.getBoundingClientRect();
    if (!r) return;
    const below = window.innerHeight - r.bottom - 12;
    const above = r.top - 12;
    const up = below < 220 && above > below;
    setPos({
      left: r.left,
      top: up ? r.top - 6 : r.bottom + 6,
      width: r.width,
      maxHeight: Math.min(320, up ? above : below),
      up,
    });
  }, []);

  const openMenu = () => {
    if (disabled) return;
    place();
    setActive(Math.max(0, options.findIndex((o) => o.value === current)));
    setOpen(true);
  };

  const choose = (opt: Opt) => {
    if (opt.disabled) return;
    setOpen(false);
    buttonRef.current?.focus();
    if (opt.value === current) return;
    const target = { value: opt.value, name: name ?? '' };
    onChange?.({ target, currentTarget: target } as unknown as React.ChangeEvent<HTMLSelectElement>);
  };

  // 바깥을 누르거나 스크롤·창 크기가 바뀌면 닫음
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!menuRef.current?.contains(t) && !buttonRef.current?.contains(t)) setOpen(false);
    };
    const onScroll = (e: Event) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', place);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', place);
    };
  }, [open, place]);

  // 고른 항목이 보이게
  useLayoutEffect(() => {
    if (open) menuRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  const move = (dir: 1 | -1) => {
    if (!options.length) return;
    let i = active;
    for (let n = 0; n < options.length; n++) {
      i = (i + dir + options.length) % options.length;
      if (!options[i].disabled) break;
    }
    setActive(i);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      move(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      move(-1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (options[active]) choose(options[active]);
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      setOpen(false);
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        id={id}
        name={name}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={rest['aria-label']}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        className={`select-box ${className}`}
      >
        <span className={`min-w-0 flex-1 truncate text-left ${selected ? '' : 'text-ink-3'}`}>
          {selected ? selected.label : options[0]?.label ?? '선택'}
        </span>
        <svg viewBox="0 0 20 20" className={`h-4 w-4 shrink-0 text-ink-3 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true">
          <path d="M5.5 7.5 10 12l4.5-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open &&
        pos &&
        createPortal(
          <ul
            ref={menuRef}
            role="listbox"
            className="select-menu"
            style={{
              left: pos.left,
              top: pos.up ? undefined : pos.top,
              bottom: pos.up ? window.innerHeight - pos.top : undefined,
              minWidth: pos.width,
              maxHeight: pos.maxHeight,
            }}
          >
            {options.map((opt, i) => {
              const isSelected = opt.value === current;
              return (
                <li
                  key={`${opt.value}-${i}`}
                  data-index={i}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={opt.disabled}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => choose(opt)}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-[0.95rem] ${
                    opt.disabled ? 'cursor-not-allowed text-ink-3' : i === active ? 'bg-card text-ink' : 'text-ink'
                  } ${isSelected ? 'font-semibold text-accent-ink' : ''}`}
                >
                  <span className="w-4 shrink-0 text-accent-ink">{isSelected ? '✓' : ''}</span>
                  <span className="whitespace-nowrap">{opt.label}</span>
                </li>
              );
            })}
          </ul>,
          document.body
        )}
    </>
  );
};

export default Select;
