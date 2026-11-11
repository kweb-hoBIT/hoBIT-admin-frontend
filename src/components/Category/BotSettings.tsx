import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useUnsavedChanges } from '../ui/UnsavedGuard';
import { BotNumberKey, BotSettings as Settings, BotSettingsResponse, chatApi } from '../../api/chat';
import { useChat } from '../Chat/ChatProvider';
import { appAlert, appConfirm } from '../ui/Dialog';
import { Switch } from './ChatFeatures';
import Badge from '../ui/Badge';
import Segmented from '../ui/Segmented';

type Limits = BotSettingsResponse['limits'];

const same = (a: Settings | null, b: Settings | null) => JSON.stringify(a) === JSON.stringify(b);

// 저장하지 않고 나갈 때 알림창에 보여 줄 이름·단위 (ui/UnsavedGuard)
const LABELS: Record<keyof Settings, [string, string?]> = {
  temperature: ['답변 자유도'], maxTokens: ['최대 답변 길이', '토큰'], recCount: ['이어서 물어볼 질문 수', '개'],
  recBreadth: ['이어서 물어볼 질문 자유도'], gradEnabled: ['대학원 답변'], placeEnabled: ['주변 장소 검색'],
  placeRadiusM: ['검색 반경', 'm'], placeSize: ['장소 결과 수', '곳'], blockFarPlace: ['학교 밖 지역 질문 막기'],
  menuEnabled: ['학식 메뉴 답변'], webSearchEnabled: ['웹 검색'], webSearchWide: ['검색 범위'], webSearchDaily: ['하루 최대 검색 수', '번'],
  mascotEnabled: ['움직이는 캐릭터'], mascotIdleSec: ['졸기까지 시간', '초'], sessionPerMin: ['1분 질문 수 (브라우저)', '번'],
  sessionPerDay: ['하루 질문 수 (브라우저)', '번'], ipPerMin: ['1분 질문 수 (IP)', '번'], ipPerDay: ['하루 질문 수 (IP)', '번'],
  maxQuestionChars: ['최대 질문 길이', '자'], dailyCharBudget: ['하루 글자 수 합', '자'], repeatNoticeAt: ['같은 질문 반복 — 안내', '번'],
  repeatStrikeAt: ['같은 질문 반복 — 경고', '번'], meaninglessStrikeAt: ['뜻 없는 입력 — 경고', '번'], warnLimit: ['정지까지 경고 수', '번'],
  suspendMinutes: ['정지 시간', '분'], blockPersonalUse: ['개인 AI 용도 막기'],
};
const show = (k: keyof Settings, v: unknown) => {
  if (typeof v === 'boolean') return k === 'webSearchWide' ? (v ? '웹 전체' : '학교 사이트만') : v ? '켬' : '끔';
  if (Array.isArray(v)) return v.map((x) => fmt(Number(x))).join(' · ') + (LABELS[k][1] ?? '');
  return typeof v === 'number' ? fmt(v) + (LABELS[k][1] ?? '') : String(v);
};
/** 바뀐 칸 → ['답변 자유도: 0.3 → 0.5', …] */
const changes = (from: Settings, to: Settings) =>
  (Object.keys(LABELS) as (keyof Settings)[])
    .filter((k) => JSON.stringify(from[k]) !== JSON.stringify(to[k]))
    .map((k) => `${LABELS[k][0]}: ${show(k, from[k])} → ${show(k, to[k])}`);
const fmt = (n: number) => n.toLocaleString('ko-KR');

