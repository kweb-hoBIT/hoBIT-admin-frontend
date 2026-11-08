import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { selectAuth } from '../../../redux/authSlice';
import { useHobitMutateDeleteApi, useHobitQueryGetApi } from '../../../hooks/hobitAdmin';
import { BulkDeleteAdminRequest, BulkDeleteAdminResponse, GetAllAdminsRequest, GetAllAdminsResponse } from '../../../types/admin';

import { appAlert } from '../../ui/Dialog';
import Icon from '../../ui/Icon';
import { useEmbedded } from '../embedded';
const BulkDeleteAdmin: React.FC = () => {
  const emb = useEmbedded(); // 관리 탭 안에 끼워 넣었으면 상자·큰 제목 없이
  const { user_id } = useSelector((state: RootState) => selectAuth(state));
  const [admin, setAdmin] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [adminList, setAdminList] = useState<string[]>([]);

  const bulkDeleteAdminApi = useHobitMutateDeleteApi<BulkDeleteAdminRequest, BulkDeleteAdminResponse>(
    'admins/bulk-delete'
  );

  const getAllAdminsApi = useHobitQueryGetApi<GetAllAdminsRequest, GetAllAdminsResponse>('admins');

  useEffect(() => {
    if (getAllAdminsApi.data?.payload?.statusCode === 200) {
      setAdminList(getAllAdminsApi.data.payload.data.admins);
    }
  }, [getAllAdminsApi.data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!admin) {
      appAlert('삭제할 관리자를 입력해주세요.');
      return;
    }

    setShowConfirmPopup(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setShowConfirmPopup(false);

    try {
      const response = await bulkDeleteAdminApi({
        body: {
          admin: admin,
          user_id: Number(user_id),
        },
      });

      if (response.payload?.statusCode === 200) {
        const { updated_faqs } = response.payload.data;
        appAlert(
          `관리자가 성공적으로 삭제되었습니다!\n\n` +
          `삭제된 FAQ: ${updated_faqs}건`
        );
        setAdmin('');
        // 관리자 목록 새로고침
        getAllAdminsApi.refetch();
      } else if (response.payload?.statusCode === 400) {
        // 백엔드에서 반환한 에러 메시지 표시
        appAlert(response.payload.data.message);
      } else {
        appAlert('관리자 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('관리자 삭제 오류:', error);
      appAlert('관리자 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAdminSelect = (selectedAdmin: string) => {
    setAdmin(selectedAdmin);
    setShowDropdown(false);
  };

  const filteredAdmins = admin
    ? adminList.filter((adm) =>
        adm.toLowerCase().includes(admin.toLowerCase())
      )
    : adminList;

  return (
    <div className={emb ? '' : 'flex justify-center items-center py-6 sm:min-h-[calc(100vh-4.5rem)] sm:py-10'}>
      <div className={emb ? 'w-full' : 'bg-surface p-5 sm:p-8 rounded-xl shadow-lg w-full max-w-md'}>
        {!emb && (<h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-ink">
          관리자 전체 삭제
        </h2>)}
        <p className={emb ? 'mb-4 text-sm text-ink-3' : 'text-sm text-ink-2 mb-6 text-center'}>
          모든 FAQ의 답변에서 특정 관리자를 일괄 삭제합니다.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 삭제할 관리자 */}
          <div className="relative">
            <label className="block text-sm font-medium text-ink mb-2">
              삭제할 관리자
            </label>
            <input
              type="text"
              value={admin}
              onChange={(e) => {
                setAdmin(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              placeholder="홍길동"
              className="w-full px-4 py-2 border border-line rounded-xl focus:ring-2 focus:ring-accent-ink/40 focus:border-transparent"
              disabled={isDeleting}
            />
            
            {/* 드롭다운 */}
            {showDropdown && filteredAdmins.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-surface border border-line rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {filteredAdmins.map((adm, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleAdminSelect(adm)}
                    className="w-full text-left px-4 py-2 hover:bg-card text-ink"
                  >
                    {adm}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isDeleting}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-[background-color,transform] duration-300 ${
              isDeleting
                ? 'bg-card-3 cursor-not-allowed'
                : 'bg-danger hover:bg-danger/90 transform hover:scale-105'
            }`}
          >
            {isDeleting ? '삭제 중...' : '관리자 삭제'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-danger-soft border border-danger/40 rounded-xl">
          <p className="flex items-start gap-2 text-sm leading-relaxed text-danger">
            <Icon name="alert" className="mt-[3px] h-4 w-4 shrink-0" />
            <span><strong>주의:</strong> 이 작업은 되돌릴 수 없습니다.</span>
          </p>
        </div>
      </div>

      {/* 확인 팝업 */}
      {showConfirmPopup && (
        <div className="modal-overlay">
          <div className="modal-panel max-w-[440px]">
            <h3 className="text-xl font-bold mb-4 text-ink">관리자 삭제 확인</h3>
            <p className="text-ink-2 mb-2">
              모든 데이터베이스에서 다음 관리자를 삭제하시겠습니까?
            </p>
            <div className="bg-card p-4 rounded-xl my-4">
              <p className="text-sm">
                <span className="font-semibold">삭제할 관리자:</span>{' '}
                <span className="text-danger">{admin}</span>
              </p>
            </div>
            <p className="flex items-start gap-2 text-sm text-danger mb-4">
              <Icon name="alert" className="mt-[3px] h-4 w-4 shrink-0" />
              <span>이 작업은 되돌릴 수 없습니다.</span>
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmPopup(false)}
                className="flex-1 px-4 py-2 bg-card-2 text-ink rounded-xl hover:bg-card-3 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-danger text-white rounded-xl hover:bg-danger/90 transition-colors"
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

export default BulkDeleteAdmin;
