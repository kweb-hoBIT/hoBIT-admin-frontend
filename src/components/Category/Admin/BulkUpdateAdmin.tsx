import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { selectAuth } from '../../../redux/authSlice';
import { useHobitMutatePutApi, useHobitQueryGetApi } from '../../../hooks/hobitAdmin';
import { BulkUpdateAdminRequest, BulkUpdateAdminResponse, GetAllAdminsRequest, GetAllAdminsResponse } from '../../../types/admin';

import { appAlert } from '../../ui/Dialog';
const BulkUpdateAdmin: React.FC = () => {
  const { user_id } = useSelector((state: RootState) => selectAuth(state));
  const [oldAdmin, setOldAdmin] = useState('');
  const [newAdmin, setNewAdmin] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [adminList, setAdminList] = useState<string[]>([]);

  const bulkUpdateAdminApi = useHobitMutatePutApi<BulkUpdateAdminRequest, BulkUpdateAdminResponse>(
    'admins/bulk-update'
  );

  const getAllAdminsApi = useHobitQueryGetApi<GetAllAdminsRequest, GetAllAdminsResponse>('admins');

  useEffect(() => {
    if (getAllAdminsApi.data?.payload?.statusCode === 200) {
      setAdminList(getAllAdminsApi.data.payload.data.admins);
    }
  }, [getAllAdminsApi.data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!oldAdmin || !newAdmin) {
      appAlert('변경 전 관리자와 변경 후 관리자를 모두 입력해주세요.');
      return;
    }

    setShowConfirmPopup(true);
  };

  const handleConfirmUpdate = async () => {
    setIsUpdating(true);
    setShowConfirmPopup(false);

    try {
      const response = await bulkUpdateAdminApi({
        body: {
          old_admin: oldAdmin,
          new_admin: newAdmin,
          user_id: Number(user_id),
        },
      });

      if (response.payload?.statusCode === 200) {
        const { updated_faqs } = response.payload.data;
        appAlert(
          `관리자가 성공적으로 변경되었습니다!\n\n` +
          `변경된 FAQ: ${updated_faqs}건`
        );
        setOldAdmin('');
        setNewAdmin('');
      } else {
        appAlert('관리자 변경 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('관리자 변경 오류:', error);
      appAlert('관리자 변경 중 오류가 발생했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAdminSelect = (admin: string) => {
    setOldAdmin(admin);
    setShowDropdown(false);
  };

  const filteredAdmins = oldAdmin
    ? adminList.filter((admin) =>
        admin.toLowerCase().includes(oldAdmin.toLowerCase())
      )
    : adminList;

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4.5rem)] py-10">
      <div className="bg-surface p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-ink">
          관리자 전체 변경
        </h2>
        <p className="text-sm text-ink-2 mb-6 text-center">
          모든 FAQ의 답변에서 특정 관리자를 일괄 변경합니다.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 변경 전 관리자 */}
          <div className="relative">
            <label className="block text-sm font-medium text-ink mb-2">
              변경 전 관리자
            </label>
            <input
              type="text"
              value={oldAdmin}
              onChange={(e) => {
                setOldAdmin(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              placeholder="홍길동"
              className="w-full px-4 py-2 border border-line rounded-xl focus:ring-2 focus:ring-accent-ink/40 focus:border-transparent"
              disabled={isUpdating}
            />
            
            {/* 드롭다운 */}
            {showDropdown && filteredAdmins.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-surface border border-line rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {filteredAdmins.map((admin, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleAdminSelect(admin)}
                    className="w-full text-left px-4 py-2 hover:bg-card text-ink"
                  >
                    {admin}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 변경 후 관리자 */}
          <div>
            <label className="block text-sm font-medium text-ink mb-2">
              변경 후 관리자
            </label>
            <input
              type="text"
              value={newAdmin}
              onChange={(e) => setNewAdmin(e.target.value)}
              placeholder="김철수"
              className="w-full px-4 py-2 border border-line rounded-xl focus:ring-2 focus:ring-accent-ink/40 focus:border-transparent"
              disabled={isUpdating}
            />
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 ${
              isUpdating
                ? 'bg-card-3 cursor-not-allowed'
                : 'bg-accent hover:bg-accent/90 transform hover:scale-105'
            }`}
          >
            {isUpdating ? '변경 중...' : '관리자 변경'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-warn-soft border border-warn/40 rounded-xl">
          <p className="text-xs text-warn">
            <strong>⚠️ 주의:</strong> 이 작업은 되돌릴 수 없습니다.
          </p>
        </div>
      </div>

      {/* 확인 팝업 */}
      {showConfirmPopup && (
        <div className="modal-overlay">
          <div className="modal-panel max-w-[440px]">
            <h3 className="text-xl font-bold mb-4 text-ink">관리자 변경 확인</h3>
            <p className="text-ink-2 mb-2">
              모든 데이터베이스에서 다음과 같이 관리자를 변경하시겠습니까?
            </p>
            <div className="bg-card p-4 rounded-xl my-4 space-y-2">
              <p className="text-sm">
                <span className="font-semibold">변경 전:</span>{' '}
                <span className="text-danger">{oldAdmin}</span>
              </p>
              <p className="text-sm">
                <span className="font-semibold">변경 후:</span>{' '}
                <span className="text-success">{newAdmin}</span>
              </p>
            </div>
            <p className="text-sm text-danger mb-4">
              ⚠️ 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmPopup(false)}
                className="flex-1 px-4 py-2 bg-card-2 text-ink rounded-xl hover:bg-card-3 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleConfirmUpdate}
                className="flex-1 px-4 py-2 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkUpdateAdmin;
