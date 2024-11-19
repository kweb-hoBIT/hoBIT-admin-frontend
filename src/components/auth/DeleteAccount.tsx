// import React, { useState } from 'react';
// import { useHobitMutateApi } from '../../hooks/hobitAdmin';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { clearTokens } from '../../redux/authSlice';
// import { selectAuth } from '../../redux/authSlice';
// import { RootState } from '../../redux/store';
// import { DeleteAccountReqeust, DeleteAccountResponse } from '../../types/user';



// const DeleteAccount: React.FC = () => {
//   const { user_id } = useSelector((state: RootState) => selectAuth(state));
//   const [error, setError] = useState<string | null>(null);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

  
//   const handleDeleteAccount = async () => {
//     if (!user_id) {
//       setError('사용자를 찾을 수 없습니다. 로그인 상태를 확인해주세요.');
//       return;
//     }
//     const mutateDeleteAccount = useHobitMutateApi<DeleteAccountReqeust, 'users', DeleteAccountResponse>('users');
//     try {
      
//       const response = await mutateDeleteAccount({ type: 'users', user_id });
      
//       if (response.payload?.status === 'success') {
//         // Clear user data from Redux and local storage using clearTokens
//         dispatch(clearTokens());

//         // Redirect to login page
//         navigate('/login');
//         alert('회원 탈퇴가 완료되었습니다.');
//       } else {
//         setError('회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.');
//       }
//     } catch (err) {
//       setError('회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.');
//     }
//   };

//   return (
//     <div className="text-center">
//       {error && <p className="text-red-600 mb-2">{error}</p>}
//       <p>{username ? `${username}님, 정말 회원 탈퇴를 하시겠습니까?` : '정말 회원 탈퇴를 하시겠습니까?'}</p>
//       <button
//         onClick={handleDeleteAccount}
//         className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//       >
//         회원탈퇴
//       </button>
//     </div>
//   );
// };

// export default DeleteAccount;
