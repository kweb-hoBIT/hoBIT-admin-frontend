import React, { useCallback, useEffect, useState } from 'react';
import { chatApi, CrawlPage, CrawlPreview, CrawlResponse, CrawlRun } from '../../api/chat';
import { useChat } from '../Chat/ChatProvider';
import { appAlert, appConfirm } from '../ui/Dialog';
import { Switch } from './ChatFeatures';

/**
 * 관리 > 챗봇 설정 > 정기 수집 — 언제 무엇을 모으는지, 최근 결과, 관리자가 더한 학교 페이지
 * 더한 페이지는 매일 04:30 전체 수집 때 본문을 읽어 색인 (RAG collector/custom_pages.py). 학교 도메인(korea.ac.kr)만
 * 바꾸면 바로 저장 (카테고리 순서처럼 '저장' 버튼 없이), 바꾸기는 행정실·개발자 계정만
 */

const SCOPE_LABEL: Record<string, string> = { boards: '게시판', static: '안내 페이지', all: '전체' };

const BASE_SOURCES: { name: string; host: string; what: string; live?: boolean }[] = [
  { name: '정보대학 홈페이지', host: 'info.korea.ac.kr', what: '공지·장학·행사·진로 게시판과 안내 페이지 전체 (첨부파일 포함)' },
  { name: '학사일정', host: 'korea.ac.kr', what: '학교 학사일정 (이번·다음 학기)' },
  { name: '학교생활 안내', host: 'korea.ac.kr', what: '체육·편의시설·도서관·식당·셔틀·주차·상담 등 21쪽' },
  { name: '관리자 사이트 FAQ', host: '이 사이트', what: 'FAQ·선배 FAQ (저장하면 바로, 전체 수집 때 한 번 더)' },
  { name: '학식·셔틀 시간표·주변 장소', host: '그때그때', what: '질문이 오면 바로 읽어요 (수집하지 않음)', live: true },
];

const when = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';

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

const Block: React.FC<{ title: string; desc?: string; children: React.ReactNode }> = ({ title, desc, children }) => (
  <div className="rounded-2xl border border-line p-4 sm:p-5">
    <h5 className="font-semibold text-ink">{title}</h5>
    {desc && <p className="mt-0.5 text-sm text-ink-3">{desc}</p>}
    <div className="mt-3">{children}</div>
  </div>
);

