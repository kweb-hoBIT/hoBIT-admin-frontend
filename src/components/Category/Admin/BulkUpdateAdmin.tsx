import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { selectAuth } from '../../../redux/authSlice';
import { useHobitMutatePutApi, useHobitQueryGetApi } from '../../../hooks/hobitAdmin';
import { BulkUpdateAdminRequest, BulkUpdateAdminResponse, GetAllAdminsRequest, GetAllAdminsResponse } from '../../../types/admin';

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
      alert('변경 전 관리자와 변경 후 관리자를 모두 입력해주세요.');
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
        alert(
          `관리자가 성공적으로 변경되었습니다!\n\n` +
          `변경된 FAQ: ${updated_faqs}건`
        );
        setOldAdmin('');
        setNewAdmin('');
      } else {
        alert('관리자 변경 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('관리자 변경 오류:', error);
      alert('관리자 변경 중 오류가 발생했습니다.');
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
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          관리자 전체 변경
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          모든 FAQ의 답변에서 특정 관리자를 일괄 변경합니다.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 변경 전 관리자 */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson focus:border-transparent"
              disabled={isUpdating}
            />
            
            {/* 드롭다운 */}
            {showDropdown && filteredAdmins.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredAdmins.map((admin, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleAdminSelect(admin)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800"
                  >
                    {admin}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 변경 후 관리자 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              변경 후 관리자
            </label>
            <input
              type="text"
              value={newAdmin}
              onChange={(e) => setNewAdmin(e.target.value)}
              placeholder="김철수"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson focus:border-transparent"
              disabled={isUpdating}
            />
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${
              isUpdating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-crimson hover:bg-crimson-dark transform hover:scale-105'
            }`}
          >
            {isUpdating ? '변경 중...' : '관리자 변경'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>⚠️ 주의:</strong> 이 작업은 되돌릴 수 없습니다.
          </p>
        </div>
      </div>

      {/* 확인 팝업 */}
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-gray-800">관리자 변경 확인</h3>
            <p className="text-gray-600 mb-2">
              모든 데이터베이스에서 다음과 같이 관리자를 변경하시겠습니까?
            </p>
            <div className="bg-gray-50 p-4 rounded-lg my-4 space-y-2">
              <p className="text-sm">
                <span className="font-semibold">변경 전:</span>{' '}
                <span className="text-red-600">{oldAdmin}</span>
              </p>
              <p className="text-sm">
                <span className="font-semibold">변경 후:</span>{' '}
                <span className="text-green-600">{newAdmin}</span>
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
                onClick={handleConfirmUpdate}
                className="flex-1 px-4 py-2 bg-crimson text-white rounded-lg hover:bg-crimson-dark transition-colors"
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
