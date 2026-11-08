import React, { useEffect, useRef, useState } from 'react';
import {
  useHobitMutateDeleteApi,
  useHobitMutatePostApi,
  useHobitMutatePutApi,
  useHobitQueryGetApi,
} from '../../hooks/hobitAdmin';
import {
  CreateProfileOptionRequest,
  CreateProfileOptionResponse,
  DeleteProfileOptionRequest,
  DeleteProfileOptionResponse,
  GetProfileOptionsRequest,
  GetProfileOptionsResponse,
  ProfileField,
  ProfileOption,
  UpdateProfileOptionRequest,
  UpdateProfileOptionResponse,
} from '../../types/profileOption';
import { appAlert, appConfirm } from '../ui/Dialog';
import { ChipInput } from '../Keyword/KeywordEditor';

/**
 * 프로필 항목 — 학생이 고르는 학과·전공 유형·학적 상태.
 * 호빗이 1분 안에 읽어 학생 화면 선택지, 질문 속 학과 인식("저 데과인데"), 문서 대상 태그, 검색 필터에 씀.
 */
const SECTIONS: { field: ProfileField; title: string; desc: string; example: string }[] = [
  { field: 'department', title: '학과', desc: '학과마다 다른 교육과정·졸업요건·장학 공지를 가려내는 데 써요.', example: '예: 인공지능학과' },
  { field: 'major_type', title: '전공 유형', desc: '이중전공·부전공 등 이수 기준이 다른 안내를 가려내요.', example: '예: 이중전공' },
  { field: 'student_status', title: '학적 상태', desc: '휴학·편입생 전용 안내를 가려내요.', example: '예: 휴학' },
  { field: 'grad_department', title: '대학원 학과', desc: '학생 화면을 대학원으로 바꿨을 때 고르는 학과예요. 그 학과 대학원 안내를 먼저 찾아요.', example: '예: 뇌공학과' },
];

type Editing = { field: ProfileField; option: ProfileOption | null };

