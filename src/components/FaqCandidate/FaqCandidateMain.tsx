import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { hobitGetApi, hobitPostApi } from '../../api/api';
import { useHobitMutateDeleteApi, useHobitMutatePutApi, useHobitQueryGetApi } from '../../hooks/hobitAdmin';
import { useIncremental } from '../../hooks/useIncremental';
import { useListCache } from '../../hooks/listCache';
import {
  DeleteFaqCandidateRequest,
  DeleteFaqCandidateResponse,
  FaqCandidate,
  FaqCandidateQuestion,
  FaqCandidateSort,
  FaqCandidateStatus,
  FaqCandidateTopic,
  GetFaqCandidateQuestionsRequest,
  GetFaqCandidateQuestionsResponse,
  GetFaqCandidatesRequest,
  GetFaqCandidatesResponse,
  GetFaqCandidateTopicsRequest,
  GetFaqCandidateTopicsResponse,
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
 *   주제별: 주제 → 하위 주제 → 같은 뜻 후보 → 학생이 실제로 쓴 질문 (학생들이 어떤 종류를 묻는지 한눈에)
 */
const PATH = 'faq-candidates';
const SAMPLES_SHOWN = 3;
const QUESTIONS_PAGE = 20;
const VIEW_KEY = 'hobit-admin-faq-candidate-view';
type View = 'topic' | 'list';

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

const DATE = new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', year: '2-digit', month: 'numeric', day: 'numeric' });
const shortDate = (iso: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : DATE.format(d);
};

const Chevron: React.FC<{ open: boolean }> = ({ open }) => (
  <span className={`shrink-0 text-ink-3 transition-transform ${open ? 'rotate-90' : ''}`} aria-hidden="true">
    ›
  </span>
);

/** 학생이 실제로 쓴 질문 — 펼칠 때 처음 받고, 20개씩 더 (욕설은 서버가 ●●로 가려 보냄) */
const RawQuestions: React.FC<{ id: number; total: number }> = ({ id, total }) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<FaqCandidateQuestion[]>([]);
  const [count, setCount] = useState(total);
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');

  const load = async (offset: number) => {
    setState('loading');
    const res = await hobitGetApi<GetFaqCandidateQuestionsRequest, GetFaqCandidateQuestionsResponse>(PATH, {
      params: { id: String(id), sub: 'questions' },
      query: { offset, limit: QUESTIONS_PAGE },
    });
    if (res.payload?.statusCode === 200) {
      const { questions, total: n } = res.payload.data;
      setItems((prev) => (offset === 0 ? questions : [...prev, ...questions]));
      setCount(n);
      setState('idle');
    } else setState('error');
  };
  const toggle = () => {
    if (!open && !items.length) load(0);
    setOpen(!open);
  };
  if (!total) return null;

  return (
    <div className="mt-2">
      <button type="button" aria-expanded={open} onClick={toggle} className="inline-flex min-h-[32px] items-center gap-1.5 text-sm text-link hover:underline">
        <Chevron open={open} />
        실제 질문 {count.toLocaleString()}개 {open ? '접기' : '보기'}
      </button>
      {open && (
        <div className="animate-appear mt-1 rounded-xl bg-surface px-3 py-2">
          <ul className="flex flex-col divide-y divide-line text-sm">
            {items.map((q) => (
              <li key={q.id} className="flex items-start gap-2 py-1.5">
                {(q.language || '').toUpperCase() === 'EN' && (
                  <Badge tone="purple" className="!h-[18px] !px-1.5 text-[10px]">EN</Badge>
                )}
                <span className="min-w-0 flex-1 break-words text-ink-2">{q.text}</span>
                <span className="shrink-0 text-xs tabular-nums text-ink-3">{shortDate(q.asked_at)}</span>
              </li>
            ))}
          </ul>
          {state === 'error' && <p className="py-1 text-xs text-danger">불러오지 못했어요.</p>}
          {state === 'loading' ? (
            <p className="py-1 text-xs text-ink-3">불러오는 중…</p>
          ) : (
            items.length < count && (
              <button type="button" onClick={() => load(items.length)} className="mt-1 text-xs text-link underline">
                {Math.min(QUESTIONS_PAGE, count - items.length)}개 더 보기
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
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

          <RawQuestions id={item.id} total={item.question_count ?? 0} />

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

type CardActions = {
  onStatus: (item: FaqCandidate, status: FaqCandidateStatus) => void;
  onDelete: (item: FaqCandidate) => void;
};

/** 주제 · 하위 주제 줄 — 이름, 물은 횟수·후보 수, 가는 막대(가장 많은 줄 대비) */
const TreeRow: React.FC<{ name: string; count: number; candidates: number; max: number; open: boolean; depth: 0 | 1; onClick: () => void }> = ({
  name,
  count,
  candidates,
  max,
  open,
  depth,
  onClick,
}) => (
  <button
    type="button"
    aria-expanded={open}
    onClick={onClick}
    className={`flex w-full min-w-0 items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-card ${depth ? 'pl-3' : ''}`}
  >
    <span className="flex min-w-0 flex-1 flex-col gap-1">
      <span className="flex min-w-0 items-baseline gap-2">
        <span className={`min-w-0 truncate ${depth === 0 ? 'font-bold text-ink' : 'font-medium text-ink'}`}>{name}</span>
        <span className="shrink-0 text-xs tabular-nums text-ink-3">
          {count.toLocaleString()}회 · 후보 {candidates.toLocaleString()}개
        </span>
      </span>
      <span className="block h-1 w-full overflow-hidden rounded-full bg-card" aria-hidden="true">
        <span
          className={`block h-full rounded-full ${depth === 0 ? 'bg-accent' : 'bg-accent/50'}`}
          style={{ width: `${max ? Math.max(2, Math.round((count / max) * 100)) : 0}%` }}
        />
      </span>
    </span>
    <Chevron open={open} />
  </button>
);

const TopicTree: React.FC<{ topics: FaqCandidateTopic[] } & CardActions> = ({ topics, onStatus, onDelete }) => {
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const toggle = (key: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  const max = topics[0]?.count ?? 0;

  return (
    <ul className="flex flex-col gap-1">
      {topics.map((t) => {
        const tKey = t.topic.id;
        const tOpen = open.has(tKey);
        const subMax = t.subtopics[0]?.count ?? 0;
        return (
          <li key={tKey} className="rounded-xl border border-line">
            <TreeRow name={t.topic.name} count={t.count} candidates={t.candidates_count} max={max} open={tOpen} depth={0} onClick={() => toggle(tKey)} />
            {tOpen && (
              <ul className="animate-appear flex flex-col gap-1 border-t border-line px-1 py-1 sm:pl-4">
                {t.subtopics.map((s) => {
                  const sKey = `${tKey}|${s.name}`;
                  const sOpen = open.has(sKey);
                  return (
                    <li key={sKey}>
                      <TreeRow name={s.name} count={s.count} candidates={s.candidates.length} max={subMax} open={sOpen} depth={1} onClick={() => toggle(sKey)} />
                      {sOpen && (
                        <div className="animate-appear grid grid-cols-1 gap-3 px-1 pb-2 pt-1 sm:pl-3 md:grid-cols-2">
                          {s.candidates.map((item) => (
                            <CandidateCard key={item.id} item={item} onStatus={onStatus} onDelete={onDelete} />
                          ))}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
};

const FaqCandidateMain: React.FC = () => {
  const [status, setStatus] = useState<FaqCandidateStatus>('open');
  const [sort, setSort] = useState<FaqCandidateSort>('count');
  // 처음엔 주제별 — 마지막으로 고른 보기를 탭 안에서 기억
  const [view, setViewState] = useState<View>(() => {
    try {
      return sessionStorage.getItem(VIEW_KEY) === 'list' ? 'list' : 'topic';
    } catch {
      return 'topic';
    }
  });
  const setView = (v: View) => {
    setViewState(v);
    try {
      sessionStorage.setItem(VIEW_KEY, v);
    } catch {}
  };
  // 두 보기 모두 주소 앞부분이 같아(faq-candidates) 상태를 바꾸면 함께 다시 받음
  const api = useHobitQueryGetApi<GetFaqCandidatesRequest, GetFaqCandidatesResponse>(PATH, { query: { status, sort } });
  const topicApi = useHobitQueryGetApi<GetFaqCandidateTopicsRequest, GetFaqCandidateTopicsResponse>(PATH, {
    params: { sub: 'topics' },
    query: { status },
  });
  const payload = api.data?.payload;
  const data = payload?.statusCode === 200 ? payload.data : null;
  const candidates = data?.candidates ?? [];
  const topicPayload = topicApi.data?.payload;
  const topicData = topicPayload?.statusCode === 200 ? topicPayload.data : null;
  const counts = (view === 'topic' ? topicData?.counts : data?.counts) ?? {};
  const shownApi = view === 'topic' ? topicApi : api;
  const ready = view === 'topic' ? !!topicData : !!data;

  // 처음 20개, 내려가면 20개씩 더 — 상태·정렬을 바꾸면 처음부터
  const { shown, total, hasMore, sentinelRef, listRef } = useIncremental(candidates, `${status}|${sort}`);

  const update = useHobitMutatePutApi<UpdateFaqCandidateRequest, UpdateFaqCandidateResponse>(PATH);
  const remove = useHobitMutateDeleteApi<DeleteFaqCandidateRequest, DeleteFaqCandidateResponse>(PATH);
  const { patch } = useListCache();
  // 받아 둔 목록에서 바로 빼고 뒤에서 다시 받음 (개수·주제별 묶음도 같이 맞춰짐)
  const drop = (id: number) => patch<FaqCandidate>(PATH, 'candidates', (list) => list.filter((c) => c.id !== id));

  // 밤 12시 정리를 지금 한 번 — 새로 답을 못 찾은 질문 묶기 + 주제·비슷한 FAQ 다시 정하기
  const [running, setRunning] = useState(false);
  const runNow = async () => {
    setRunning(true);
    const res = await hobitPostApi<any, any>(`${PATH}/run`);
    setRunning(false);
    const p = res.payload;
    if (p?.statusCode === 200) {
      api.refetch();
      topicApi.refetch();
      appAlert('정리했어요.');
    } else if (p?.statusCode === 409) appAlert('이미 정리하는 중이에요. 잠시 뒤에 다시 확인해 주세요.');
    else appAlert('정리하지 못했어요. 잠시 뒤에 다시 시도해 주세요.');
  };

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
          count={ready ? (view === 'topic' ? topicData!.total : total) : undefined}
          description="학생이 물었지만 호빗이 답을 못 찾은 질문을 비슷한 것끼리 모았어요 (매일 밤 12시 정리)"
          action={
            <button
              type="button"
              onClick={runNow}
              disabled={running}
              title="밤 12시에 하는 정리를 지금 한 번 해요 (1분쯤 걸릴 수 있어요)"
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-line px-3.5 text-sm font-semibold text-ink-2 hover:bg-card hover:text-ink disabled:opacity-60"
            >
              <Icon name="refresh" className={`h-4 w-4 ${running ? 'animate-spin' : ''}`} />
              {running ? '정리 중…' : '지금 정리'}
            </button>
          }
          left={
            <>
              <Segmented
                options={[['topic', '주제별'], ['list', '목록']] as const}
                value={view}
                onChange={setView}
              />
              <Segmented
                options={(['open', 'done', 'dismissed'] as const).map((s) => [s, `${STATUS_LABEL[s]} ${counts[s] ?? 0}`] as const)}
                value={status}
                onChange={setStatus}
              />
              {view === 'list' && (
                <Select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as FaqCandidateSort)}
                  aria-label="정렬"
                  className="max-w-full rounded-xl border-2 border-line p-2 focus:outline-none focus:ring-2 focus:ring-accent-ink/40"
                >
                  <option value="count">많이 물은 순</option>
                  <option value="recent">최근 순</option>
                </Select>
              )}
            </>
          }
        />

        {!ready ? (
          shownApi.isPending || shownApi.isFetching ? (
            <ListSkeleton lines={3} />
          ) : (
            <LoadError message="FAQ 후보를 불러오지 못했어요." onRetry={() => shownApi.refetch()} />
          )
        ) : view === 'topic' ? (
          topicData!.topics.length ? (
            <TopicTree topics={topicData!.topics} onStatus={changeStatus} onDelete={deleteItem} />
          ) : (
            <p className="py-16 text-center text-sm text-ink-3">
              {status === 'open' ? '새 FAQ 후보가 없어요. 밤 12시에 그날 못 찾은 질문을 모아요' : `${STATUS_LABEL[status]}한 후보가 없어요`}
            </p>
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
