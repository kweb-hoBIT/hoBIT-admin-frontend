import React, { useState } from 'react';
import { useHobitMutateDeleteApi } from '../../hooks/hobitAdmin';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearTokens } from '../../redux/authSlice';
import { selectAuth } from '../../redux/authSlice';
import { RootState } from '../../redux/store';
import { DeleteAccountReqeust, DeleteAccountResponse } from '../../types/user';
import Button from '../Button'; // Button 컴포넌트 임포트

const DeleteAccount: React.FC = () => {
  const { user_id, username } = useSelector((state: RootState) => selectAuth(state));
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mutateDeleteAccount = user_id 
    ? useHobitMutateDeleteApi<DeleteAccountReqeust, DeleteAccountResponse>('users', {user_id})
    : null;

  const handleDeleteAccount = async () => {
    if (!user_id) {
      setError('사용자를 찾을 수 없습니다. 로그인 상태를 확인해주세요.');
      return;
    }

    if (mutateDeleteAccount) {
      try {
        const response = await mutateDeleteAccount();
        if (response.payload?.status === 'success') {
          console.log('hi');
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
      <Button
        type="button"
        onClick={togglePopup} 
        children="회원탈퇴"
        className="text-sm text-red-600 hover:underline"
        >
      </Button>
      {showPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="text-center">
              {error && <p className="text-red-600 mb-2">{error}</p>}
              <p>{username ? `${username}님, 정말 회원 탈퇴를 하시겠습니까?` : '정말 회원 탈퇴를 하시겠습니까?'}</p>
              <Button
                type="button"
                onClick={handleDeleteAccount}
                children="회원탈퇴"
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              />
              <Button
                type="button"
                onClick={togglePopup}
                children="닫기"
                className="mt-4 w-full text-center bg-gray-300 p-2 rounded-lg"
              >
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;
