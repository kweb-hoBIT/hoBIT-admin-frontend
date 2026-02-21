import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHobitMutateDeleteApi } from '../../../hooks/hobitAdmin';
import { BulkDeleteFeedbacksRequest, BulkDeleteFeedbacksResponse } from '../../../types/feedback';
import { selectAuth } from '../../../redux/authSlice';
import envs from '../../../config/envs';

interface BulkDeleteFeedbackModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const BulkDeleteFeedbackModal: React.FC<BulkDeleteFeedbackModalProps> = ({ onClose, onSuccess }) => {
  const { user_id } = useSelector(selectAuth);
  const [period, setPeriod] = useState<'all' | '6months' | '12months' | 'custom'>('all');
  const [customDate, setCustomDate] = useState('');
  const [includeResolved, setIncludeResolved] = useState(true);
  const [includeUnresolved, setIncludeUnresolved] = useState(true);
  const [previewCount, setPreviewCount] = useState<number | null>(null);
  const [isCountLoading, setIsCountLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const bulkDeleteApi = useHobitMutateDeleteApi<BulkDeleteFeedbacksRequest, BulkDeleteFeedbacksResponse>('feedbacks/bulk-delete');

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
    if (!includeResolved && !includeUnresolved) {
      alert('해결된 피드백 또는 미해결 피드백 중 최소 하나는 선택해야 합니다.');
      return;
    }

    setIsCountLoading(true);
    try {
      const beforeDate = getBeforeDate();
      const params: any = {
        include_resolved: includeResolved,
        include_unresolved: includeUnresolved,
      };
      
      if (beforeDate) {
        params.before_date = beforeDate;
      }

      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${envs.HOBIT_ADMIN_BACKEND_ENDPOINT}/feedbacks/count?${queryString}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch count');
      }

      const data = await response.json();
      setPreviewCount(data.data.count);
    } catch (error) {
      console.error('Count preview error:', error);
      alert('삭제 예정 건수를 가져오는데 실패했습니다.');
    } finally {
      setIsCountLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!includeResolved && !includeUnresolved) {
      alert('해결된 피드백 또는 미해결 피드백 중 최소 하나는 선택해야 합니다.');
      return;
    }

    if (previewCount === null) {
      alert('먼저 삭제 예정 건수를 확인해주세요.');
      return;
    }

    if (previewCount === 0) {
      alert('삭제할 피드백이 없습니다.');
      return;
    }

    const confirmMessage = `정말로 ${previewCount}건의 피드백을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsDeleting(true);
    try {
      const beforeDate = getBeforeDate();
      await bulkDeleteApi({
        body: {
          before_date: beforeDate,
          include_resolved: includeResolved,
          include_unresolved: includeUnresolved,
          user_id: user_id ? Number(user_id) : 0,
        },
      });
      
      alert('피드백이 성공적으로 삭제되었습니다.');
      onSuccess();
    } catch (error) {
      console.error('Bulk delete error:', error);
      alert('피드백 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">피드백 전체 삭제</h2>

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
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          )}
        </div>

        {/* 해결 상태 필터 */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">삭제할 피드백 유형</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeResolved}
                onChange={(e) => setIncludeResolved(e.target.checked)}
                className="mr-2"
              />
              해결된 피드백 포함
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeUnresolved}
                onChange={(e) => setIncludeUnresolved(e.target.checked)}
                className="mr-2"
              />
              미해결 피드백 포함
            </label>
          </div>
        </div>

        {/* 미리보기 */}
        <div className="mb-4">
          <button
            onClick={handlePreviewCount}
            disabled={isCountLoading || (!includeResolved && !includeUnresolved)}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 font-semibold"
          >
            {isCountLoading ? '확인 중...' : '삭제 예정 건수 확인'}
          </button>
          {previewCount !== null && (
            <div className="mt-2 text-center text-lg font-semibold">
              삭제 예정: <span className="text-red-600">{previewCount}건</span>
            </div>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex space-x-2">
          <button
            onClick={handleDelete}
            disabled={isDeleting || previewCount === null || previewCount === 0}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-300 font-semibold"
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </button>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 font-semibold"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkDeleteFeedbackModal;
