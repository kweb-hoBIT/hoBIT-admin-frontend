import React, { useState } from 'react';
import { GetAllQuestionLogResponse } from '../../../types/questionLog';
import BulkDeleteQuestionLogModal from './BulkDeleteQuestionLogModal';
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

interface QuestionLogMainFormProps {
  questionLogs: GetAllQuestionLogResponse['data']['questionLogs'];
}

const QuestionLogMainForm: React.FC<QuestionLogMainFormProps> = ({ questionLogs }) => {
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  // 처음 20개, 내려가면 20개씩 더
  const { shown, total, hasMore, sentinelRef, listRef } = useIncremental(questionLogs);
  const { refetch } = useListCache();

  return (
    <div className="p-3 sm:p-6">
      <div className="p-3 sm:p-6">
        <ListHeader
          title="유저 로그"
          count={total}
          description="학생이 hoBIT에 한 질문과 매칭된 FAQ예요"
          action={
            <button
              type="button"
              onClick={() => setShowBulkDeleteModal(true)}
              className="h-10 rounded-xl bg-danger px-4 font-semibold text-white hover:bg-danger/90"
            >
              전체 삭제
            </button>
          }
        />
        <div>
          <div ref={listRef} className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
            {shown.map((log) => (
              <div ref={revealRef} className="list-item-cv relative bg-card-2 p-3.5 sm:p-4 rounded-xl" key={log.question_log_id}>
                <div className="mb-2 break-words">
                  <strong>유저 질문: {log.user_question}</strong>
                </div>
                <div className="flex flex-col">
                  <div className="mb-0.5 break-words text-sm text-ink-2">
                    <strong>매칭된 질문:</strong> {log.faq_question ? log.faq_question : '매칭된 질문이 삭제됨'}
                  </div>
                  <div className="mb-0.5 text-sm text-ink-2">
                    <strong>피드백 점수:</strong> {log.feedback_score ? log.feedback_score : '피드백 점수 없음'}
                  </div>
                  <div className="mb-0.5 text-sm text-ink-2">
                    <strong>질문 시각:</strong> {formatDateToKST(log.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {total === 0 && <p className="py-16 text-center text-sm text-ink-3">아직 유저 로그가 없어요</p>}
        <ListEnd hasMore={hasMore} total={total} sentinelRef={sentinelRef} />
      </div>

      {/* 전체 삭제 모달 */}
      {showBulkDeleteModal && (
        <BulkDeleteQuestionLogModal
          onClose={() => setShowBulkDeleteModal(false)}
          onSuccess={() => {
            setShowBulkDeleteModal(false);
            refetch('questionlogs'); // 새로고침 대신 목록만 다시 받음
          }}
        />
      )}
    </div>
  );
};

export default QuestionLogMainForm;
