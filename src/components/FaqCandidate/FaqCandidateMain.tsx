import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHobitMutateDeleteApi, useHobitMutatePutApi, useHobitQueryGetApi } from '../../hooks/hobitAdmin';
import { useIncremental } from '../../hooks/useIncremental';
import { useListCache } from '../../hooks/listCache';
import {
  DeleteFaqCandidateRequest,
  DeleteFaqCandidateResponse,
  FaqCandidate,
  FaqCandidateSort,
  FaqCandidateStatus,
  GetFaqCandidatesRequest,
  GetFaqCandidatesResponse,
  UpdateFaqCandidateRequest,
  UpdateFaqCandidateResponse,
} from '../../types/faqCandidate';
import Badge from '../ui/Badge';
import { appAlert, appConfirm } from '../ui/Dialog';
import Icon, { IconName } from '../ui/Icon';
import { ListEnd, ListHeader, ListSkeleton, LoadError } from '../ui/ListKit';
import { revealRef } from '../ui/motion';
import Segmented from '../ui/Segmented';
import Select from '../ui/Select';

/**
 * FAQ 후보 — 학생이 물었지만 호빗이 답을 못 찾은 질문을 비슷한 것끼리 모은 것 (밤 12시에 서버가 모음)
 *   많이 물은 것부터 FAQ로 만들고 '완료', 필요 없는 질문은 '제외'
 *   이미 비슷한 FAQ가 있으면 FAQ가 없는 게 아니라 검색이 놓친 것 → 키워드 규칙을 고칠 일
 */
const PATH = 'faq-candidates';
const SAMPLES_SHOWN = 3;

const STATUS_LABEL: Record<FaqCandidateStatus, string> = { open: '열림', done: '완료', dismissed: '제외' };

// 한국 시간 월/일 — 형식기를 한 번만 만들어 씀
const MD = new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', month: 'numeric', day: 'numeric' });
const monthDay = (iso: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const parts = MD.formatToParts(d);
  return `${parts.find((p) => p.type === 'month')?.value}/${parts.find((p) => p.type === 'day')?.value}`;
};

