import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setToken } from '../../redux/authSlice';
import { sendInputValue, clearSentValue } from '../../redux/inputSlice';
import { useHobitMutateApi } from '../../hooks/hobitAdmin';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import { LoginRequest, LoginResponse } from '../../types/user';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mutateLogin = useHobitMutateApi<LoginRequest, 'auth', LoginResponse>('auth');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email && password) {
      dispatch(sendInputValue(`로그인 요청: ${email}`));

      try {
        const response = await mutateLogin({ type: 'auth', email, password });
        if (response.payload?.status === 'success') {
          const token = response.payload.data?.token;

          if (token) {
            dispatch(setToken(token));
            navigate('/main');
            setEmail('');
            setPassword('');
            setError(null);

            setTimeout(() => {
              dispatch(clearSentValue());
            }, 100);
          } else {
            setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
          }
        } else {
          if (response.payload?.message === 'User not found') {
            setError('존재하지 않는 이메일입니다. 다시 확인해주세요.');
          } else if (response.payload?.message === 'Invalid password') {
            setError('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
          } else if (response.payload?.message === 'User registration is pending approval') {
            setError('관리자의 승인을 기다리는 계정입니다. 승인 후 로그인해주세요.');
          }
        }
      } catch {
        setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      }
    } else {
      alert('이메일과 비밀번호를 입력해주세요.');
    }
  };

  return (
    <LoginForm
      email={email}
      password={password}
      error={error}
      onEmailChange={(e) => setEmail(e.target.value)}
      onPasswordChange={(e) => setPassword(e.target.value)}
      onSubmit={handleSubmit}
    />
  );
};

export default Login;