/** 한 줄 — 이름·설명 왼쪽, 입력 오른쪽 */
const Row: React.FC<{ title: string; help: string; children: React.ReactNode }> = ({ title, help, children }) => (
  <div className="flex flex-col gap-2 border-t border-line py-3 first:border-t-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
    <div className="min-w-0">
      <p className="font-semibold text-ink">{title}</p>
      {help && <p className="mt-0.5 text-sm text-ink-3">{help}</p>}
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

/** 버튼 한 번에 바뀌는 양 — 범위가 넓으면 크게 (300~3000m를 1씩 누를 수는 없으니) */
const stepOf = (limit: { min: number; max: number; step: number }) => {
  if (limit.step && limit.step !== 1) return limit.step;
  const range = limit.max - limit.min;
  return range >= 10000 ? 1000 : range >= 1000 ? 100 : range >= 100 ? 10 : 1;
};
const roundTo = (v: number, step: number) => Math.round(v / step) * step;

/**
 * 숫자 칸 — [−] 값 단위 [+]. 브라우저 기본 위아래 화살표(작고 안 보임) 대신 큰 버튼, 직접 입력도 됨.
 * 범위는 서버가 알려 준 값 (벗어나면 빨간 테두리, 저장할 때 끝값으로 맞춰짐)
 */
const Stepper: React.FC<{
  value: number;
  onChange: (v: number) => void;
  limit: { min: number; max: number; step: number };
  unit: string;
  disabled: boolean;
  label: string;
  width?: string;
}> = ({ value, onChange, limit, unit, disabled, label, width = 'w-[4.5rem]' }) => {
  const step = stepOf(limit);
  const ok = Number.isFinite(value);
  const out = ok && (value < limit.min || value > limit.max);
  const bump = (dir: -1 | 1) => {
    const base = ok ? value : limit.min;
    const next = Math.min(limit.max, Math.max(limit.min, Number((roundTo(base, step) + dir * step).toFixed(2))));
    onChange(next);
  };
  const btn =
    'flex h-9 w-9 shrink-0 items-center justify-center text-lg font-semibold text-ink-2 transition-colors hover:bg-card hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent';
  return (
    <span
      className={`inline-flex items-center overflow-hidden rounded-xl border bg-surface ${out ? 'border-danger' : 'border-line'} ${
        disabled ? 'opacity-60' : 'focus-within:border-accent-ink'
      }`}
    >
      <button type="button" aria-label={`${label} 줄이기`} disabled={disabled || (ok && value <= limit.min)} onClick={() => bump(-1)} className={btn}>
        −
      </button>
      <span className="flex items-baseline gap-1 border-x border-line px-2">
        <input
          type="number"
          inputMode="numeric"
          aria-label={label}
          value={ok ? value : ''}
          min={limit.min}
          max={limit.max}
          step={limit.step}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value === '' ? NaN : Number(e.target.value))}
          className={`no-spin ${width} bg-transparent py-1.5 text-right text-base font-semibold tabular-nums text-ink outline-none`}
        />
        {unit && <span className="text-sm text-ink-3">{unit}</span>}
      </span>
      <button type="button" aria-label={`${label} 늘리기`} disabled={disabled || (ok && value >= limit.max)} onClick={() => bump(1)} className={btn}>
        +
      </button>
    </span>
  );
};

/** 숫자 칸 + 기본값·범위 안내 */
const NumberInput: React.FC<{
  value: number;
  onChange: (v: number) => void;
  limit: { min: number; max: number; step: number };
  def: number;
  unit: string;
  disabled: boolean;
  label: string;
}> = ({ value, onChange, limit, def, unit, disabled, label }) => (
  <span className="flex flex-col items-start gap-1 sm:items-end">
    <Stepper value={value} onChange={onChange} limit={limit} unit={unit} disabled={disabled} label={label} />
    <span className="text-xs text-ink-3">
      기본 {fmt(def)}
      {unit} · {fmt(limit.min)}~{fmt(limit.max)}
      {value !== def && Number.isFinite(value) && !disabled && (
        <button type="button" onClick={() => onChange(def)} className="ml-1.5 text-accent-ink hover:underline">
          기본값
        </button>
      )}
    </span>
  </span>
);

const Group: React.FC<{ title: string; desc: string; children: React.ReactNode }> = ({ title, desc, children }) => (
  <div className="rounded-2xl border border-line p-4 sm:p-5">
    <h5 className="font-semibold text-ink">{title}</h5>
    {desc && <p className="mt-0.5 text-sm text-ink-3">{desc}</p>}
    <div className="mt-2">{children}</div>
  </div>
);

/**
 * 관리 > 챗봇 설정 — 답변 자유도·길이, 주변 장소 검색, 학식, 과다 사용 기준
 * 저장하면 채팅 서버에 바로 반영 (다른 서버에서도 15초 안에). 바꾸기는 행정실·개발자 계정만 (채팅 서버도 같은 기준)
 */