const Editor: React.FC<{ editing: Editing; onClose: () => void; onSaved: () => void }> = ({ editing, onClose, onSaved }) => {
  const { field, option } = editing;
  const section = SECTIONS.find((s) => s.field === field)!;
  const [value, setValue] = useState(option?.value ?? '');
  const [labelEn, setLabelEn] = useState(option?.label_en ?? '');
  const [aliases, setAliases] = useState<string[]>(option?.aliases ?? []);
  const [firstCohort, setFirstCohort] = useState(option?.first_cohort ? String(option.first_cohort) : '');
  const [active, setActive] = useState(option?.active ?? true);
  const [saving, setSaving] = useState(false);
  const firstRef = useRef<HTMLInputElement>(null);
  const createApi = useHobitMutatePostApi<CreateProfileOptionRequest, CreateProfileOptionResponse>('profile-options');
  const updateApi = useHobitMutatePutApi<UpdateProfileOptionRequest, UpdateProfileOptionResponse>('profile-options');
  const renamed = option && value.trim() && value.trim() !== option.value;

  useEffect(() => {
    firstRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const save = async () => {
    const v = value.trim();
    if (!v) return appAlert('이름을 입력해주세요.');
    if (!labelEn.trim()) return appAlert('영어 이름을 입력해주세요.');
    setSaving(true);
    const body = {
      field,
      value: v,
      label_en: labelEn.trim(),
      aliases: aliases.filter((a) => a !== v),
      first_cohort: field === 'department' && firstCohort.trim() ? Number(firstCohort) : null,
      active,
    };
    const res = option ? await updateApi({ params: { id: String(option.id) }, body }) : await createApi({ body });
    setSaving(false);
    if (res.payload?.statusCode === 200) onSaved();
    else appAlert(res.payload?.message || '저장하지 못했어요. 입력을 확인하고 다시 시도해주세요.');
  };

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel max-w-[560px] max-h-[90vh] overflow-y-auto" role="dialog" aria-modal="true">
        <h2>{option ? `${section.title} 수정` : `${section.title} 추가`}</h2>

        <label className="mt-5 block text-sm font-semibold text-ink">이름 (한국어 공식 이름)</label>
        <input
          ref={firstRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={section.example}
          maxLength={100}
          className="mt-1.5 w-full rounded-xl border border-line px-3 py-2.5"
        />
        {renamed && (
          <p className="mt-1.5 text-xs text-warn">
            예전 이름 “{option!.value}”은 다른 이름에 자동으로 남겨요 — 예전 이름으로 된 문서와 이미 저장된 학생 정보도 계속 맞게.
          </p>
        )}

        <label className="mt-5 block text-sm font-semibold text-ink">영어 이름</label>
        <p className="mb-1.5 text-xs text-ink-3">호빗 영어 화면에 보이는 이름</p>
        <input
          value={labelEn}
          onChange={(e) => setLabelEn(e.target.value)}
          placeholder="예: Artificial Intelligence"
          maxLength={100}
          className="w-full rounded-xl border border-line px-3 py-2.5"
        />

        <label className="mt-5 block text-sm font-semibold text-ink">다른 이름</label>
        <p className="mb-1.5 text-xs text-ink-3">
          학생이 부르는 줄임말·예전 이름. “저 데과 23학번이에요”처럼 말해도 알아들어요. Enter나 쉼표로 추가.
        </p>
        <ChipInput value={aliases} onChange={setAliases} placeholder={field === 'department' ? '예: AI학과, 인공지능과' : '다른 이름'} />

        {field === 'department' && (
          <>
            <label className="mt-5 block text-sm font-semibold text-ink">첫 입학 연도 <span className="font-normal text-ink-3">(선택)</span></label>
            <p className="mb-1.5 text-xs text-ink-3">
              신설 학과라면 적어 주세요. 그보다 앞선 학번은 학생 화면에서 고를 수 없고, 그런 조합으로 물으면 정보를 다시 확인하도록 안내해요.
            </p>
            <input
              value={firstCohort}
              onChange={(e) => setFirstCohort(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="예: 2025"
              inputMode="numeric"
              className="w-40 rounded-xl border border-line px-3 py-2.5"
            />
          </>
        )}

        <label className="mt-5 flex items-center gap-2 text-sm font-semibold text-ink">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4" />
          학생 화면 선택지에 보이기
        </label>
        <p className="mt-1 text-xs text-ink-3">숨겨도 질문 속 이름 인식과 검색에는 계속 써요. (없어진 학과는 삭제보다 숨기기를 권해요)</p>

        <div className="mt-6 flex justify-end gap-2 [&>button]:flex-1 sm:[&>button]:flex-none">
          <button type="button" onClick={onClose} className="bg-card px-5 py-2.5 font-semibold text-ink-2 hover:bg-card-2">
            취소
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="bg-accent px-6 py-2.5 font-semibold text-white hover:bg-accent/90 disabled:opacity-60"
          >
            {saving ? '저장 중…' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfileOptionMain: React.FC = () => {
  const api = useHobitQueryGetApi<GetProfileOptionsRequest, GetProfileOptionsResponse>('profile-options');
  const updateApi = useHobitMutatePutApi<UpdateProfileOptionRequest, UpdateProfileOptionResponse>('profile-options');
  const deleteApi = useHobitMutateDeleteApi<DeleteProfileOptionRequest, DeleteProfileOptionResponse>('profile-options');
  const [editing, setEditing] = useState<Editing | null>(null);
  const [busy, setBusy] = useState(false);
  const options = api.data?.payload?.data?.options ?? [];

  const run = async (task: () => Promise<{ payload: { statusCode: number; message?: string } | null }>) => {
    setBusy(true);
    const res = await task();
    setBusy(false);
    if (res.payload?.statusCode === 200) api.refetch();
    else appAlert(res.payload?.message || '저장하지 못했어요. 다시 시도해주세요.');
  };

  const move = (list: ProfileOption[], index: number, dir: -1 | 1) => {
    const ids = list.map((o) => o.id);
    [ids[index], ids[index + dir]] = [ids[index + dir], ids[index]];
    run(() => updateApi({ params: { id: 'order' }, body: { field: list[0].field, ids } }));
  };

  const toggle = (o: ProfileOption) =>
    run(() =>
      updateApi({
        params: { id: String(o.id) },
        body: { field: o.field, value: o.value, label_en: o.label_en, aliases: o.aliases, first_cohort: o.first_cohort, active: !o.active },
      })
    );

  const remove = async (o: ProfileOption) => {
    const msg =
      o.field === 'department'
        ? `“${o.value}”을(를) 삭제할까요?\n이 학과로 정리된 문서·저장된 학생 정보가 있으면 맞지 않게 될 수 있어요. 없어진 학과라면 '숨기기'를 권해요.`
        : `“${o.value}”을(를) 삭제할까요?`;
    if (!(await appConfirm(msg, { danger: true }))) return;
    run(() => deleteApi({ params: { id: String(o.id) } }));
  };

  return (
    <div className="py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-[1.9rem] font-bold text-ink">프로필 항목</h1>
        <p className="text-ink-2">
          학생이 고르는 <b className="text-ink">학과·전공 유형·학적 상태</b> 목록이에요. 학과가 새로 생기거나 이름이 바뀌면 여기서 고쳐 주세요.
        </p>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_340px] items-start gap-4">
        <div className="flex flex-col gap-4">
          {SECTIONS.map((section) => {
            const list = options.filter((o) => o.field === section.field);
            return (
              <section key={section.field} className="panel !my-0">
                <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
                  <div>
                    <h2 className="text-lg font-bold text-ink">{section.title}</h2>
                    <p className="text-sm text-ink-3">{section.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditing({ field: section.field, option: null })}
                    className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90"
                  >
                    + 추가
                  </button>
                </div>
                {api.isLoading ? (
                  <div className="space-y-2 p-5">
                    {[0, 1].map((i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-card" />)}
                  </div>
                ) : (
                  <ul className="divide-y divide-line">
                    {list.map((o, i) => (
                      <li key={o.id} className="group flex items-center gap-4 px-5 py-3 hover:bg-card/50">
                        <div className="flex shrink-0 flex-col">
                          <button
                            type="button"
                            aria-label="위로"
                            disabled={busy || i === 0}
                            onClick={() => move(list, i, -1)}
                            className="px-1 text-xs text-ink-3 hover:text-ink disabled:opacity-30"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            aria-label="아래로"
                            disabled={busy || i === list.length - 1}
                            onClick={() => move(list, i, 1)}
                            className="px-1 text-xs text-ink-3 hover:text-ink disabled:opacity-30"
                          >
                            ▼
                          </button>
                        </div>
                        <div className="w-44 shrink-0">
                          <p className={`font-bold ${o.active ? 'text-ink' : 'text-ink-3 line-through'}`}>{o.value}</p>
                          <p className="text-xs text-ink-3">{o.label_en}</p>
                        </div>
                        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                          {o.aliases.map((a) => (
                            <span key={a} className="rounded-full bg-card px-2.5 py-1 text-xs font-medium text-ink-2">{a}</span>
                          ))}
                          {o.first_cohort && (
                            <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent-ink">
                              {o.first_cohort % 100}학번부터
                            </span>
                          )}
                          {!o.active && <span className="rounded-full bg-card-2 px-2.5 py-1 text-xs font-semibold text-ink-3">숨김</span>}
                        </div>
                        <div className="flex shrink-0 gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => setEditing({ field: section.field, option: o })}
                            className="rounded-full px-3 py-1.5 text-sm font-semibold text-ink hover:bg-card-2"
                          >
                            수정
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => toggle(o)}
                            className="rounded-full px-3 py-1.5 text-sm font-semibold text-ink-2 hover:bg-card-2"
                          >
                            {o.active ? '숨기기' : '보이기'}
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => remove(o)}
                            className="rounded-full px-3 py-1.5 text-sm font-semibold text-danger hover:bg-danger-soft"
                          >
                            삭제
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>

        <section className="sticky top-20 rounded-2xl border border-line bg-surface p-5 text-sm text-ink-2">
          <h2 className="mb-2 font-bold text-ink">어떻게 반영되나요?</h2>
          <ul className="list-disc space-y-1.5 pl-4">
            <li>저장하면 <b className="text-ink">1분 안에</b> 학생 화면 선택지와 질문 인식에 반영돼요.</li>
            <li>
              학과를 추가하거나 이름을 바꾸면, <b className="text-ink">다음 데이터 수집 때</b> 그 이름이 나오는 공지·홈페이지 문서만 다시 정리해 대상 학과를
              붙여요. (게시판 3시간마다, 전체 매일 새벽)
            </li>
            <li>이름을 바꾸면 예전 이름은 ‘다른 이름’에 남아, 예전 이름으로 된 문서도 계속 찾아요.</li>
            <li>학년(1~4)은 고정이고, 학번 선택지는 올해 기준 최근 7개가 자동으로 떠요.</li>
          </ul>
        </section>
      </div>

      {editing && (
        <Editor
          editing={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            api.refetch();
          }}
        />
      )}
    </div>
  );
};

export default ProfileOptionMain;
