import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHobitMutateDeleteApi } from '../../../hooks/hobitAdmin';
import { BulkDeleteAdminLogsRequest, BulkDeleteAdminLogsResponse } from '../../../types/adminLog';
import { selectAuth } from '../../../redux/authSlice';
import envs from '../../../config/envs';

import { appAlert, appConfirm } from '../../ui/Dialog';
interface BulkDeleteAdminLogModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const BulkDeleteAdminLogModal: React.FC<BulkDeleteAdminLogModalProps> = ({ onClose, onSuccess }) => {
  const { user_id } = useSelector(selectAuth);
  const [period, setPeriod] = useState<'all' | '6months' | '12months' | 'custom'>('all');
  const [customDate, setCustomDate] = useState('');
  const [previewCount, setPreviewCount] = useState<number | null>(null);
  const [isCountLoading, setIsCountLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const bulkDeleteApi = useHobitMutateDeleteApi<BulkDeleteAdminLogsRequest, BulkDeleteAdminLogsResponse>('adminlogs/bulk-delete');

  const getBeforeDate = (): string | undefined => {
    if (period === 'all') return undefined;
    
    const now = new Date();
    if (period === '6months') {
      now.setMonth(now.getMonth() - 6);
      return now.toISOString().split('T')[0];
    } else if (period === '12months') {
      now.setMonth(now.getMonth() - 12);
      return now.toISOString().split('T')[0];
    } else if (period === 'custom' && customDate) {
      return customDate;
    }
    return undefined;
  };

  const handlePreviewCount = async () => {
    setIsCountLoading(true);
    try {
      const beforeDate = getBeforeDate();
      const params: any = {};
      
      if (beforeDate) {
        params.before_date = beforeDate;
      }

      const queryString = new URLSearchParams(params).toString();
      const url = queryString 
        ? `${envs.HOBIT_ADMIN_BACKEND_ENDPOINT}/adminlogs/count?${queryString}`
        : `${envs.HOBIT_ADMIN_BACKEND_ENDPOINT}/adminlogs/count`;
        
      const response = await fetch(url, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch count');
      }

      const data = await response.json();
      setPreviewCount(data.data.count);
    } catch (error) {
      console.error('Count preview error:', error);
      appAlert('삭제 예정 건수를 가져오는데 실패했습니다.');
    } finally {
      setIsCountLoading(false);
    }
  };

  const handleDelete = async () => {
    if (previewCount === null) {
      appAlert('먼저 삭제 예정 건수를 확인해주세요.');
      return;
    }

    if (previewCount === 0) {
      appAlert('삭제할 관리자 로그가 없습니다.');
      return;
    }

    const confirmMessage = `정말로 ${previewCount}건의 관리자 로그를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`;
    if (!(await appConfirm(confirmMessage, { danger: true }))) {
      return;
    }

    setIsDeleting(true);
    try {
      const beforeDate = getBeforeDate();
      const body: any = {
        user_id: user_id ? Number(user_id) : 0,
      };
      if (beforeDate) {
        body.before_date = beforeDate;
      }
      
      await bulkDeleteApi({
        body,
      });
      
      appAlert('관리자 로그가 성공적으로 삭제되었습니다.');
      onSuccess();
    } catch (error) {
      console.error('Bulk delete error:', error);
      appAlert('관리자 로그 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-panel max-w-[520px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">관리자 로그 전체 삭제</h2>

        {/* 기간 선택 */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">삭제 기간</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="all"
                checked={period === 'all'}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="mr-2"
              />
              전체
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="6months"
                checked={period === '6months'}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="mr-2"
              />
              6개월 이전
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="12months"
                checked={period === '12months'}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="mr-2"
              />
              12개월 이전
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="custom"
                checked={period === 'custom'}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="mr-2"
              />
              사용자 지정
            </label>
          </div>
          
          {period === 'custom' && (
            <div className="mt-2">
              <label className="block text-sm mb-1">기준 날짜 (이전 데이터 삭제)</label>
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="w-full p-2 border border-line rounded-xl"
              />
            </div>
          )}
        </div>

        {/* 미리보기 */}
        <div className="mb-4">
          <button
            onClick={handlePreviewCount}
            disabled={isCountLoading}
            className="w-full px-4 py-2 bg-accent text-white rounded-xl hover:bg-accent/90 disabled:bg-card-3 font-semibold"
          >
            {isCountLoading ? '확인 중...' : '삭제 예정 건수 확인'}
          </button>
          {previewCount !== null && (
            <div className="mt-2 text-center text-lg font-semibold">
              삭제 예정: <span className="text-danger">{previewCount}건</span>
            </div>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex space-x-2">
          <button
            onClick={handleDelete}
            disabled={isDeleting || previewCount === null || previewCount === 0}
            className="flex-1 px-4 py-2 bg-danger text-white rounded-xl hover:bg-danger/90 disabled:bg-card-3 font-semibold"
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </button>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 bg-card-2 text-ink rounded-xl hover:bg-card-3 font-semibold"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkDeleteAdminLogModal;
