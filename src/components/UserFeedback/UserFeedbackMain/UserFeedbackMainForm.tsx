import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { selectUserFeedbackFilter, setUserFeedbackFilterName } from '../../../redux/filterSlice';
import { GetAllUserFeedbackResponse } from '../../../types/feedback';
import UserFeedbackResolvedUpdate from './UserFeedbackResolvedUpdate';
import LanguageBadge from '../../ui/LanguageBadge';
import SelectUserFeedback from './SelectUserFeedback';
import UserFeedbackDelete from './UserFeedbackDelete';
import BulkDeleteFeedbackModal from './BulkDeleteFeedbackModal';
import { useIncremental } from '../../../hooks/useIncremental';
import { useListCache } from '../../../hooks/listCache';
import { ListEnd, ListHeader } from '../../ui/ListKit';
import { revealRef } from '../../ui/motion';


// 한국 시간 — 형식기를 한 번만 만들어 씀 (toLocaleString에 시간대를 주면 부를 때마다 새로 만들어 느림)
const KST = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
});
const formatDateToKST = (dateStr: string) => {
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? dateStr : KST.format(d);
};

interface UserFeedbackMainFormProps {
  userFeedbacks: GetAllUserFeedbackResponse['data']['userFeedbacks'];
}

type LangFilter = 'all' | 'KO' | 'EN';
const LANG_FILTER_KEY = 'hobit-admin-feedback-lang';

const langOf = (feedback: { language?: string }) => ((feedback.language || '').toUpperCase() === 'EN' ? 'EN' : 'KO');

type Feedback = GetAllUserFeedbackResponse['data']['userFeedbacks'][number];

