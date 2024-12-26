import React, { useState } from 'react';
import { useHobitMutateDeleteApi } from '../../hooks/hobitAdmin';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearTokens } from '../../redux/authSlice';
import { selectAuth } from '../../redux/authSlice';
import { RootState } from '../../redux/store';
import { DeleteAccountReqeust, DeleteAccountResponse } from '../../types/user';

const DeleteAccount: React.FC = () => {
  const { user_id, username } = useSelector((state: RootState) => selectAuth(state));
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const DeleteAccountApi = user_id 
    ? useHobitMutateDeleteApi<DeleteAccountReqeust, DeleteAccountResponse>('users')
    : null;

  const handleDeleteAccount = async () => {
    if (!user_id) {
      setError('사용자를 찾을 수 없습니다. 로그인 상태를 확인해주세요.');
      return;
    }

    if (DeleteAccountApi) {
      try {
        const response = await DeleteAccountApi({
          params: { user_id: String(user_id) },
          body: {},
        });
        if (response.payload?.statusCode === 200) {
          dispatch(clearTokens());
          navigate('/login');
          alert('회원 탈퇴가 완료되었습니다.');
        } else {
          setError('회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
      } catch (err) {
        setError('회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  // 팝업 토글 함수
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div>
      <button
        type="button"
        onClick={togglePopup}
        className="text-sm text-red-600 hover:underline"
      >
        회원탈퇴
      </button>
      {showPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="text-center">
              {error && <p className="text-red-600 mb-2">{error}</p>}
              <p>{username ? `${username}님, 정말 회원 탈퇴를 하시겠습니까?` : '정말 회원 탈퇴를 하시겠습니까?'}</p>
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
