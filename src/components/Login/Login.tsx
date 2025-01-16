import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserId, setUsername } from '../../redux/authSlice';
import { useHobitMutatePostApi } from '../../hooks/hobitAdmin';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import { LoginRequest, LoginResponse } from '../../types/user';

const Login: React.FC = () => {
  const [userData, setUserData] = useState<LoginRequest['body']>({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const LoginApi = useHobitMutatePostApi<LoginRequest, LoginResponse>('auth');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { email, password } = userData;

    if (email && password) {
      try {
        const response = await LoginApi({
          body: userData,
          credentials: 'include'
        });

        if (response.payload?.statusCode === 200) {
          const { user_id, username } = response.payload.data ?? {};

          if (user_id && username) {
            dispatch(setUserId(String(user_id)));
            dispatch(setUsername(username));

            navigate('/home');
            setUserData({ email: '', password: '' });
            setError(null);
          } else {
            setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
          }
        } else {
          if (response.payload?.statusCode === 404) {
            setError('존재하지 않는 이메일입니다. 다시 확인해주세요.');
          } else if (response.payload?.statusCode === 400) {
            setError('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
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
      userData={userData}
      error={error}
      onEmailChange={(e) => setUserData({ ...userData, email: e.target.value })}
      onPasswordChange={(e) => setUserData({ ...userData, password: e.target.value })}
      onSubmit={handleSubmit}
    />
  );
};

export default Login;