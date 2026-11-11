import React, { useEffect, useState } from 'react';
import { BotPowerResponse, chatApi } from '../../api/chat';
import { useChat } from '../Chat/ChatProvider';
import Badge from '../ui/Badge';
import { Switch } from './ChatFeatures';

/**
 * 관리 > 챗봇 설정 맨 위 — 챗봇 켜기·끄기
 * 끄면 학생 화면이 '잠시 쉬어가요' 오류 화면(우는 호빗)을 보여 줌. 바꾸려면 개발자 키(서버 .env의 BOT_POWER_KEY)가 필요
 * (채팅 서버 src/services/bot_power.ts)
 */
const ERR: Record<string, string> = {
  bad_key: '개발자 키가 맞지 않아요.',
  no_key: '서버에 개발자 키(BOT_POWER_KEY)가 설정되어 있지 않아 바꿀 수 없어요.',
};

const BotPower: React.FC = () => {
  const { role } = useChat();
  const canEdit = role === 'staff';
  const [data, setData] = useState<BotPowerResponse | null>(null);
  const [want, setWant] = useState<boolean | null>(null); // 바꾸려는 값 (키 입력 중)
  const [key, setKey] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    chatApi.getBotPower().then(setData).catch(() => setData(null));
  }, []);
  if (!data) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (want === null) return;
    setBusy(true);
    setErr('');
    try {
      setData(await chatApi.setBotPower(want, key));
      setWant(null);
      setKey('');
    } catch (e2) {
      const code = (e2 as { code?: string }).code ?? '';
      setErr(ERR[code] ?? (e2 as Error).message ?? '바꾸지 못했어요.');
    } finally {
      setBusy(false);
    }
  };

  const on = data.enabled;
  return (
    <section className={`panel mb-4 p-4 sm:p-6 ${on ? '' : 'border-danger/40 bg-danger-soft/40'}`}>
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="flex items-center gap-2 text-xl font-bold text-ink">
            챗봇 {on ? <Badge tone="green">켜짐</Badge> : <Badge tone="yellow">꺼짐</Badge>}
          </h4>
          <p className="mt-1 text-sm text-ink-3">
            끄면 학생 화면에 '호빗이 잠시 쉬고 있어요' 안내(우는 호빗)가 나오고 질문을 받지 않아요. 바꾸려면 개발자 키가 필요해요.
          </p>
          {data.updatedAt && (
            <p className="mt-1 text-xs text-ink-3">
              마지막 변경: {new Date(data.updatedAt).toLocaleString('ko-KR')}
              {data.updatedBy ? ` · ${data.updatedBy}` : ''}
            </p>
          )}
        </div>
        <Switch
          on={want === null ? on : want}
          disabled={!canEdit || busy || !data.keyConfigured}
          label="챗봇 켜기"
          onChange={(v) => {
            setErr('');
            setWant(v === on ? null : v);
          }}
        />
      </div>
      {!data.keyConfigured && <p className="mt-3 text-xs text-ink-3">서버에 개발자 키(BOT_POWER_KEY)가 없어 지금은 바꿀 수 없어요.</p>}
      {want !== null && (
        <form onSubmit={submit} className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-card p-3">
          <label className="text-sm font-semibold text-ink-2" htmlFor="bot-power-key">
            개발자 키
          </label>
          <input
            id="bot-power-key"
            type="password"
            autoComplete="off"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            autoFocus
            className="field min-w-[12rem] flex-1"
          />
          <button type="button" onClick={() => setWant(null)} disabled={busy} className="rounded-xl bg-surface px-4 py-2 text-sm font-semibold text-ink-2 hover:bg-card-2">
            취소
          </button>
          <button
            type="submit"
            disabled={busy || !key}
            className={`rounded-xl px-5 py-2 text-sm font-semibold text-white disabled:opacity-50 ${want ? 'bg-accent hover:bg-accent/90' : 'bg-danger hover:bg-danger/90'}`}
          >
            {busy ? '바꾸는 중…' : want ? '챗봇 켜기' : '챗봇 끄기'}
          </button>
          {err && <p className="basis-full text-sm text-danger">{err}</p>}
        </form>
      )}
    </section>
  );
};

export default BotPower;
