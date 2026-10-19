import React from 'react';
import { useHobitQueryGetApi } from '../../../hooks/hobitAdmin';
import { MyAccountResponse } from '../../../types/user';
import Badge from '../../ui/Badge';

/** 마이페이지 — 내 계정 정보와 권한 (무엇을 할 수 있는지) */
const ROLE_INFO = {
  developer: {
    label: '개발자',
    tone: 'link',
    can: ['관리자 사이트의 모든 기능 (행정실과 같음)', '모든 계정의 역할 바꾸기 (개발자 · 행정실 · 근로장학생)', '행정실 채팅 · 선배 채팅 모두'],
  },
  staff: {
    label: '행정실',
    tone: 'accent',
    can: ['FAQ · 선배 FAQ 만들기·수정·삭제', '키워드 · 로그 · 피드백 · 관리(카테고리·일괄 관리)', '행정실 채팅 · 선배 채팅 모두', '채팅 설정 (운영 시간 · 휴무일 · 행정실↔근로장학생 역할 바꾸기)'],
  },
  senior: {
    label: '근로장학생',
    tone: 'senior',
    can: ['선배 FAQ 만들기·수정·삭제', '선배 FAQ 카테고리 이름·순서 수정', '선배 채팅 (학생 메일은 가려져 보임)'],
  },
} as const;

const Row: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4 border-b border-line py-3.5 last:border-0">
    <dt className="text-sm font-semibold text-ink-3">{label}</dt>
    <dd className="truncate text-ink">{value ?? '—'}</dd>
  </div>
);

const MyPage: React.FC = () => {
  const { data, isLoading } = useHobitQueryGetApi<{}, MyAccountResponse>('users/me');
  const me = data?.payload?.data;
  const info = me ? ROLE_INFO[me.role] : null;

  return (
    <div className="mx-auto max-w-[640px] py-10">
      <h1 className="mb-1 text-[28px] font-bold text-ink">마이페이지</h1>
      <p className="mb-6 text-ink-2">내 계정 정보와 권한이에요.</p>
      {isLoading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-card" />
      ) : !me || !info ? (
        <p className="rounded-2xl bg-card p-6 text-center text-ink-2">계정 정보를 불러오지 못했어요. 다시 로그인해 주세요.</p>
      ) : (
        <div className="flex flex-col gap-4">
          <section className="rounded-2xl border border-line bg-surface px-6 py-2">
            {/* 헤더의 내 정보 메뉴와 같은 모양 — 동그라미 + 이름 + 권한 */}
            <div className="flex items-center gap-4 border-b border-line py-5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-[22px] font-bold text-white">
                {(me.username || '?').slice(0, 1)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-xl font-bold text-ink">{me.username}</span>
                <Badge tone={info.tone} className="mt-1.5">
                  {info.label}
                </Badge>
              </span>
            </div>
            <dl>
              <Row label="이메일" value={me.email} />
              <Row label="전화번호" value={me.phone_num} />
              <Row label="가입일" value={me.created_at ? new Date(me.created_at).toLocaleDateString('ko-KR') : undefined} />
            </dl>
          </section>
          <section className="rounded-2xl border border-line bg-surface p-6">
            <div className="mb-3 flex items-center gap-3">
              <h2 className="font-bold text-ink">내 권한</h2>
              <Badge tone={info.tone}>{info.label}</Badge>
            </div>
            <ul className="flex flex-col gap-1.5 text-[15px] text-ink-2">
              {info.can.map((c) => (
                <li key={c} className="flex gap-2">
                  <span aria-hidden="true" className="text-success">✓</span>
                  {c}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
};

export default MyPage;