const BotSettings: React.FC = () => {
  const { role } = useChat();
  const canEdit = role === 'staff';
  const [data, setData] = useState<BotSettingsResponse | null>(null);
  const [draft, setDraft] = useState<Settings | null>(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await chatApi.getBotSettings();
      setData(r);
      setDraft(r.settings);
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  // 저장하지 않고 다른 화면으로 가면 묻기 (ui/UnsavedGuard) — save는 아래에서 정해짐
  const saveRef = useRef<() => Promise<boolean>>(async () => true);
  useUnsavedChanges(!!data && !!draft && !same(draft, data.settings), () => saveRef.current(), () =>
    data && draft ? changes(data.settings, draft) : []
  );

  if (failed) return <p className="panel px-4 py-3 text-sm text-danger">채팅 서버에서 챗봇 설정을 불러오지 못했어요. 잠시 후 새로고침해 주세요.</p>;
  if (!data || !draft) return <div className="panel h-60 animate-pulse" />;

  const limits: Limits = data.limits;
  const defs = data.defaults;
  const dirty = !same(draft, data.settings);
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setDraft({ ...draft, [k]: v });
  const num = (k: BotNumberKey, unit: string, label: string) => (
    <NumberInput value={draft[k]} onChange={(v) => set(k, v)} limit={limits[k]} def={defs[k]} unit={unit} disabled={!canEdit || busy} label={label} />
  );
  const sw = (k: 'placeEnabled' | 'blockFarPlace' | 'menuEnabled' | 'webSearchEnabled' | 'gradEnabled' | 'mascotEnabled' | 'blockPersonalUse', label: string) => (
    <Switch on={draft[k]} disabled={!canEdit || busy} onChange={(v) => set(k, v)} label={label} />
  );

  // skipConfirm: 다른 화면으로 갈 때 '저장'을 고른 경우 (이미 물었으니 한 번 더 묻지 않음). 저장했으면 true
  const save = async (skipConfirm = false): Promise<boolean> => {
    const bad = (Object.keys(limits) as (BotNumberKey | 'suspendMinutes')[]).filter((k) =>
      k === 'suspendMinutes' ? draft.suspendMinutes.some((v) => !Number.isFinite(v)) : !Number.isFinite(draft[k])
    );
    if (bad.length) {
      await appAlert('비어 있는 칸이 있어요. 숫자를 넣어 주세요.');
      return false;
    }
    if (!skipConfirm && !(await appConfirm('챗봇 설정을 저장할까요? 학생이 보내는 다음 질문부터 바로 적용돼요.', { confirmLabel: '저장' }))) return false;
    setBusy(true);
    try {
      const r = await chatApi.setBotSettings(draft);
      const adjusted = !same(r.settings, draft);
      setData(r);
      setDraft(r.settings);
      if (!skipConfirm || adjusted) appAlert(adjusted ? '저장했어요. 범위를 벗어난 값은 가장 가까운 허용 값으로 맞췄어요.' : '저장했어요. 다음 질문부터 바로 적용돼요.');
      return true;
    } catch {
      appAlert('저장하지 못했어요. 잠시 후 다시 시도해 주세요.');
      return false;
    } finally {
      setBusy(false);
    }
  };
  saveRef.current = () => save(true);
  const reset = async () => {
    if (!(await appConfirm('모든 칸을 기본값으로 바꿀까요? [저장]을 눌러야 실제로 적용돼요.', { confirmLabel: '기본값으로' }))) return;
    setDraft(defs);
  };

  const t = draft.temperature;
  return (
    <section className="panel p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-xl font-bold text-ink">챗봇 설정</h4>
          <p className="mt-1 text-sm text-ink-3">
            {canEdit ? '저장하면 다음 질문부터 바로 적용돼요.' : '바꾸기는 행정실·개발자 계정만 할 수 있어요.'}
          </p>
          {data.updatedAt && (
            <p className="mt-1 text-xs text-ink-3">
              마지막 변경: {new Date(data.updatedAt).toLocaleString('ko-KR')}
              {data.updatedBy ? ` · ${data.updatedBy}` : ''}
            </p>
          )}
        </div>
        {canEdit && (
          <div className="flex shrink-0 gap-2">
            <button type="button" onClick={reset} disabled={busy || same(draft, defs)} className="rounded-xl bg-card px-4 py-2 text-sm font-semibold text-ink-2 hover:bg-card-2 disabled:opacity-50">
              기본값으로
            </button>
            {dirty && (
              <button type="button" onClick={() => setDraft(data.settings)} disabled={busy} className="rounded-xl bg-card px-4 py-2 text-sm font-semibold text-ink-2 hover:bg-card-2 disabled:opacity-50">
                되돌리기
              </button>
            )}
            <button type="button" onClick={() => save()} disabled={busy || !dirty} className="rounded-xl bg-accent px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">
              {busy ? '저장 중…' : '저장'}
            </button>
          </div>
        )}
      </div>

      <div className="mt-5 grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Group title="답변 대상" desc="">
            <Row title="학부" help="">
              <Badge tone="green">항상 켜짐</Badge>
            </Row>
            <Row
              title="대학원"
              help="끄면 모든 학생이 학부 기준으로 답을 받아요."
            >
              {sw('gradEnabled', '대학원 답변')}
            </Row>
          </Group>

          <Group title="답변" desc="">
            <Row title="답변 자유도" help={`높을수록 자료에 없는 말을 지어낼 수 있어요. (기본 ${defs.temperature})`}>
              <span className="flex w-full items-center gap-2 sm:w-64">
                <span className="text-xs text-ink-3">정확하게</span>
                <input
                  type="range"
                  aria-label="답변 자유도"
                  min={limits.temperature.min}
                  max={limits.temperature.max}
                  step={limits.temperature.step}
                  value={t}
                  disabled={!canEdit || busy}
                  onChange={(e) => set('temperature', Number(e.target.value))}
                  className="min-w-0 flex-1 accent-accent disabled:opacity-60"
                />
                <span className="text-xs text-ink-3">자유롭게</span>
                <span className="w-8 text-right text-sm font-semibold text-ink">{t.toFixed(1)}</span>
              </span>
            </Row>
            <Row title="최대 답변 길이" help="짧으면 긴 답이 중간에 끊겨요. (토큰 ≈ 한글 1~2자)">
              {num('maxTokens', '토큰', '최대 답변 길이')}
            </Row>
            <Row title="이어서 물어볼 질문 수" help="0이면 보이지 않아요.">
              {num('recCount', '개', '이어서 물어볼 질문 수')}
            </Row>
            <Row title="이어서 물어볼 질문 자유도" help={`높을수록 조금 먼 주제까지 보여 줘요. (기본 ${defs.recBreadth})`}>
              <span className="flex w-full items-center gap-2 sm:w-64">
                <span className="text-xs text-ink-3">가까운 것만</span>
                <input
                  type="range"
                  aria-label="이어서 물어볼 질문 자유도"
                  min={limits.recBreadth.min}
                  max={limits.recBreadth.max}
                  step={limits.recBreadth.step}
                  value={draft.recBreadth}
                  disabled={!canEdit || busy}
                  onChange={(e) => set('recBreadth', Number(e.target.value))}
                  className="min-w-0 flex-1 accent-accent disabled:opacity-60"
                />
                <span className="text-xs text-ink-3">넓게</span>
                <span className="w-8 text-right text-sm font-semibold text-ink">{draft.recBreadth.toFixed(1)}</span>
              </span>
            </Row>
          </Group>

          <Group title="주변 장소" desc="카카오맵 · 우정정보관 기준">
            <Row title="주변 장소 검색" help="">
              {sw('placeEnabled', '주변 장소 검색')}
            </Row>
            <Row title="검색 반경" help="">
              {num('placeRadiusM', 'm', '검색 반경')}
            </Row>
            <Row title="결과 수" help="">
              {num('placeSize', '곳', '결과 수')}
            </Row>
            <Row title="학교 밖 지역 질문 막기" help="예: '강남 맛집', '내 위치 근처 카페'">
              {sw('blockFarPlace', '학교 밖 지역 질문 막기')}
            </Row>
          </Group>

          <Group title="웹 검색" desc="학교 자료에서 못 찾았을 때만 검색해요.">
            <Row title="웹 검색" help="">
              {sw('webSearchEnabled', '웹 검색')}
            </Row>
            <Row title="검색 범위" help="웹 전체는 블로그·커뮤니티까지 찾아 틀린 정보가 섞일 수 있어요.">
              <span className={!canEdit || busy || !draft.webSearchEnabled ? 'pointer-events-none opacity-50' : ''}>
                <Segmented
                  value={draft.webSearchWide ? 'wide' : 'school'}
                  onChange={(v) => set('webSearchWide', v === 'wide')}
                  options={[
                    ['school', '학교 사이트만'],
                    ['wide', '웹 전체'],
                  ] as const}
                />
              </span>
            </Row>
            <Row title="하루 최대 검색 수" help="">
              {num('webSearchDaily', '번', '하루 최대 검색 수')}
            </Row>
          </Group>

          <Group title="호빗 캐릭터" desc="">
            <Row title="움직이는 캐릭터" help="">
              {sw('mascotEnabled', '움직이는 캐릭터')}
            </Row>
            <Row title="졸기까지 시간" help="">
              {num('mascotIdleSec', '초', '졸기까지 시간')}
            </Row>
          </Group>

          <Group title="학식" desc="">
            <Row title="학식 메뉴 답변" help="">
              {sw('menuEnabled', '학식 메뉴 답변')}
            </Row>
          </Group>
        </div>

        <Group title="과다 사용" desc="">
          <Row title="1분 질문 수 (브라우저마다)" help="넘으면 경고 1번">
            {num('sessionPerMin', '번', '브라우저 1분 질문 수')}
          </Row>
          <Row title="하루 질문 수 (브라우저마다)" help="">
            {num('sessionPerDay', '번', '브라우저 하루 질문 수')}
          </Row>
          <Row title="1분 질문 수 (IP마다)" help="학교 와이파이는 IP 하나를 여럿이 같이 써요.">
            {num('ipPerMin', '번', 'IP 1분 질문 수')}
          </Row>
          <Row title="하루 질문 수 (IP마다)" help="">
            {num('ipPerDay', '번', 'IP 하루 질문 수')}
          </Row>
          <Row title="최대 질문 길이" help={`${fmt(Number.isFinite(draft.maxQuestionChars) ? draft.maxQuestionChars * 2 : 0)}자를 넘으면 경고`}>
            {num('maxQuestionChars', '자', '최대 질문 길이')}
          </Row>
          <Row title="하루 글자 수 합" help="자정에 초기화">
            {num('dailyCharBudget', '자', '하루 글자 수 합')}
          </Row>
          <Row title="같은 질문 반복 — 안내" help="10분 안에">
            {num('repeatNoticeAt', '번째', '같은 질문 안내 횟수')}
          </Row>
          <Row title="같은 질문 반복 — 경고" help="안내 횟수보다 커야 해요.">
            {num('repeatStrikeAt', '번째', '같은 질문 경고 횟수')}
          </Row>
          <Row title="뜻 없는 입력 — 경고" help="10분 안에 · 예: 'ㅋㅋㅋ', 'asdf'">
            {num('meaninglessStrikeAt', '번째', '뜻 없는 입력 경고 횟수')}
          </Row>
          <Row title="정지까지 경고 수" help="24시간 안에">
            {num('warnLimit', '번', '정지까지 경고 수')}
          </Row>
          <Row title="정지 시간" help={`경고 ${draft.warnLimit} · ${draft.warnLimit + 1} · ${draft.warnLimit + 2}번째부터`}>
            <span className="flex flex-col items-start gap-0.5 sm:items-end">
              <span className="flex flex-wrap items-center gap-1.5 sm:justify-end">
                {[0, 1, 2].map((i) => (
                  <Stepper
                    key={i}
                    label={`정지 시간 ${i + 1}단계`}
                    value={draft.suspendMinutes[i]}
                    limit={{ min: limits.suspendMinutes.min, max: limits.suspendMinutes.max, step: 10 }}
                    unit="분"
                    width="w-[3.5rem]"
                    disabled={!canEdit || busy}
                    onChange={(v) => {
                      const next = [...draft.suspendMinutes] as Settings['suspendMinutes'];
                      next[i] = v;
                      set('suspendMinutes', next);
                    }}
                  />
                ))}
              </span>
              <span className="text-xs text-ink-3">기본 {defs.suspendMinutes.map(fmt).join(' · ')}분 (24시간 = 1,440분)</span>
            </span>
          </Row>
          <Row title="개인 AI 용도 막기" help="예: 코드 작성·자소서 대필·번역·과제 풀이">
            {sw('blockPersonalUse', '개인 AI 용도 막기')}
          </Row>
        </Group>
      </div>
    </section>
  );
};

export default BotSettings;
