import React, { useCallback, useEffect, useState } from 'react';
import { chatApi, CrawlPreview, CrawlResponse, CrawlRun, CrawlSchedule, CrawlSources } from '../../api/chat';
import { useChat } from '../Chat/ChatProvider';
import { appAlert, appConfirm } from '../ui/Dialog';
import { Switch } from './ChatFeatures';

/**
 * 관리 > 챗봇 설정 > 정기 수집 — 일정·수집 대상·더한 학교 페이지·최근 기록
 * - 일정: 서버 crontab이 5분마다 이 값을 받아 지금 돌릴 수집을 정함 (hoBIT-backend deploy/beta/crawl_tick.py) → '일정 저장'
 * - 대상·더한 페이지: 바꾸면 바로 저장. 끈 대상은 다시 받지 않을 뿐, 이미 모은 자료는 그대로 답변에 쓰임
 * 바꾸기는 행정실·개발자 계정만 (채팅 서버도 같은 기준)
 */

const SCOPE_LABEL: Record<string, string> = { boards: '게시판', static: '안내 페이지', all: '전체' };
const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

const SOURCES: { key: keyof CrawlSources; name: string; host: string; what: string }[] = [
  { key: 'boards', name: '정보대학 게시판', host: 'info.korea.ac.kr', what: '공지·장학·행사·진로 게시판 (첨부파일 포함). 끄면 새 공지 확인·게시판 수집도 쉬어요.' },
  { key: 'infoPages', name: '정보대학 안내 페이지', host: 'info.korea.ac.kr', what: '학과·교육과정·졸업·교수진 등 게시판이 아닌 페이지 전체' },
  { key: 'registrar', name: '학사일정', host: 'korea.ac.kr', what: '학교 학사일정 (이번·다음 학기)' },
  { key: 'campusLife', name: '학교생활 안내', host: 'korea.ac.kr', what: '체육·편의시설·도서관·식당·셔틀·주차·상담 등 21쪽' },
  { key: 'customPages', name: '더한 페이지', host: '오른쪽 목록', what: '관리자가 더한 학교 페이지 전체를 한 번에 켜고 꺼요.' },
];

