import React, { useCallback, useEffect, useState } from 'react';
import { BotNumberKey, BotSettings as Settings, BotSettingsResponse, chatApi } from '../../api/chat';
import { useChat } from '../Chat/ChatProvider';
import { appAlert, appConfirm } from '../ui/Dialog';
import { Switch } from './ChatFeatures';

type Limits = BotSettingsResponse['limits'];

const same = (a: Settings | null, b: Settings | null) => JSON.stringify(a) === JSON.stringify(b);
const fmt = (n: number) => n.toLocaleString('ko-KR');

/** 한 줄 — 이름·설명 왼쪽, 입력 오른쪽 */
const Row: React.FC<{ title: string; help: string; children: React.ReactNode }> = ({ title, help, children }) => (
  <div className="flex flex-col gap-2 border-t border-line py-3 first:border-t-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
    <div className="min-w-0">
      <p className="font-semibold text-ink">{title}</p>
      <p className="mt-0.5 text-sm text-ink-3">{help}</p>
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
    <p className="mt-0.5 text-sm text-ink-3">{desc}</p>
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

  if (failed) return <p className="panel px-4 py-3 text-sm text-danger">채팅 서버에서 챗봇 설정을 불러오지 못했어요. 잠시 후 새로고침해 주세요.</p>;
  if (!data || !draft) return <div className="panel h-60 animate-pulse" />;

  const limits: Limits = data.limits;
  const defs = data.defaults;
  const dirty = !same(draft, data.settings);
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setDraft({ ...draft, [k]: v });
  const num = (k: BotNumberKey, unit: string, label: string) => (
    <NumberInput value={draft[k]} onChange={(v) => set(k, v)} limit={limits[k]} def={defs[k]} unit={unit} disabled={!canEdit || busy} label={label} />
  );
  const sw = (k: 'placeEnabled' | 'blockFarPlace' | 'menuEnabled' | 'gradEnabled' | 'blockPersonalUse', label: string) => (
    <Switch on={draft[k]} disabled={!canEdit || busy} onChange={(v) => set(k, v)} label={label} />
  );

  const save = async () => {
    const bad = (Object.keys(limits) as (BotNumberKey | 'suspendMinutes')[]).filter((k) =>
      k === 'suspendMinutes' ? draft.suspendMinutes.some((v) => !Number.isFinite(v)) : !Number.isFinite(draft[k])
    );
    if (bad.length) {
      await appAlert('비어 있는 칸이 있어요. 숫자를 넣어 주세요.');
      return;
    }
    if (!(await appConfirm('챗봇 설정을 저장할까요? 학생이 보내는 다음 질문부터 바로 적용돼요.', { confirmLabel: '저장' }))) return;
    setBusy(true);
    try {
      const r = await chatApi.setBotSettings(draft);
      const adjusted = !same(r.settings, draft);
      setData(r);
      setDraft(r.settings);
      appAlert(adjusted ? '저장했어요. 범위를 벗어난 값은 가장 가까운 허용 값으로 맞췄어요.' : '저장했어요. 다음 질문부터 바로 적용돼요.');
    } catch {
      appAlert('저장하지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setBusy(false);
    }
  };
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
            호빗이 답하는 방식과 과다 사용을 막는 기준을 바꿔요.
            {!canEdit && ' (바꾸기는 행정실·개발자 계정만 할 수 있어요)'}
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
            <button type="button" onClick={save} disabled={busy || !dirty} className="rounded-xl bg-accent px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">
              {busy ? '저장 중…' : '저장'}
            </button>
          </div>
        )}
      </div>

      <div className="mt-5 grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Group title="답변 대상" desc="학부는 항상 답해요. 대학원 답변만 끌 수 있어요.">
            <Row title="학부" help="기본 — 끌 수 없어요.">
              <span className="rounded-full bg-success-soft px-3 py-1 text-sm font-semibold text-success">항상 켜짐</span>
            </Row>
            <Row
              title="대학원"
              help="끄면 학생 화면의 학부/대학원 스위치가 사라지고, 대학원을 골라 두었던 학생도 학부 기준으로 답을 받아요. 다시 켜면 학생이 골라 둔 값으로 돌아가요."
            >
              {sw('gradEnabled', '대학원 답변')}
            </Row>
          </Group>

          <Group title="답변" desc="답변을 쓰는 AI의 말투·길이">
            <Row title="답변 자유도" help={`낮으면 찾은 자료 그대로 정확하게, 높으면 표현을 자유롭게 바꿔요. 높을수록 자료에 없는 말을 지어낼 수 있어요. (기본 ${defs.temperature})`}>
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
            <Row title="최대 답변 길이" help="답변 한 번에 쓸 수 있는 최대 길이 (토큰, 한글 약 1~2자). 짧으면 긴 답이 중간에 끊겨요.">
              {num('maxTokens', '토큰', '최대 답변 길이')}
            </Row>
          </Group>

          <Group title="주변 장소" desc="카카오맵으로 학교 주변 맛집·카페·약국 등을 찾아 답해요 (우정정보관 기준)">
            <Row title="주변 장소 검색" help="끄면 장소 질문에도 카카오맵을 찾지 않고, 학교 자료로만 답해요.">
              {sw('placeEnabled', '주변 장소 검색')}
            </Row>
            <Row title="검색 반경" help="우정정보관에서 이 거리 안의 장소만 찾아요.">
              {num('placeRadiusM', 'm', '검색 반경')}
            </Row>
            <Row title="결과 수" help="한 번에 보여 줄 장소 수예요.">
              {num('placeSize', '곳', '결과 수')}
            </Row>
            <Row title="학교 밖 지역 질문 막기" help="'강남 맛집', '내 위치 근처 카페'처럼 학교 주변이 아닌 장소 질문에는 안내만 하고 답하지 않아요.">
              {sw('blockFarPlace', '학교 밖 지역 질문 막기')}
            </Row>
          </Group>

          <Group title="학식" desc="학식 메뉴 질문에 학교 홈페이지 식단(없으면 고파스)을 그때그때 읽어 답해요">
            <Row title="학식 메뉴 답변" help="끄면 메뉴를 읽지 않고 일반 자료로만 답해요.">
              {sw('menuEnabled', '학식 메뉴 답변')}
            </Row>
          </Group>
        </div>

        <Group title="과다 사용" desc="질문 하나마다 AI 비용이 나가서, 너무 많이·이상하게 쓰면 안내하거나 잠시 막아요. 서버 안에서 보내는 테스트 질문은 빼요.">
          <Row title="1분 질문 수 (브라우저마다)" help="학생 한 명이 1분에 보낼 수 있는 질문 수예요. 넘으면 경고 1번.">
            {num('sessionPerMin', '번', '브라우저 1분 질문 수')}
          </Row>
          <Row title="하루 질문 수 (브라우저마다)" help="학생 한 명이 하루에 보낼 수 있는 질문 수예요.">
            {num('sessionPerDay', '번', '브라우저 하루 질문 수')}
          </Row>
          <Row title="1분 질문 수 (IP마다)" help="학교 와이파이는 여러 학생이 IP 하나를 같이 써서 넉넉하게 둬요.">
            {num('ipPerMin', '번', 'IP 1분 질문 수')}
          </Row>
          <Row title="하루 질문 수 (IP마다)" help="세션을 계속 바꿔 보내는 스크립트를 막는 용도예요.">
            {num('ipPerDay', '번', 'IP 하루 질문 수')}
          </Row>
          <Row title="최대 질문 길이" help={`이보다 긴 질문은 답하지 않아요. 2배(${fmt(Number.isFinite(draft.maxQuestionChars) ? draft.maxQuestionChars * 2 : 0)}자)를 넘으면 경고까지.`}>
            {num('maxQuestionChars', '자', '최대 질문 길이')}
          </Row>
          <Row title="하루 글자 수 합" help="한 학생이 하루 동안 보낸 질문 글자 수의 합이 넘으면 그날은 더 답하지 않아요 (자정에 초기화).">
            {num('dailyCharBudget', '자', '하루 글자 수 합')}
          </Row>
          <Row title="같은 질문 반복 — 안내" help="10분 안에 같은 질문을 이만큼 하면 답하지 않고 '위 답변을 확인해 주세요'라고 안내해요.">
            {num('repeatNoticeAt', '번째', '같은 질문 안내 횟수')}
          </Row>
          <Row title="같은 질문 반복 — 경고" help="안내 횟수보다 커야 해요.">
            {num('repeatStrikeAt', '번째', '같은 질문 경고 횟수')}
          </Row>
          <Row title="뜻 없는 입력 — 경고" help="10분 안에 'ㅋㅋㅋ', 'asdf' 같은 입력을 이만큼 보내면 경고해요 (그 전에는 안내만).">
            {num('meaninglessStrikeAt', '번째', '뜻 없는 입력 경고 횟수')}
          </Row>
          <Row title="정지까지 경고 수" help="욕설·공격 입력·횟수 초과 등으로 24시간 안에 경고를 이만큼 받으면 잠시 질문을 막아요.">
            {num('warnLimit', '번', '정지까지 경고 수')}
          </Row>
          <Row title="정지 시간" help={`경고 ${draft.warnLimit}번째 · ${draft.warnLimit + 1}번째 · ${draft.warnLimit + 2}번째부터 막는 시간이에요. 단계마다 같거나 길게 맞춰져요.`}>
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
          <Row title="개인 AI 용도 막기" help="코드 작성·자소서 대필·번역·과제 풀이·역할극처럼 학교생활과 관계없는 요청에는 안내만 하고 답하지 않아요.">
            {sw('blockPersonalUse', '개인 AI 용도 막기')}
          </Row>
        </Group>
      </div>
    </section>
  );
};

export default BotSettings;
