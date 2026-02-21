import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { selectAuth } from '../../../redux/authSlice';
import { useHobitMutateDeleteApi, useHobitQueryGetApi } from '../../../hooks/hobitAdmin';
import { BulkDeleteAdminRequest, BulkDeleteAdminResponse, GetAllAdminsRequest, GetAllAdminsResponse } from '../../../types/admin';

const BulkDeleteAdmin: React.FC = () => {
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
      alert('삭제할 관리자를 입력해주세요.');
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
        alert(
          `관리자가 성공적으로 삭제되었습니다!\n\n` +
          `삭제된 FAQ: ${updated_faqs}건`
        );
        setAdmin('');
        // 관리자 목록 새로고침
        getAllAdminsApi.refetch();
      } else if (response.payload?.statusCode === 400) {
        // 백엔드에서 반환한 에러 메시지 표시
        alert(response.payload.data.message);
      } else {
        alert('관리자 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('관리자 삭제 오류:', error);
      alert('관리자 삭제 중 오류가 발생했습니다.');
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
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          관리자 전체 삭제
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          모든 FAQ의 답변에서 특정 관리자를 일괄 삭제합니다.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 삭제할 관리자 */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson focus:border-transparent"
              disabled={isDeleting}
            />
            
            {/* 드롭다운 */}
            {showDropdown && filteredAdmins.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredAdmins.map((adm, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleAdminSelect(adm)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800"
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
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${
              isDeleting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 transform hover:scale-105'
            }`}
          >
            {isDeleting ? '삭제 중...' : '관리자 삭제'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-800">
            <strong>⚠️ 주의:</strong> 이 작업은 되돌릴 수 없습니다.
          </p>
        </div>
      </div>

      {/* 확인 팝업 */}
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-gray-800">관리자 삭제 확인</h3>
            <p className="text-gray-600 mb-2">
              모든 데이터베이스에서 다음 관리자를 삭제하시겠습니까?
            </p>
            <div className="bg-gray-50 p-4 rounded-lg my-4">
              <p className="text-sm">
                <span className="font-semibold">삭제할 관리자:</span>{' '}
                <span className="text-red-600">{admin}</span>
              </p>
            </div>
            <p className="text-sm text-red-600 mb-4">
              ⚠️ 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmPopup(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