const pad = (n: number) => String(n).padStart(2, '0');
/** '11/10 18:28' — 한 줄 */
const short = (iso?: string | null) => {
  if (!iso) return '-';
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
/** 시각 칸 — 5분 단위로 맞춤 (서버가 5분마다 확인) */
const round5 = (v: string) => {
  const [h, m] = v.split(':').map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return '';
  const mm = Math.round(m / 5) * 5;
  return mm === 60 ? `${pad((h + 1) % 24)}:00` : `${pad(h)}:${pad(mm)}`;
};
const sameSchedule = (a: CrawlSchedule, b: CrawlSchedule) => JSON.stringify(a) === JSON.stringify(b);

const ERROR_TEXT: Record<string, string> = {
  invalid_url: '주소를 다시 확인해 주세요 (https://로 시작하는 주소).',
  not_school: '학교 사이트(korea.ac.kr)의 페이지만 더할 수 있어요.',
  already_crawled: '정보대학 홈페이지는 이미 전부 수집하고 있어요.',
  too_many_pages: '페이지는 50개까지 더할 수 있어요.',
};
const errText = (e: unknown) => {
  const code = (e as { code?: string })?.code;
  return (code && ERROR_TEXT[code]) || (e as Error)?.message || '저장하지 못했어요.';
};

const changesText = (c: CrawlRun['changes']) => {
  const parts = [
    c.added ? `새 글 ${c.added}` : '',
    c.updated ? `바뀜 ${c.updated}` : '',
    c.deleted ? `지워짐 ${c.deleted}` : '',
    c.restored ? `되살림 ${c.restored}` : '',
  ].filter(Boolean);
  return parts.length ? parts.join(' · ') : '바뀐 것 없음';
};

const Block: React.FC<{ title: React.ReactNode; desc?: string; right?: React.ReactNode; children: React.ReactNode }> = ({ title, desc, right, children }) => (
  <div className="rounded-2xl border border-line p-4 sm:p-5">
    <div className="flex flex-wrap items-start justify-between gap-2">
      <div className="min-w-0">
        <h5 className="font-semibold text-ink">{title}</h5>
        {desc && <p className="mt-0.5 text-sm text-ink-3">{desc}</p>}
      </div>
      {right}
    </div>
    <div className="mt-3">{children}</div>
  </div>
);

/** 일정 한 줄 — 이름 왼쪽, 고르는 칸 오른쪽 */
const Line: React.FC<{ title: string; help: string; children: React.ReactNode }> = ({ title, help, children }) => (
  <div className="flex flex-col gap-2 border-t border-line py-3 first:border-t-0 first:pt-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
    <div className="min-w-0">
      <p className="font-semibold text-ink">{title}</p>
      <p className="mt-0.5 text-sm text-ink-3">{help}</p>
    </div>
    <div className="flex shrink-0 flex-wrap items-center gap-2">{children}</div>
  </div>
);

const selectCls = 'rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink disabled:opacity-60';

const CrawlSettings: React.FC = () => {
  const { role } = useChat();
  const canEdit = role === 'staff';
  const [data, setData] = useState<CrawlResponse | null>(null);
  const [draft, setDraft] = useState<CrawlSchedule | null>(null);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState<CrawlPreview | null>(null);
  const [previewErr, setPreviewErr] = useState('');
  const [checking, setChecking] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await chatApi.getCrawl();
      setData(r);
      setDraft(r.schedule);
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  if (failed) return <section className="panel mt-4 p-4 text-sm text-ink-3 sm:p-6">정기 수집 정보를 불러오지 못했어요.</section>;
  if (!data || !draft) return <section className="panel mt-4 h-40 animate-pulse p-4 sm:p-6" />;

  const put = async (body: Parameters<typeof chatApi.setCrawl>[0]) => {
    setBusy(true);
    try {
      const r = await chatApi.setCrawl(body);
      setData(r);
      if (body.schedule) setDraft(r.schedule); // 일정이 아닌 칸을 바꿀 때는 고치던 일정을 그대로 둠
      return true;
    } catch (e) {
      appAlert(errText(e));
      return false;
    } finally {
      setBusy(false);
    }
  };
  const setS = <K extends keyof CrawlSchedule>(k: K, v: CrawlSchedule[K]) => setDraft({ ...draft, [k]: v });
  const dirty = !sameSchedule(draft, data.schedule);
  const lock = !canEdit || busy;

  const check = async () => {
    setChecking(true);
    setPreview(null);
    setPreviewErr('');
    try {
      const p = await chatApi.previewCrawlPage(url.trim());
      setPreview(p);
      if (!title.trim() && p.title) setTitle(p.title);
    } catch (e) {
      setPreviewErr(errText(e));
    } finally {
      setChecking(false);
    }
  };
  const add = async () => {
    if (await put({ pages: [...data.pages, { url: url.trim(), title: title.trim(), enabled: true }] })) {
      setUrl('');
      setTitle('');
      setPreview(null);
    }
  };

  const latest = data.status?.latest;
  const runs = data.status?.runs ?? [];
  const pageErrors = runs.find((r) => r.custom_pages)?.custom_pages?.errors ?? {};
  // 서버가 최근 10분 안에 일정을 받아 갔는지 (crontab이 crawl-tick 방식인지)
  const ticking = !!data.tickAt && Date.now() - new Date(data.tickAt).getTime() < 10 * 60_000;

  return (
    <section className="panel mt-4 p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-xl font-bold text-ink">정기 수집</h4>
          <p className="mt-1 text-sm text-ink-3">
            호빗이 답할 때 쓰는 자료를 정해진 시간마다 학교 홈페이지에서 다시 모아요.
            {!canEdit && ' (바꾸기는 행정실·개발자 계정만 할 수 있어요)'}
          </p>
        </div>
        {latest?.available && (
          <span className={`shrink-0 rounded-xl px-3 py-1.5 text-sm ${latest.ok ? 'bg-success-soft text-ink-2' : 'bg-warn-soft text-warn'}`}>
            마지막 수집 {short(latest.finished_at)} · {SCOPE_LABEL[latest.scope ?? ''] ?? latest.scope} ·{' '}
            {latest.ok ? '문제 없음' : `문제 ${latest.problems?.length ?? 0}건`}
          </span>
        )}
      </div>

      <div className="mt-5 grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Block
            title="수집 일정"
            desc="한국 시간 기준, 5분 단위예요. 저장하면 다음 5분 안에 적용돼요."
            right={
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ticking ? 'bg-success-soft text-success' : 'bg-warn-soft text-warn'}`}>
                {ticking ? `서버 적용 중 · ${short(data.tickAt)} 확인` : '서버 확인 기록 없음'}
              </span>
            }
          >
            <Line title="새 공지 확인" help="정보대학 공지·장학 게시판 첫 페이지만 보고, 새 글이 있을 때만 게시판을 수집해요.">
              <select aria-label="새 공지 확인 간격" value={draft.quickMin} disabled={lock} onChange={(e) => setS('quickMin', Number(e.target.value))} className={selectCls}>
                {data.options.quickMin.map((m) => (
                  <option key={m} value={m}>
                    {m ? `${m}분마다` : '끔'}
                  </option>
                ))}
              </select>
            </Line>
            <Line title="게시판 전체 수집" help="공지·장학·행사·진로 게시판을 모두 다시 봐요 (매시 20분).">
              <select aria-label="게시판 수집 간격" value={draft.boardsHours} disabled={lock} onChange={(e) => setS('boardsHours', Number(e.target.value))} className={selectCls}>
                {data.options.boardsHours.map((h) => (
                  <option key={h} value={h}>
                    {h ? (h === 24 ? '하루 한 번 (00:20)' : `${h}시간마다`) : '끔'}
                  </option>
                ))}
              </select>
            </Line>
            <Line title="전체 수집" help="게시판·안내 페이지·학사일정·학교생활 안내·FAQ·더한 페이지를 모두 다시 모아요 (10분쯤 걸려요).">
              <Switch on={!!draft.allTime} disabled={lock} label="매일 전체 수집" onChange={(v) => setS('allTime', v ? data.defaults.schedule.allTime : '')} />
              {draft.allTime && (
                <span className="flex items-center gap-1.5 text-sm text-ink-2">
                  매일
                  <input
                    type="time"
                    step={300}
                    aria-label="전체 수집 시각"
                    value={draft.allTime}
                    disabled={lock}
                    onChange={(e) => setS('allTime', round5(e.target.value) || data.defaults.schedule.allTime)}
                    className={selectCls}
                  />
                </span>
              )}
            </Line>
            <Line title="추천 질문 점검" help="시작 화면 추천 질문이 지금도 답이 되는지 확인하고, 답 못 하는 질문은 빼요 (약 400원).">
              <select aria-label="점검 요일" value={draft.recDay} disabled={lock} onChange={(e) => setS('recDay', Number(e.target.value))} className={selectCls}>
                <option value={-1}>끔</option>
                {DAYS.map((d, i) => (
                  <option key={d} value={i}>
                    매주 {d}요일
                  </option>
                ))}
              </select>
              {draft.recDay >= 0 && (
                <input
                  type="time"
                  step={300}
                  aria-label="점검 시각"
                  value={draft.recTime}
                  disabled={lock}
                  onChange={(e) => setS('recTime', round5(e.target.value) || data.defaults.schedule.recTime)}
                  className={selectCls}
                />
              )}
            </Line>
            {canEdit && (
              <div className="mt-2 flex flex-wrap justify-end gap-2 border-t border-line pt-3">
                <button
                  type="button"
                  onClick={() => setDraft(data.defaults.schedule)}
                  disabled={busy || sameSchedule(draft, data.defaults.schedule)}
                  className="rounded-xl bg-card px-4 py-2 text-sm font-semibold text-ink-2 hover:bg-card-2 disabled:opacity-50"
                >
                  기본값으로
                </button>
                {dirty && (
                  <button type="button" onClick={() => setDraft(data.schedule)} disabled={busy} className="rounded-xl bg-card px-4 py-2 text-sm font-semibold text-ink-2 hover:bg-card-2 disabled:opacity-50">
                    되돌리기
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => put({ schedule: draft })}
                  disabled={busy || !dirty}
                  className="rounded-xl bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-50"
                >
                  {busy ? '저장 중…' : '일정 저장'}
                </button>
              </div>
            )}
            {!ticking && (
              <p className="mt-3 rounded-xl bg-warn-soft px-3 py-2 text-xs text-warn">
                최근 10분 동안 서버가 이 일정을 받아 가지 않았어요. 서버가 예전 고정 일정으로 돌고 있으면 서버에서 <code>beta.sh crawl-auto on</code>을 한 번 실행해 주세요 (배포 직후라면 5분쯤 뒤에 다시 보세요).
              </p>
            )}
          </Block>

          <Block title="수집 대상" desc="끄면 정기 수집 때 다시 받지 않아요. 이미 모은 자료는 그대로 답변에 쓰여요. 바꾸면 바로 저장돼요.">
            <ul className="divide-y divide-line">
              {SOURCES.map((s) => (
                <li key={s.key} className="flex items-center gap-3 py-2.5 first:pt-0">
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2">
                      <span className={`font-semibold ${data.sources[s.key] ? 'text-ink' : 'text-ink-3'}`}>{s.name}</span>
                      <span className="rounded-full bg-card px-2 py-0.5 text-xs text-ink-3">{s.host}</span>
                    </p>
                    <p className="mt-0.5 text-sm text-ink-3">{s.what}</p>
                  </div>
                  <Switch on={data.sources[s.key]} disabled={lock} label={`${s.name} 수집`} onChange={(v) => put({ sources: { [s.key]: v } })} />
                </li>
              ))}
              <li className="flex items-center gap-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink">관리자 사이트 FAQ·선배 FAQ</p>
                  <p className="mt-0.5 text-sm text-ink-3">저장하면 바로 반영돼요. 수집 때 한 번 더 맞춰요.</p>
                </div>
                <span className="rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-success">항상</span>
              </li>
              <li className="py-2.5 last:pb-0">
                <p className="font-semibold text-ink">학식·셔틀 시간표·주변 장소</p>
                <p className="mt-0.5 text-sm text-ink-3">수집하지 않고 질문이 올 때마다 바로 읽어요. 학식·주변 장소는 위 챗봇 설정에서 끌 수 있어요.</p>
              </li>
            </ul>
          </Block>
        </div>

        <div className="flex flex-col gap-4">
          <Block
            title={`더한 페이지 ${data.pages.length}/${data.maxPages}`}
            desc="학교 사이트(korea.ac.kr)의 안내 페이지를 더하면 전체 수집 때 본문을 읽어 답변 자료에 넣어요. 사이트가 자동 수집을 막아 둔 페이지(예: 도서관)는 읽지 않아요."
          >
            {!data.sources.customPages && <p className="mb-3 rounded-xl bg-warn-soft px-3 py-2 text-sm text-warn">'수집 대상'에서 더한 페이지를 꺼 두어서 지금은 수집하지 않아요.</p>}
            {canEdit && (
              <div className="rounded-xl bg-card p-3">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                  <label className="block text-sm font-semibold text-ink-2">
                    페이지 주소
                    <input
                      value={url}
                      onChange={(e) => {
                        setUrl(e.target.value);
                        setPreview(null);
                        setPreviewErr('');
                      }}
                      placeholder="https://www.korea.ac.kr/ko/510/subview.do"
                      inputMode="url"
                      className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm font-normal"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-ink-2">
                    이름 <span className="font-normal text-ink-3">(비우면 페이지 제목)</span>
                    <input
                      value={title}
                      maxLength={60}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="체육시설"
                      className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm font-normal"
                    />
                  </label>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={check}
                    disabled={!url.trim() || checking || busy}
                    className="rounded-xl border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink-2 hover:bg-card-2 disabled:opacity-50"
                  >
                    {checking ? '읽는 중…' : '미리 보기'}
                  </button>
                  <button
                    type="button"
                    onClick={add}
                    disabled={!preview || busy || data.pages.length >= data.maxPages}
                    className="rounded-xl bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-50"
                    title={!preview ? '먼저 미리 보기로 본문이 잘 읽히는지 확인해 주세요' : undefined}
                  >
                    더하기
                  </button>
                  {!preview && !previewErr && <span className="text-xs text-ink-3">미리 보기로 본문이 잘 읽히는지 확인한 뒤 더해요.</span>}
                </div>
                {previewErr && <p className="mt-2 text-sm text-danger">{previewErr}</p>}
                {preview && (
                  <div className="mt-3 rounded-xl border border-line bg-surface p-3">
                    <p className="text-sm font-semibold text-ink">
                      {preview.title || '(제목 없음)'}{' '}
                      <span className="font-normal text-ink-3">
                        · 글 {preview.chars.toLocaleString('ko-KR')}자 · 문서 {preview.sections}개로 나눠 넣어요
                      </span>
                    </p>
                    <p className="mt-1.5 max-h-48 overflow-auto whitespace-pre-wrap text-xs leading-relaxed text-ink-2">{preview.text}</p>
                  </div>
                )}
              </div>
            )}

            {data.pages.length === 0 ? (
              <p className="mt-3 rounded-xl border border-dashed border-line p-5 text-center text-sm text-ink-3">아직 더한 페이지가 없어요</p>
            ) : (
              <ul className="mt-3 divide-y divide-line">
                {data.pages.map((p, i) => (
                  <li key={p.url} className="flex items-center gap-3 py-2.5">
                    <Switch on={p.enabled} disabled={lock} label={`${p.title || p.url} 수집`} onChange={(v) => put({ pages: data.pages.map((q, j) => (j === i ? { ...q, enabled: v } : q)) })} />
                    <div className="min-w-0 flex-1">
                      <p className={`truncate font-semibold ${p.enabled ? 'text-ink' : 'text-ink-3'}`}>{p.title || '(이름 없음)'}</p>
                      <a href={p.url} target="_blank" rel="noreferrer" className="block truncate text-xs text-link underline">
                        {p.url}
                      </a>
                      {pageErrors[p.url] && <p className="mt-0.5 text-xs text-warn">지난 수집 때 못 읽음: {pageErrors[p.url]}</p>}
                    </div>
                    {canEdit && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={async () => {
                          if (await appConfirm(`'${p.title || p.url}'을(를) 수집 목록에서 뺄까요? 다음 전체 수집 때 답변 자료에서도 빠져요.`, { danger: true, confirmLabel: '빼기' })) {
                            put({ pages: data.pages.filter((_, j) => j !== i) });
                          }
                        }}
                        className="shrink-0 rounded-xl px-3 py-1.5 text-sm text-ink-3 hover:bg-card hover:text-danger disabled:opacity-50"
                      >
                        빼기
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Block>

          <Block title="최근 수집 기록" desc="오늘과 어제 기록이에요. 새 공지 확인은 새 글이 있어 게시판을 수집했을 때만 남아요.">
            {runs.length === 0 ? (
              <p className="text-sm text-ink-3">{data.status ? '기록이 없어요.' : '답변 서버에 연결하지 못해 기록을 못 가져왔어요.'}</p>
            ) : (
              <ul className="divide-y divide-line">
                {runs.map((r) => (
                  <li key={`${r.started_at}-${r.scope}`} className="flex items-center gap-3 py-2 text-sm first:pt-0 last:pb-0">
                    <span className="w-[5.5rem] shrink-0 whitespace-nowrap tabular-nums text-ink-3">{short(r.started_at)}</span>
                    <span className="w-[4.5rem] shrink-0">
                      <span className="rounded-full bg-card px-2 py-0.5 text-xs font-semibold text-ink-2">{SCOPE_LABEL[r.scope ?? ''] ?? r.scope}</span>
                    </span>
                    <span className={`min-w-0 flex-1 truncate ${r.changes.added || r.changes.updated || r.changes.deleted ? 'font-semibold text-ink' : 'text-ink-3'}`}>{changesText(r.changes)}</span>
                    {r.problems.length > 0 && (
                      <span className="shrink-0 rounded-full bg-warn-soft px-2 py-0.5 text-xs font-semibold text-warn" title={r.problems.join('\n')}>
                        문제 {r.problems.length}건
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Block>
        </div>
      </div>
      {data.updatedAt && (
        <p className="mt-3 text-xs text-ink-3">
          마지막 변경 {new Date(data.updatedAt).toLocaleString('ko-KR')}
          {data.updatedBy ? ` · ${data.updatedBy}` : ''}
        </p>
      )}
    </section>
  );
};

export default CrawlSettings;
