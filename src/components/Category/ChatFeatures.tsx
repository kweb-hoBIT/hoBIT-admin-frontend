import React, { useCallback, useEffect, useState } from 'react';
import { chatApi, ChatFeatures as Features } from '../../api/chat';
import { useChat } from '../Chat/ChatProvider';
import { appAlert, appConfirm } from '../ui/Dialog';

/** 켜기·끄기 스위치 — 동그라미가 옆으로 미끄러짐 */
const Switch: React.FC<{ on: boolean; disabled?: boolean; onChange: (v: boolean) => void; label: string }> = ({ on, disabled, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    aria-label={label}
    disabled={disabled}
    onClick={() => onChange(!on)}
    className={`relative h-8 w-14 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${on ? 'bg-success' : 'bg-card-2'}`}
  >
    <span className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow transition-transform duration-200 ${on ? 'translate-x-6' : 'translate-x-0'}`} />
  </button>
);

const REASON: Record<string, string> = {
  open: '지금 운영 중',
  disabled: '꺼짐',
  away: '채팅 가능한 근로장학생 없음',
  holiday: '휴무일',
  weekend: '주말',
  lunch: '점심시간',
  before: '운영 시간 전',
  after: '운영 시간 끝남',
};

/**
 * 관리 > 채팅 — 채팅을 아예 쓸지 (끄면 호빗 화면 메뉴에 그 채팅이 안 보임), 학교 메일 인증
 * 바꾸기는 행정실·개발자 계정만 (채팅 서버도 같은 기준)
 */
const ChatFeatures: React.FC = () => {
  const { role } = useChat();
  const canEdit = role === 'staff';
  const [f, setF] = useState<Features | null>(null);
  const [status, setStatus] = useState<Record<'staff' | 'senior', string>>({ staff: '', senior: '' });
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    try {
      const [{ features }, staff, senior] = await Promise.all([chatApi.getFeatures(), chatApi.status('staff'), chatApi.status('senior')]);
      setF(features);
      setStatus({ staff: REASON[staff.reason] ?? staff.reason, senior: REASON[senior.reason] ?? senior.reason });
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const save = async (patch: Partial<Features>) => {
    setBusy(true);
    try {
      const { features } = await chatApi.setFeatures(patch);
      setF(features);
      await load();
    } catch {
      appAlert('저장하지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setBusy(false);
    }
  };

  const toggleChat = async (mode: 'staff' | 'senior', on: boolean) => {
    const name = mode === 'staff' ? '행정실 채팅' : '근로장학생 채팅';
    if (!on && !(await appConfirm(`${name}을 끌까요? 호빗 화면 메뉴에서 ${name} 버튼이 사라지고, 새 채팅을 시작할 수 없어요. 진행 중인 채팅은 그대로 이어져요.`))) return;
    save({ [mode]: on });
  };
  const toggleEmail = async (on: boolean) => {
    if (
      !on &&
      !(await appConfirm('학교 메일 인증을 끌까요? 학생이 메일 주소만 적고 인증 코드 없이 채팅을 시작해요. 다른 사람 메일을 적어도 막을 수 없어서, 시연할 때처럼 꼭 필요할 때만 꺼 주세요.', { danger: true }))
    )
      return;
    save({ emailVerification: on });
  };

  const cards: { mode: 'staff' | 'senior'; title: string; desc: string }[] = [
    { mode: 'staff', title: '행정실 채팅', desc: '운영 시간에 행정실 담당자와 연결돼요. 운영 시간은 채팅 화면의 [채팅 설정]에서 바꿔요.' },
    { mode: 'senior', title: '근로장학생 채팅', desc: '채팅 가능 상태인 근로장학생이 있을 때 연결돼요. 학생에게는 이름·학번이 보이지 않아요.' },
  ];

  return (
    <section className="panel p-4 sm:p-6">
      <h4 className="text-xl font-bold text-ink">채팅</h4>
      <p className="mt-1 text-sm text-ink-3">
        호빗 화면에서 쓸 채팅을 켜고 꺼요. 끈 채팅은 학생 메뉴에서 아예 안 보여요.
        {!canEdit && ' (바꾸기는 행정실·개발자 계정만 할 수 있어요)'}
      </p>
      {failed && <p className="mt-4 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">채팅 서버에서 설정을 불러오지 못했어요. 잠시 후 새로고침해 주세요.</p>}
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        {cards.map((c) => {
          const on = f ? f[c.mode] : false;
          return (
            <div key={c.mode} className={`rounded-2xl border p-4 transition-colors ${on ? 'border-line' : 'border-line bg-card/60'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-ink">{c.title}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm">
                    <span className={`h-2 w-2 rounded-full ${!f ? 'bg-ink-3' : !on ? 'bg-ink-3' : status[c.mode] === REASON.open ? 'bg-success' : 'bg-warn'}`} />
                    <span className="text-ink-2">{!f ? '불러오는 중…' : on ? status[c.mode] || '켜짐' : '꺼짐 — 학생 메뉴에 안 보여요'}</span>
                  </p>
                </div>
                <Switch on={on} disabled={!f || busy || !canEdit} onChange={(v) => toggleChat(c.mode, v)} label={`${c.title} 사용`} />
              </div>
              <p className="mt-3 text-sm text-ink-3">{c.desc}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3 rounded-2xl border border-line p-4">
        <div className="min-w-0">
          <p className="font-semibold text-ink">학교 메일 인증</p>
          <p className="mt-0.5 text-sm text-ink-3">
            채팅을 시작하기 전에 학교 메일(@korea.ac.kr)로 받은 인증 코드를 확인해요. 끄면 본인 확인 없이 메일 주소만 적고 시작해요.
          </p>
          {f && !f.emailVerification && <p className="mt-1 text-sm font-semibold text-warn">지금 꺼져 있어요 — 본인 확인 없이 채팅을 시작할 수 있어요.</p>}
        </div>
        <Switch on={f?.emailVerification ?? false} disabled={!f || busy || !canEdit} onChange={toggleEmail} label="학교 메일 인증" />
      </div>
    </section>
  );
};

export default ChatFeatures;
