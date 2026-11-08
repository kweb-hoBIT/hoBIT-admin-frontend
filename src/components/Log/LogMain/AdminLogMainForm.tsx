import React, { useState } from 'react';
import { GetAllAdminLogResponse } from '../../../types/adminLog';
import { useNavigate } from 'react-router-dom';
import BulkDeleteAdminLogModal from './BulkDeleteAdminLogModal';
import { useIncremental } from '../../../hooks/useIncremental';
import { ListEnd, ListHeader, CardFooter } from '../../ui/ListKit';
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

interface AdminLogMainFormProps {
  adminLogs: GetAllAdminLogResponse['data']['adminLogs'];
}

const AdminLogMainForm: React.FC<AdminLogMainFormProps> = ({ adminLogs }) => {
  const navigate = useNavigate();
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  // 처음 20개, 내려가면 20개씩 더
  const { shown, total, hasMore, sentinelRef } = useIncremental(adminLogs);

  const handleLogClick = (log: any) => {
    const path = log.log_type === 'faq_log' ? `/adminlogs/faqlogs/${log.log_id}` : `/adminlogs/seniorfaqlogs/${log.log_id}`;
    navigate(path);
  };

  return (
    <div className="p-3 sm:p-6">
      <div className="p-3 sm:p-6">
        <ListHeader
          title="관리자 로그"
          count={total}
          description="FAQ·선배 FAQ를 누가 언제 바꿨는지 보여요"
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
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
            {shown.map(log => (
              <div
                key={`${log.log_id}-${log.log_type}`}
                ref={revealRef}
                className="list-item-cv relative bg-card-2 p-4 rounded-xl cursor-pointer"
                onClick={() => handleLogClick(log)}
              >
                <div>
                  <div className="mb-2">
                    <strong>수정 유저: {log.username}</strong>
                  </div>
                  <div className="flex flex-col">
                    <div className="mb-1 text-sm text-ink-2">
                      <strong>주요 카테고리:</strong> {log.maincategory}
                    </div>
                    <div className="mb-1 text-sm text-ink-2">
                      <strong>하위 카테고리:</strong> {log.subcategory}
                    </div>
                    {log.log_type === 'faq_log' ? (
                      <div className="mb-1 text-sm text-ink-2">
                        <strong>질문:</strong> {log.question}
                      </div>) : (
                      <div className="mb-1 text-sm text-ink-2">
                        <strong>세부 카테고리 :</strong> {log.detailcategory}
                      </div>
                    )}
                    <div className="mb-1 text-sm text-ink-2">
                      <strong>변경 목적:</strong>
                      <span className={`ml-1 ${
                        log.action_type === '수정' ? 'text-link' :
                        log.action_type === '추가' ? 'text-success' :
                        log.action_type === '삭제' ? 'text-danger' :
                        'text-ink-2'
                      }`}>
                        {log.action_type}
                      </span>
                    </div>
                    <div className="mb-1 text-sm text-ink-2">
                      <strong>변경 시각:</strong> {formatDateToKST(log.created_at)}
                    </div>
                  </div>
                </div>
                <CardFooter onMore={() => handleLogClick(log)} />
              </div>
            ))}
          </div>
        </div>

        {total === 0 && <p className="py-16 text-center text-sm text-ink-3">아직 관리자 로그가 없어요</p>}
        <ListEnd hasMore={hasMore} total={total} sentinelRef={sentinelRef} />
      </div>

      {/* 전체 삭제 모달 */}
      {showBulkDeleteModal && (
        <BulkDeleteAdminLogModal
          onClose={() => setShowBulkDeleteModal(false)}
          onSuccess={() => {
            setShowBulkDeleteModal(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default AdminLogMainForm;
