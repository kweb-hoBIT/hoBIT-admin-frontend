import React, { useEffect, useRef, useState } from 'react';
import { AccountRole, agentsApi, chatApi, HoursSettings, ROLE_LABEL } from '../../api/chat';
import { appAlert, appChoice } from '../ui/Dialog';
import { useChat } from './ChatProvider';
import Segmented from '../ui/Segmented';
import Select from '../ui/Select';
import TimeInput from '../ui/TimeInput';

/**
 * 채팅 설정 (행정실만) — 운영 시간·휴무일, 담당자 역할(행정실 / 근로장학생)
 */
const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

const TimeRange: React.FC<{ label: string; value: { start: string; end: string }; onChange: (v: { start: string; end: string }) => void }> = ({
  label,
  value,
  onChange,
}) => (
  <label className="flex items-center justify-between gap-3">
    <span className="text-sm font-semibold text-ink">{label}</span>
    <span className="flex items-center gap-2">
      <TimeInput value={value.start} onChange={(v) => onChange({ ...value, start: v })} aria-label={`${label} 시작`} />
      <span className="text-ink-3">–</span>
      <TimeInput value={value.end} onChange={(v) => onChange({ ...value, end: v })} aria-label={`${label} 끝`} />
    </span>
  </label>
);

const WEEK = ['일', '월', '화', '수', '목', '금', '토'];