const CrawlSettings: React.FC = () => {
  const { role } = useChat();
  const canEdit = role === 'staff';
  const [data, setData] = useState<CrawlResponse | null>(null);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState<CrawlPreview | null>(null);
  const [previewErr, setPreviewErr] = useState('');
  const [checking, setChecking] = useState(false);

  const load = useCallback(async () => {
    try {
      setData(await chatApi.getCrawl());
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  if (failed) return <section className="panel mt-4 p-4 text-sm text-ink-3 sm:p-6">정기 수집 정보를 불러오지 못했어요.</section>;
  if (!data) return <section className="panel mt-4 h-40 animate-pulse p-4 sm:p-6" />;

  const savePages = async (pages: CrawlPage[]) => {
    setBusy(true);
    try {
      setData(await chatApi.setCrawlPages(pages));
      return true;
    } catch (e) {
      appAlert(errText(e));
      return false;
    } finally {
      setBusy(false);
    }
  };

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
    const ok = await savePages([...data.pages, { url: url.trim(), title: title.trim(), enabled: true }]);
    if (ok) {
      setUrl('');
      setTitle('');
      setPreview(null);
    }
  };

  const latest = data.status?.latest;
  const runs = data.status?.runs ?? [];
  const pageErrors = runs.find((r) => r.custom_pages)?.custom_pages?.errors ?? {};

  return (
    <section className="panel mt-4 p-4 sm:p-6">
      <h4 className="text-xl font-bold text-ink">정기 수집</h4>
      <p className="mt-1 text-sm text-ink-3">
        호빗이 답할 때 쓰는 자료를 정해진 시간마다 학교 홈페이지에서 다시 모아요.
        {!canEdit && ' (페이지 더하기는 행정실·개발자 계정만 할 수 있어요)'}
      </p>

      <div className="mt-5 grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Block title="수집 시간" desc="서버가 한국 시간 기준으로 자동으로 돌려요.">
            <ul className="divide-y divide-line">
              {data.schedule.map((s) => (
                <li key={s.when} className="flex flex-col gap-0.5 py-2 first:pt-0 last:pb-0 sm:flex-row sm:gap-4">
                  <span className="w-44 shrink-0 font-semibold text-ink">{s.when}</span>
                  <span className="text-sm text-ink-2">{s.what}</span>
                </li>
              ))}
            </ul>
            {latest?.available ? (
              <p className={`mt-3 rounded-xl px-3 py-2 text-sm ${latest.ok ? 'bg-success-soft text-ink-2' : 'bg-warn-soft text-warn'}`}>
                마지막 수집 {when(latest.finished_at)} ({SCOPE_LABEL[latest.scope ?? ''] ?? latest.scope}) ·{' '}
                {latest.ok ? '문제 없음' : `문제 ${latest.problems?.length ?? 0}건 — ${latest.problems?.join(' / ')}`}
              </p>
            ) : (
              <p className="mt-3 text-sm text-ink-3">{data.status ? '아직 수집 기록이 없어요.' : '답변 서버에 연결하지 못해 수집 기록을 못 가져왔어요.'}</p>
            )}
          </Block>

          <Block title="최근 수집 기록" desc="오늘과 어제 돌린 기록이에요. 15분 확인은 새 글이 있을 때만 남아요.">
            {runs.length === 0 ? (
              <p className="text-sm text-ink-3">기록이 없어요.</p>
            ) : (
              <ul className="divide-y divide-line">
                {runs.map((r) => (
                  <li key={`${r.started_at}-${r.scope}`} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2 text-sm first:pt-0 last:pb-0">
                    <span className="w-24 shrink-0 tabular-nums text-ink-3">{when(r.started_at)}</span>
                    <span className="rounded-full bg-card px-2 py-0.5 text-xs font-semibold text-ink-2">{SCOPE_LABEL[r.scope ?? ''] ?? r.scope}</span>
                    <span className="text-ink-2">{changesText(r.changes)}</span>
                    {r.problems.length > 0 && (
                      <span className="rounded-full bg-warn-soft px-2 py-0.5 text-xs font-semibold text-warn" title={r.problems.join('\n')}>
                        문제 {r.problems.length}건
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Block>

          <Block title="기본 수집 대상" desc="코드에 정해져 있어 여기서 바꾸지 않아요.">
            <ul className="divide-y divide-line">
              {BASE_SOURCES.map((s) => (
                <li key={s.name} className="py-2 first:pt-0 last:pb-0">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-ink">{s.name}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${s.live ? 'bg-accent/10 text-accent-ink' : 'bg-card text-ink-3'}`}>{s.host}</span>
                  </p>
                  <p className="mt-0.5 text-sm text-ink-3">{s.what}</p>
                </li>
              ))}
            </ul>
          </Block>
        </div>

        <Block
          title={`더한 페이지 ${data.pages.length}/${data.maxPages}`}
          desc="학교 사이트(korea.ac.kr)의 안내 페이지를 더하면 매일 04:30 전체 수집 때 본문을 읽어 답변 자료에 넣어요. 사이트가 자동 수집을 막아 둔 페이지(예: 도서관)는 읽지 않아요."
        >
          {canEdit && (
            <div className="rounded-xl bg-card p-3">
              <label className="block text-sm font-semibold text-ink-2" htmlFor="crawl-url">
                페이지 주소
              </label>
              <input
                id="crawl-url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setPreview(null);
                  setPreviewErr('');
                }}
                placeholder="https://www.korea.ac.kr/ko/510/subview.do"
                inputMode="url"
                className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm"
              />
              <label className="mt-2 block text-sm font-semibold text-ink-2" htmlFor="crawl-title">
                이름 <span className="font-normal text-ink-3">(비우면 페이지 제목)</span>
              </label>
              <input
                id="crawl-title"
                value={title}
                maxLength={60}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="체육시설"
                className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm"
              />
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={check}
                  disabled={!url.trim() || checking || busy}
                  className="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm font-semibold text-ink-2 disabled:opacity-50"
                >
                  {checking ? '읽는 중…' : '미리 보기'}
                </button>
                <button
                  type="button"
                  onClick={add}
                  disabled={!preview || busy || data.pages.length >= data.maxPages}
                  className="rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
                  title={!preview ? '먼저 미리 보기로 본문이 잘 읽히는지 확인해 주세요' : undefined}
                >
                  더하기
                </button>
                {!preview && !previewErr && <span className="text-xs text-ink-3">미리 보기로 본문이 잘 읽히는지 확인한 뒤 더해요.</span>}
              </div>
              {previewErr && <p className="mt-2 text-sm text-danger">{previewErr}</p>}
              {preview && (
                <div className="mt-3 rounded-lg border border-line bg-surface p-3">
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
                  <Switch
                    on={p.enabled}
                    disabled={!canEdit || busy}
                    label={`${p.title || p.url} 수집`}
                    onChange={(v) => savePages(data.pages.map((q, j) => (j === i ? { ...q, enabled: v } : q)))}
                  />
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
                          savePages(data.pages.filter((_, j) => j !== i));
                        }
                      }}
                      className="shrink-0 rounded-lg px-2 py-1 text-sm text-ink-3 hover:bg-card hover:text-danger disabled:opacity-50"
                    >
                      빼기
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          {data.updatedAt && (
            <p className="mt-3 text-xs text-ink-3">
              마지막 변경 {new Date(data.updatedAt).toLocaleString('ko-KR')}
              {data.updatedBy ? ` · ${data.updatedBy}` : ''} — 다음 전체 수집(매일 04:30)부터 답변에 반영돼요.
            </p>
          )}
        </Block>
      </div>
    </section>
  );
};

export default CrawlSettings;
