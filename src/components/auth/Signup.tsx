import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sendInputValue } from '../../redux/inputSlice';
import { useHobitMutateApi } from '../../hooks/hobitAdmin';
import { useNavigate } from 'react-router-dom';
import SignupForm from './SignupForm';
import { SignupRequest, SignupResponse } from '../../types/user';

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [phone_num, setPhoneNum] = useState<string>('');
  const [invitationKey, setInvitationKey] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mutateSignup = useHobitMutateApi<SignupRequest, 'users', SignupResponse>('users');

  const handleSubmit = async (e: React.FormEvent) => {
    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }
    if (password !== confirmPassword) {
      setError('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    const phoneRegex = /^[0]{1}[1]{1}[0-9]{1}[-]?[0-9]{4}[-]?[0-9]{4}$/;
    if (!phoneRegex.test(phone_num)) {
      setError('전화번호 형식이 올바르지 않습니다. 010-XXXX-XXXX 형식으로 입력해주세요.');
      return;
    }

    e.preventDefault();

    if (email && password && username && phone_num && invitationKey) {
      dispatch(sendInputValue(`회원가입 요청: ${email}`));
      try {
        const response = await mutateSignup({ type: 'users', email, password, username, phone_num, invitationKey });
        if (response.payload?.status === 'success') {
          alert('회원가입 성공! 로그인 해주세요.');
          navigate('/login');
        } else {
          if(response.payload?.message === 'Invalid invitation key. Access denied.') {
            setError('Invitation key가 올바르지 않습니다. 다시 확인해주세요.');
          } else if(response.payload?.message === 'User already exists') {
            setError('이미 존재하는 이메일입니다. 다른 이메일로 시도해주세요.');
          }
        }
      } catch {
        setError('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } else {
      alert('모든 필드를 입력해주세요.');
    }
  };

  return (
    <div className="signup-container flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded-xl shadow-md w-[400px]">
        <h2 className="text-2xl font-semibold mb-4 text-center">회원가입</h2>
        <SignupForm
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          username={username}
          phone_num={phone_num}
          invitationKey={invitationKey}
          error={error}
          onEmailChange={(e) => setEmail(e.target.value)}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
          onUsernameChange={(e) => setUsername(e.target.value)}
          onPhoneNumChange={(e) => setPhoneNum(e.target.value)}
          onInvitationKeyChange={(e) => setInvitationKey(e.target.value)}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Signup;
