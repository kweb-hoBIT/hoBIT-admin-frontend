import MenuItem from '../ui/MenuItem';
import React, { useState } from 'react';
import { useHobitMutateDeleteApi } from '../../hooks/hobitAdmin';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth } from '../../redux/authSlice';
import { RootState } from '../../redux/store';
import { DeleteAccountReqeust, DeleteAccountResponse } from '../../types/user';

import { appAlert } from '../ui/Dialog';
import { resetAuthCheck } from '../ProtectedPage';
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
          resetAuthCheck();
    navigate('/login');
          appAlert('회원 탈퇴가 완료되었습니다.');
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
    <>
      <MenuItem icon="leave" danger onClick={togglePopup}>
        회원탈퇴
      </MenuItem>
      {showPopup && (
        <div className="modal-overlay">
          <div className="modal-panel max-w-[440px]">
            <div className="text-center">
              {error && <p className="text-danger mb-2">{error}</p>}
              <p>{username ? `${username}님, 정말 회원 탈퇴를 하시겠습니까?` : '정말 회원 탈퇴를 하시겠습니까?'}</p>
              <input
                type="password"
                value={manageKey}
                onChange={(e) => setManageKey(e.target.value)}
                placeholder="관리자 키를 입력하세요"
                className="mt-4 w-full p-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-danger/40"
              />
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="mt-4 w-full rounded-full bg-danger p-2.5 font-semibold text-white hover:bg-danger/90"
              >
                회원탈퇴
              </button>
              <button
                type="button"
                onClick={togglePopup}
                className="mt-2 w-full rounded-full bg-card p-2.5 font-semibold text-ink-2 hover:bg-card-2"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteAccount;
