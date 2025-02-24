import React, { useState } from 'react';
import { useHobitMutateDeleteApi } from '../../hooks/hobitAdmin';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth } from '../../redux/authSlice';
import { RootState } from '../../redux/store';
import { DeleteAccountReqeust, DeleteAccountResponse } from '../../types/user';

const DeleteAccount: React.FC = () => {
  const { user_id, username } = useSelector((state: RootState) => selectAuth(state));
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [manageKey, setManageKey] = useState('');
  const navigate = useNavigate();

  const DeleteAccountApi = useHobitMutateDeleteApi<DeleteAccountReqeust, DeleteAccountResponse>('users');

  const handleDeleteAccount = async () => {
    if (!user_id) {
      setError('사용자를 찾을 수 없습니다. 로그인 상태를 확인해주세요.');
      return;
    }

    if (DeleteAccountApi) {
      try {
        const response = await DeleteAccountApi({
          params: { user_id: String(user_id) },
          body: { manageKey },
        });
        if (response.payload?.statusCode === 200) {
          navigate('/login');
          alert('회원 탈퇴가 완료되었습니다.');
        } else if (response.payload?.statusCode === 403) {
          setError('관리자 키가 잘못 입력됐습니다.');
        } else {
          setError('회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
      } catch (err) {
        setError('회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
    setError(null);
  };

  return (
    <div>
      <button
        type="button"
        onClick={togglePopup}
        className="px-3 py-1 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors duration-200"
      >
        회원탈퇴
      </button>
      {showPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="text-center">
              {error && <p className="text-red-600 mb-2">{error}</p>}
              <p>{username ? `${username}님, 정말 회원 탈퇴를 하시겠습니까?` : '정말 회원 탈퇴를 하시겠습니까?'}</p>
              <input
                type="password"
                value={manageKey}
                onChange={(e) => setManageKey(e.target.value)}
                placeholder="관리자 키를 입력하세요"
                className="mt-4 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="mt-4 w-full h-15 text-center bg-red-500 p-2 rounded-lg hover:bg-red-600"
              >
                회원탈퇴
              </button>
              <button
                type="button"
                onClick={togglePopup}
                className="mt-4 w-full h-15 text-center bg-gray-300 p-2 rounded-lg hover:bg-gray-400"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;