const IconButton: React.FC<{ icon: IconName; label: string; onClick: () => void; danger?: boolean }> = ({ icon, label, onClick, danger }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    title={label}
    className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
      danger ? 'text-danger hover:bg-danger-soft' : 'text-ink-2 hover:bg-card hover:text-accent-ink'
    }`}
  >
    <Icon name={icon} className="h-[18px] w-[18px]" />
  </button>
);

const CandidateCard: React.FC<{
  item: FaqCandidate;
  onStatus: (item: FaqCandidate, status: FaqCandidateStatus) => void;
  onDelete: (item: FaqCandidate) => void;
}> = ({ item, onStatus, onDelete }) => {
  const navigate = useNavigate();
  const [allSamples, setAllSamples] = useState(false);
  // 대표 문장과 같은 원래 문장은 빼고 보여 줌
  const samples = item.samples.filter((s) => s.text.trim() !== item.question.trim());
  const shownSamples = allSamples ? samples : samples.slice(0, SAMPLES_SHOWN);
  const first = monthDay(item.first_asked_at);
  const last = monthDay(item.last_asked_at);

  return (
    <div ref={revealRef} className="relative rounded-xl bg-card-2 p-3.5 sm:p-4">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1 break-words">
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            <Badge tone={item.ask_count >= 3 ? 'accent' : 'neutral'}>{item.ask_count.toLocaleString()}명이 물음</Badge>
            {(first || last) && (
              <span className="text-xs text-ink-3">{first === last ? first : `처음 ${first} · 마지막 ${last}`}</span>
            )}
          </div>
          <strong className="block leading-snug text-ink">{item.question}</strong>

          {shownSamples.length > 0 && (
            <ul className="mt-1.5 flex flex-col gap-0.5 text-xs text-ink-3">
              {shownSamples.map((s, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  {/* 영어로 물은 질문은 표시 (대표 문장은 한국어로 옮긴 것) */}
                  {(s.language || '').toUpperCase() === 'EN' ? (
                    <Badge tone="purple" className="!h-[18px] !px-1.5 text-[10px]">EN</Badge>
                  ) : (
                    <span aria-hidden="true">·</span>
                  )}
                  <span className="min-w-0">{s.text}</span>
                </li>
              ))}
              {samples.length > SAMPLES_SHOWN && (
                <li>
                  <button type="button" onClick={() => setAllSamples(!allSamples)} className="text-link underline">
                    {allSamples ? '접기' : `+${samples.length - SAMPLES_SHOWN}개 더`}
                  </button>
                </li>
              )}
            </ul>
          )}

          {item.similar_faq_id != null && item.similar_faq_question && (
            <div className="mt-2 flex flex-col gap-1 text-sm">
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge tone="link">비슷한 FAQ 있음</Badge>
                {item.similar_faq_senior && <Badge tone="senior">선배</Badge>}
                <Link
                  to={item.similar_faq_senior ? `/seniorfaqs/${item.similar_faq_id}` : `/faqs/${item.similar_faq_id}`}
                  className="min-w-0 text-link underline"
                >
                  {item.similar_faq_question}
                </Link>
              </div>
              <Link to="/keywords" className="text-xs text-ink-3 hover:text-ink-2 hover:underline">
                검색이 놓친 것 같아요 — 키워드 규칙을 추가해 보세요
              </Link>
            </div>
          )}
        </div>

        {/* 오른쪽 위 아이콘 — 피드백 카드와 같은 모양 */}
        <div className="-mr-1.5 -mt-1.5 flex shrink-0 items-center">
          {item.status === 'open' ? (
            <>
              <IconButton icon="plus" label="FAQ로 만들기" onClick={() => navigate(`/faqs/create?question=${encodeURIComponent(item.question)}`)} />
              <IconButton icon="check" label="완료" onClick={() => onStatus(item, 'done')} />
              <IconButton icon="close" label="제외" onClick={() => onStatus(item, 'dismissed')} />
            </>
          ) : (
            <IconButton icon="undo" label="열림으로 되돌리기" onClick={() => onStatus(item, 'open')} />
          )}
          <IconButton icon="trash" label="삭제" onClick={() => onDelete(item)} danger />
        </div>
      </div>
    </div>
  );
};

const FaqCandidateMain: React.FC = () => {
  const [status, setStatus] = useState<FaqCandidateStatus>('open');
  const [sort, setSort] = useState<FaqCandidateSort>('count');
  const api = useHobitQueryGetApi<GetFaqCandidatesRequest, GetFaqCandidatesResponse>(PATH, { query: { status, sort } });
  const payload = api.data?.payload;
  const data = payload?.statusCode === 200 ? payload.data : null;
  const candidates = data?.candidates ?? [];
  const counts = data?.counts ?? {};

  // 처음 20개, 내려가면 20개씩 더 — 상태·정렬을 바꾸면 처음부터
  const { shown, total, hasMore, sentinelRef, listRef } = useIncremental(candidates, `${status}|${sort}`);

  const update = useHobitMutatePutApi<UpdateFaqCandidateRequest, UpdateFaqCandidateResponse>(PATH);
  const remove = useHobitMutateDeleteApi<DeleteFaqCandidateRequest, DeleteFaqCandidateResponse>(PATH);
  const { patch } = useListCache();
  // 받아 둔 목록에서 바로 빼고 뒤에서 다시 받음 (개수도 같이 맞춰짐)
  const drop = (id: number) => patch<FaqCandidate>(PATH, 'candidates', (list) => list.filter((c) => c.id !== id));

  const changeStatus = async (item: FaqCandidate, next: FaqCandidateStatus) => {
    const res = await update({ params: { id: String(item.id) }, body: { status: next } });
    if (res.payload?.statusCode === 200) drop(item.id);
    else appAlert('상태를 바꾸지 못했어요. 다시 시도해 주세요.');
  };
  const deleteItem = async (item: FaqCandidate) => {
    if (!(await appConfirm(`'${item.question}' 후보를 지울까요?\n같은 질문이 다시 들어오면 새 후보로 생겨요.`, { danger: true }))) return;
    const res = await remove({ params: { id: String(item.id) } });
    if (res.payload?.statusCode === 200) drop(item.id);
    else appAlert('지우지 못했어요. 다시 시도해 주세요.');
  };

  return (
    <section className="panel">
      <div className="p-3 sm:p-6">
        <ListHeader
          title="FAQ 후보"
          count={data ? total : undefined}
          description="학생이 물었지만 호빗이 답을 못 찾은 질문을 비슷한 것끼리 모았어요"
          left={
            <>
              <Segmented
                options={(['open', 'done', 'dismissed'] as const).map((s) => [s, `${STATUS_LABEL[s]} ${counts[s] ?? 0}`] as const)}
                value={status}
                onChange={setStatus}
              />
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value as FaqCandidateSort)}
                aria-label="정렬"
                className="max-w-full rounded-xl border-2 border-line p-2 focus:outline-none focus:ring-2 focus:ring-accent-ink/40"
              >
                <option value="count">많이 물은 순</option>
                <option value="recent">최근 순</option>
              </Select>
            </>
          }
        />

        {!data ? (
          api.isPending || api.isFetching ? (
            <ListSkeleton lines={3} />
          ) : (
            <LoadError message="FAQ 후보를 불러오지 못했어요." onRetry={() => api.refetch()} />
          )
        ) : (
          <>
            <div ref={listRef} className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
              {shown.map((item) => (
                <CandidateCard key={item.id} item={item} onStatus={changeStatus} onDelete={deleteItem} />
              ))}
            </div>
            {total === 0 && (
              <p className="py-16 text-center text-sm text-ink-3">
                {status === 'open' ? '새 FAQ 후보가 없어요. 밤 12시에 그날 못 찾은 질문을 모아요' : `${STATUS_LABEL[status]}한 후보가 없어요`}
              </p>
            )}
            <ListEnd hasMore={hasMore} total={total} sentinelRef={sentinelRef} />
          </>
        )}
      </div>
    </section>
  );
};

export default FaqCandidateMain;
