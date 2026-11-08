import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHobitMutatePutApi, useHobitQueryGetApi } from '../../hooks/hobitAdmin';
import {
  GetNoticeChangesRequest,
  GetNoticeChangesResponse,
  NoticeChange,
  NoticeChangeStatus,
  UpdateNoticeChangeRequest,
  UpdateNoticeChangeResponse,
} from '../../types/noticeChange';

/**
 * 공지로 바뀐 내용 — 새 공지가 행정실 FAQ·홈페이지 안내의 내용을 바꾼 것으로 보이는 항목 (데이터 수집 때 자동으로 찾음)
 * 챗봇은 이미 답변할 때 공지를 따르지만, FAQ 자체는 사람이 확인하고 고쳐야 함. 확인할 것이 없으면 카드를 숨김
 */
const NoticeChangesCard: React.FC = () => {
  const api = useHobitQueryGetApi<GetNoticeChangesRequest, GetNoticeChangesResponse>('notice-changes', {
    query: { status: 'new' },
  });
  const update = useHobitMutatePutApi<UpdateNoticeChangeRequest, UpdateNoticeChangeResponse>('notice-changes');
  const [busy, setBusy] = useState<number | null>(null);
  const items = api.data?.payload?.data?.changes ?? [];
  if (!items.length) return null;

  const mark = async (c: NoticeChange, status: NoticeChangeStatus) => {
    setBusy(c.id);
    try {
      await update({ params: { id: String(c.id) }, body: { status } });
      await api.refetch();
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="mb-4 rounded-2xl border border-warn/40 bg-warn-soft px-5 py-4">
      <p className="font-semibold text-ink">공지로 바뀐 내용이 있어요 ({items.length})</p>
      <p className="mt-1 text-sm text-ink-3">
        새 공지가 아래 FAQ·안내 페이지의 내용을 바꾼 것으로 보여요. 챗봇은 이미 공지를 따라 답하지만, FAQ는 직접 고쳐 주세요.
      </p>
      <ul className="mt-3 flex flex-col gap-3">
        {items.slice(0, 5).map((c) => (
          <li key={c.id} className="rounded-xl bg-surface px-4 py-3 text-sm">
            <p className="text-ink">
              <span className="font-semibold">{c.target_kind === 'faq' ? 'FAQ' : '안내 페이지'}</span> · {c.target_title}
            </p>
            <p className="mt-1 text-ink-2">
              <span className="font-medium">{c.what}</span>: {c.before_value ? <s className="text-ink-3">{c.before_value}</s> : null}
              {c.before_value ? ' → ' : ''}
              <span className="font-medium text-ink">{c.after_value}</span>
              {c.applies_to ? <span className="text-ink-3"> ({c.applies_to})</span> : null}
            </p>
            <p className="mt-1 text-ink-3">
              근거 공지: {c.notice_date ?? ''}{' '}
              {c.notice_link ? (
                <a href={c.notice_link} target="_blank" rel="noreferrer" className="underline">
                  {c.notice_title}
                </a>
              ) : (
                c.notice_title
              )}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {c.faq_id && (
                <Link to={`/faqs/${c.faq_id}`} className="rounded-lg bg-accent px-3 py-1 text-white">
                  FAQ 고치러 가기
                </Link>
              )}
              <button
                type="button"
                disabled={busy === c.id}
                onClick={() => mark(c, 'done')}
                className="rounded-lg border border-line px-3 py-1 text-ink-2 hover:text-ink"
              >
                반영했어요
              </button>
              <button
                type="button"
                disabled={busy === c.id}
                onClick={() => mark(c, 'ignored')}
                className="rounded-lg px-3 py-1 text-ink-3 hover:text-ink-2"
                title="잘못 찾은 항목 — 목록에서 숨김"
              >
                바뀐 게 아니에요
              </button>
            </div>
          </li>
        ))}
      </ul>
      {items.length > 5 && <p className="mt-2 text-sm text-ink-3">외 {items.length - 5}건 — 위 항목을 처리하면 이어서 보여요</p>}
    </div>
  );
};

export default NoticeChangesCard;
