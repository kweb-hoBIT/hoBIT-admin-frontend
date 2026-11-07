// 공지로 바뀐 내용 — 새 공지가 행정실 FAQ·홈페이지 안내의 내용을 바꾸는 경우 (관리자 백엔드 routes/api/noticeChanges)
export type NoticeChangeStatus = 'new' | 'done' | 'ignored';

export type NoticeChange = {
  id: number;
  notice_title: string;
  notice_link: string | null;
  notice_date: string | null;
  target_kind: 'faq' | 'page';
  target_title: string;
  faq_id: number | null;
  what: string;
  before_value: string | null;
  after_value: string;
  applies_to: string | null;
  status: NoticeChangeStatus;
  created_at: string;
};

export type GetNoticeChangesRequest = { query?: { status: NoticeChangeStatus } };
export type GetNoticeChangesResponse = { statusCode: number; message: string; data: { changes: NoticeChange[] } };

export type UpdateNoticeChangeRequest = { params: { id: string }; body: { status: NoticeChangeStatus } };
export type UpdateNoticeChangeResponse = { statusCode: number; message: string };