/** 공휴일 불러오기 — 연도 고르고 불러와서, 고른 날만 휴무일에 추가 (저장은 아래 "저장"으로) */
const HolidayImport: React.FC<{ current: string[]; onAdd: (dates: string[]) => void }> = ({ current, onAdd }) => {
  const thisYear = new Date().getFullYear();
  const [year, setYear] = useState(thisYear + (new Date().getMonth() >= 9 ? 1 : 0)); // 10월부터는 다음 해 먼저
  const [list, setList] = useState<{ date: string; name: string }[] | null>(null);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const have = new Set(current);

  const load = async () => {
    setLoading(true);
    try {
      const r = await chatApi.getHolidays(year);
      if (!r.holidays.length) {
        appAlert(`${year}년 공휴일이 아직 캘린더에 없어요.`);
        return;
      }
      setList(r.holidays);
      setPicked(new Set(r.holidays.map((h) => h.date).filter((d) => !have.has(d))));
    } catch (e) {
      appAlert((e as Error).message || '공휴일을 불러오지 못했어요.');
    } finally {
      setLoading(false);
    }
  };
  const toggle = (d: string) =>
    setPicked((p) => {
      const n = new Set(p);
      if (n.has(d)) n.delete(d);
      else n.add(d);
      return n;
    });

  return (
    <div className="mb-2 rounded-xl border border-line bg-card/50 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-ink-2">공휴일 불러오기</span>
        <Select value={year} onChange={(e) => (setYear(Number(e.target.value)), setList(null))} className="bg-surface px-3 py-1.5 text-sm">
          {[thisYear - 1, thisYear, thisYear + 1, thisYear + 2].map((y) => (
            <option key={y} value={y}>
              {y}년
            </option>
          ))}
        </Select>
        <button type="button" onClick={load} disabled={loading} className="bg-surface px-4 py-1.5 text-sm font-semibold text-ink shadow-sm hover:bg-card-2 disabled:opacity-60">
          {loading ? '불러오는 중…' : '불러오기'}
        </button>
        <span className="text-xs text-ink-3">Google 대한민국 휴일 캘린더 · 기념일 제외</span>
      </div>
      {list && (
        <div className="mt-3">
          <ul className="grid max-h-56 grid-cols-2 gap-x-4 gap-y-1 overflow-y-auto text-sm">
            {list.map((h) => {
              const already = have.has(h.date);
              const day = WEEK[new Date(`${h.date}T00:00:00`).getDay()];
              return (
                <li key={h.date}>
                  <label className={`flex items-center gap-2 rounded-lg px-1.5 py-1 ${already ? 'text-ink-3' : 'cursor-pointer text-ink hover:bg-surface'}`}>
                    <input type="checkbox" checked={already || picked.has(h.date)} disabled={already} onChange={() => toggle(h.date)} />
                    <span className="font-mono">{h.date.slice(5)}</span>
                    <span className="text-ink-3">({day})</span>
                    <span className="truncate">{h.name}</span>
                    {already && <span className="ml-auto shrink-0 text-xs">이미 있음</span>}
                  </label>
                </li>
              );
            })}
          </ul>
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setList(null)} className="px-3 py-1.5 text-sm text-ink-2 hover:bg-surface">
              닫기
            </button>
            <button
              type="button"
              disabled={!picked.size}
              onClick={() => {
                onAdd([...picked]);
                setList(null);
              }}
              className="bg-accent px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {picked.size}일 추가
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/** 닫기·탭 바꾸기 전에 물어보기 위한 연결 — 바뀐 게 있는지, 저장(성공 여부) */
export type UnsavedGuard = { dirty: () => boolean; save: () => Promise<boolean> };

const parseDates = (text: string) =>
  text
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
const sameHours = (a: HoursSettings, b: HoursSettings, text: string) =>
  JSON.stringify({ ...a, holidays: [] }) === JSON.stringify({ ...b, holidays: [] }) &&
  JSON.stringify([...new Set(parseDates(text))].sort()) === JSON.stringify([...b.holidays].sort());

const HoursTab: React.FC<{ guardRef: React.MutableRefObject<UnsavedGuard | null> }> = ({ guardRef }) => {
  const [hours, setHours] = useState<HoursSettings | null>(null);
  const [saved, setSaved] = useState<HoursSettings | null>(null); // 마지막으로 저장된 값 (바뀐 게 있는지 비교)
  const [holidaysText, setHolidaysText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    chatApi.getHours().then((r) => {
      setHours(r.hours);
      setSaved(r.hours);
      setHolidaysText(r.hours.holidays.join('\n'));
    });
  }, []);

  const save = async (): Promise<boolean> => {
    if (!hours) return false;
    setSaving(true);
    try {
      const holidays = parseDates(holidaysText);
      const bad = holidays.filter((d) => !/^\d{4}-\d{2}-\d{2}$/.test(d));
      if (bad.length) {
        await appAlert(`날짜 형식이 맞지 않아요: ${bad.join(', ')}\n예) 2026-10-09`);
        return false;
      }
      const r = await chatApi.setHours({ ...hours, holidays });
      setHours(r.hours);
      setSaved(r.hours);
      setHolidaysText(r.hours.holidays.join('\n'));
      appAlert('저장했어요. 학생 화면에 바로 반영돼요.');
      return true;
    } catch {
      await appAlert('저장하지 못했어요. 시작 시각이 끝 시각보다 빠른지 확인해 주세요.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // 바깥에서(닫기·탭 바꾸기) 쓸 수 있게 — 매번 최신 값으로
  guardRef.current = { dirty: () => !!hours && !!saved && !sameHours(hours, saved, holidaysText), save };
  useEffect(() => () => void (guardRef.current = null), [guardRef]);

  if (!hours) return <div className="h-40 animate-pulse rounded-xl bg-card" />;

  return (
    <div className="flex flex-col gap-4">
      <TimeRange label="학기 중" value={hours.semester} onChange={(v) => setHours({ ...hours, semester: v })} />
      <TimeRange label="방학 중" value={hours.vacation} onChange={(v) => setHours({ ...hours, vacation: v })} />
      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-ink">
          <input
            type="checkbox"
            checked={!!hours.lunch}
            onChange={(e) => setHours({ ...hours, lunch: e.target.checked ? { start: '12:00', end: '13:00' } : null })}
          />
          점심시간 제외
        </label>
        {hours.lunch && (
          <span className="flex items-center gap-2">
            <TimeInput value={hours.lunch.start} onChange={(v) => setHours({ ...hours, lunch: { ...hours.lunch!, start: v } })} aria-label="점심 시작" />
            <span className="text-ink-3">–</span>
            <TimeInput value={hours.lunch.end} onChange={(v) => setHours({ ...hours, lunch: { ...hours.lunch!, end: v } })} aria-label="점심 끝" />
          </span>
        )}
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold text-ink">운영 요일</p>
        <div className="flex gap-1.5">
          {DAYS.map((d, i) => {
            const on = hours.weekdays.includes(i);
            return (
              <button
                key={d}
                type="button"
                onClick={() => setHours({ ...hours, weekdays: on ? hours.weekdays.filter((x) => x !== i) : [...hours.weekdays, i].sort() })}
                className={`h-9 w-9 text-sm font-semibold ${on ? 'bg-accent text-white' : 'bg-card text-ink-2'}`}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <p className="mb-1 text-sm font-semibold text-ink">학기 기간 (매년)</p>
        <p className="mb-2 text-xs text-ink-3">이 기간은 학기 중 시간, 나머지는 방학 중 시간으로 운영해요.</p>
        {hours.semesters.map((s, i) => (
          <div key={i} className="mb-1.5 flex items-center gap-2 text-sm">
            <span className="w-14 text-ink-2">{i + 1}학기</span>
            {(['start', 'end'] as const).map((k) => (
              <input
                key={k}
                value={s[k]}
                onChange={(e) => {
                  const next = hours.semesters.map((x, j) => (j === i ? { ...x, [k]: e.target.value } : x));
                  setHours({ ...hours, semesters: next });
                }}
                placeholder="MM-DD"
                className="w-24 rounded-xl border border-line px-2 py-1.5 text-center"
              />
            ))}
          </div>
        ))}
      </div>
      <div>
        <div className="mb-1 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-ink">휴무일</p>
        </div>
        <p className="mb-2 text-xs text-ink-3">공휴일·학교 휴무일 (한 줄에 하나, 예: 2026-10-09) — 학교 자체 휴무일(개교기념일 등)은 직접 추가</p>
        <HolidayImport current={parseDates(holidaysText)} onAdd={(dates) => setHolidaysText([...new Set([...parseDates(holidaysText), ...dates])].sort().join('\n'))} />
        <textarea value={holidaysText} onChange={(e) => setHolidaysText(e.target.value)} rows={6} className="w-full rounded-xl border border-line px-3 py-2 font-mono text-sm" />
      </div>
      <div className="flex justify-end">
        <button type="button" onClick={save} disabled={saving} className="bg-accent px-6 py-2.5 font-semibold text-white disabled:opacity-60">
          {saving ? '저장 중…' : '저장'}
        </button>
      </div>
    </div>
  );
};

/**
 * 계정 역할 — 개발자는 누구든·어떤 역할로든, 행정실은 행정실↔근로장학생만 (개발자 계정은 못 바꿈), 자기 역할은 못 바꿈
 */
const AgentsTab: React.FC = () => {
  const { uid, accountRole } = useChat();
  const iAmDeveloper = accountRole === 'developer';
  const [agents, setAgents] = useState<{ user_id: number; username: string; email: string; role: AccountRole }[] | null>(null);
  useEffect(() => {
    agentsApi.list().then(setAgents).catch(() => setAgents([]));
  }, []);
  const change = async (userId: number, role: AccountRole) => {
    try {
      await agentsApi.setRole(userId, role);
      setAgents((a) => a?.map((x) => (x.user_id === userId ? { ...x, role } : x)) ?? null);
    } catch (e) {
      appAlert((e as Error).message || '바꾸지 못했어요.');
    }
  };
  if (!agents) return <div className="h-40 animate-pulse rounded-xl bg-card" />;
  const options = (iAmDeveloper
    ? [['developer', '개발자'], ['staff', '행정실'], ['senior', '근로장학생']]
    : [['staff', '행정실'], ['senior', '근로장학생']]) as readonly (readonly [AccountRole, string])[];
  return (
    <div>
      <p className="mb-3 text-sm text-ink-2">
        <b className="text-ink">근로장학생</b>은 선배 FAQ와 선배 채팅만 쓸 수 있고, 상대에게 보이는 학생 메일·이름·학번이 가려져요.{' '}
        <b className="text-ink">개발자</b> 계정은 개발자만 바꿀 수 있어요.
      </p>
      <ul className="divide-y divide-line rounded-xl border border-line">
        {agents.map((a) => {
          const locked = a.user_id === uid || (!iAmDeveloper && a.role === 'developer');
          return (
            <li key={a.user_id} className="flex items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">{a.username}</p>
                <p className="truncate text-xs text-ink-3">{a.email}</p>
              </div>
              {locked ? (
                <span className="rounded-full bg-card px-3 py-1 text-xs font-semibold text-ink-2">
                  {a.user_id === uid ? `나 (${ROLE_LABEL[a.role]})` : ROLE_LABEL[a.role]}
                </span>
              ) : (
                <Segmented options={options} value={a.role} onChange={(r) => change(a.user_id, r)} />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const ChatSettings: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [tab, setTab] = useState<'hours' | 'agents'>('hours');
  const guardRef = useRef<UnsavedGuard | null>(null);
  const asking = useRef(false);

  /** 바뀐 게 있으면 먼저 물어봄 — 저장 / 저장 안 함 / 계속 편집(바깥·Esc) */
  const leave = async (then: () => void) => {
    if (asking.current) return;
    const g = guardRef.current;
    if (!g?.dirty()) return then();
    asking.current = true;
    try {
      const pick = await appChoice('바뀐 내용이 있어요. 저장할까요?', [
        { label: '저장 안 함', value: 'discard' },
        { label: '저장', value: 'save', primary: true },
      ]);
      if (pick === 'discard' || (pick === 'save' && (await g.save()))) then();
    } finally {
      asking.current = false;
    }
  };
  const requestClose = () => leave(onClose);

  const latestClose = useRef(requestClose);
  latestClose.current = requestClose;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // 확인창이 떠 있으면 Esc는 그 창만 닫음
      if (e.key === 'Escape' && !document.querySelector('[role="alertdialog"]')) latestClose.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && requestClose()}>
      <div className="modal-panel max-w-[600px] max-h-[90vh] overflow-y-auto" role="dialog" aria-modal="true">
        <div className="mb-4 flex items-center justify-between">
          <h2>채팅 설정</h2>
          <button type="button" onClick={requestClose} aria-label="닫기" className="h-9 w-9 text-ink-2 hover:bg-card">
            ✕
          </button>
        </div>
        <Segmented
          className="mb-5"
          stretch
          itemClassName="py-2"
          options={[['hours', '운영 시간'], ['agents', '담당자 역할']] as const}
          value={tab}
          onChange={(t) => t !== tab && leave(() => setTab(t))}
        />
        {tab === 'hours' ? <HoursTab guardRef={guardRef} /> : <AgentsTab />}
      </div>
    </div>
  );
};

export default ChatSettings;