const UserFeedbackMainForm: React.FC<UserFeedbackMainFormProps> = ({ userFeedbacks: feedbacks }) => {
  const dispatch = useDispatch();
  const { storedFilterName } = useSelector((state: RootState) => selectUserFeedbackFilter(state));

  const [filter, setFilter] = useState<'unresolved' | 'resolved'>(
    storedFilterName as 'unresolved' | 'resolved' || 'unresolved'
  );
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  // 피드백을 남긴 화면 언어로 거르기 — 영어 사용자(대부분 외국인 학생) 피드백만 모아 보기
  const [langFilter, setLangFilter] = useState<LangFilter>(() => {
    try {
      return (sessionStorage.getItem(LANG_FILTER_KEY) as LangFilter) || 'all';
    } catch {
      return 'all';
    }
  });
  const changeLangFilter = (next: LangFilter) => {
    setLangFilter(next);
    try {
      sessionStorage.setItem(LANG_FILTER_KEY, next);
    } catch {}
  };

  useEffect(() => {
    dispatch(setUserFeedbackFilterName(filter));
  }, [dispatch, filter]);

  // 거른 목록·개수는 목록이나 거르기가 바뀔 때만 다시 계산
  const { unresolvedCount, langCounts, filteredFeedbacks } = useMemo(() => {
    const inTab = feedbacks.filter((feedback) => feedback.resolved === (filter === 'unresolved' ? 0 : 1));
    const ko = inTab.filter((f) => langOf(f) === 'KO').length;
    return {
      unresolvedCount: feedbacks.filter((feedback) => feedback.resolved === 0).length,
      langCounts: { all: inTab.length, KO: ko, EN: inTab.length - ko } as Record<LangFilter, number>,
      filteredFeedbacks: langFilter === 'all' ? inTab : inTab.filter((feedback) => langOf(feedback) === langFilter),
    };
  }, [feedbacks, filter, langFilter]);

  // 처음 20개, 내려가면 20개씩 더 — 해결 여부·언어를 바꾸면 처음부터
  const { shown, total, hasMore, sentinelRef, listRef } = useIncremental(filteredFeedbacks, `${filter}|${langFilter}`);

  // 완료·보류·삭제는 받아 둔 목록을 바로 고침 — 새로고침하지 않아 지금 탭의 그리던 개수·스크롤 그대로
  // (바뀐 카드는 다른 탭으로 옮겨 가고, 아래 카드가 그 자리를 채움)
  const { patch, refetch } = useListCache();
  const handleResolvedChange = (id: number, resolved: number) => {
    const toggle = (list: Feedback[]) => list.map((f) => (f.user_feedback_id === id ? { ...f, resolved } : f));
    patch<Feedback>('feedbacks/user', 'userFeedbacks', toggle, false); // 서버는 이미 바뀌어 다시 받지 않음
  };
  const handleDeleted = (id: number) =>
    patch<Feedback>('feedbacks/user', 'userFeedbacks', (list) => list.filter((feedback) => feedback.user_feedback_id !== id));

  return (
    <section className="panel">
      <div>
        <div className="p-3 sm:p-6">
          <ListHeader
            title="피드백"
            count={total}
            description="학생이 남긴 피드백이에요"
            action={
              <button
                type="button"
                onClick={() => setShowBulkDeleteModal(true)}
                className="h-10 rounded-xl bg-danger px-4 font-semibold text-white hover:bg-danger/90"
              >
                전체 삭제
              </button>
            }
            left={
              <>
                <SelectUserFeedback filter={filter} onFilterChange={setFilter} unresolvedCount={unresolvedCount} />
                <div className="flex rounded-full bg-card p-1" role="group" aria-label="언어로 거르기">
                  {([
                    ['all', '전체'],
                    ['KO', '한국어'],
                    ['EN', '영어'],
                  ] as [LangFilter, string][]).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={langFilter === value}
                      onClick={() => changeLangFilter(value)}
                      className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors sm:px-3.5 ${
                        langFilter === value ? 'bg-surface text-ink shadow-sm' : 'text-ink-2 hover:text-ink'
                      }`}
                    >
                      {label} <span className={value === 'EN' && langCounts.EN > 0 ? 'text-violet-600 dark:text-violet-300' : 'text-ink-3'}>{langCounts[value]}</span>
                    </button>
                  ))}
                </div>
              </>
            }
          />
        <div>
          <div ref={listRef} className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
            {shown.map((feedback) => (
              <div key={feedback.user_feedback_id} ref={revealRef} className="relative bg-card-2 p-3.5 sm:p-4 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1 break-words">
                    <div className="mb-1.5 flex items-start gap-2">
                      <LanguageBadge language={feedback.language} />
                      <strong className="min-w-0 pt-0.5 leading-snug">
                        {feedback.question_ko ? `피드백 질문: ${feedback.question_ko}` : 'FAQ 생성'}
                      </strong>
                    </div>
                    <div className="flex flex-col gap-0.5 text-sm text-ink-2">
                      {feedback.question_ko && (
                        <div>
                          <strong>유저 질문:</strong> {feedback.user_question ? feedback.user_question : 'X'}
                        </div>
                      )}
                      <div>
                        <strong>피드백 사유:</strong> {feedback.feedback_reason ? feedback.feedback_reason : 'X'}
                      </div>
                      <div>
                        <strong>피드백 상세:</strong> {feedback.feedback_detail && !feedback.feedback_detail.startsWith('Unresolved') ? feedback.feedback_detail : 'X'}
                      </div>
                      <div className="text-ink-3">{formatDateToKST(feedback.created_at)}</div>
                    </div>
                  </div>
                  {/* 오른쪽 위: 완료(보류)·삭제 아이콘 — FAQ 카드와 같은 모양 (예전엔 큰 버튼 줄이 카드 아래 한 줄을 더 차지했음) */}
                  <div className="-mr-1.5 -mt-1.5 flex shrink-0 items-center">
                    <UserFeedbackResolvedUpdate
                      user_feedback_id={feedback.user_feedback_id}
                      initialResolved={feedback.resolved ? 1 : 0}
                      onResolvedChange={handleResolvedChange}
                      compact
                    />
                    <UserFeedbackDelete
                      user_feedback_id={String(feedback.user_feedback_id)}
                      onSuccess={() => handleDeleted(feedback.user_feedback_id)}
                      compact
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

          {total === 0 && <p className="py-16 text-center text-sm text-ink-3">{filter === 'unresolved' ? '해결 안 된 피드백이 없어요' : '해결된 피드백이 없어요'}</p>}
          <ListEnd hasMore={hasMore} total={total} sentinelRef={sentinelRef} />
        </div>
      </div>

      {/* 전체 삭제 모달 */}
      {showBulkDeleteModal && (
        <BulkDeleteFeedbackModal
          onClose={() => setShowBulkDeleteModal(false)}
          onSuccess={() => {
            setShowBulkDeleteModal(false);
            refetch('feedbacks/user'); // 새로고침 대신 목록만 다시 받음
          }}
        />
      )}
    </section>
  );
};

export default UserFeedbackMainForm;
