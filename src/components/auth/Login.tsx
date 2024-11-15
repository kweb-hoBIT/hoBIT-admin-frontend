import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setToken } from '../../redux/authSlice';
import { sendInputValue, clearSentValue } from '../../redux/inputSlice';
import { useHobitMutateApi } from '../../hooks/hobitAdmin';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mutateLogin = useHobitMutateApi('auth');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email && password) {
      dispatch(sendInputValue(`로그인 요청: ${email}`));

      try {
        const response = await mutateLogin({ email, password });

        if (response.payload && response.payload.status === 'success') {
          const token = response.payload.data?.token;

          if (token) {
            dispatch(setToken(token));
            console.log('로그인 성공:', response);
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
          setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
        }
      } catch (error) {
        console.error('로그인 실패:', error);
        setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      }
    } else {
      alert('이메일과 비밀번호를 입력해주세요.');
    }
  };

  useEffect(() => {
    console.log('Login 컴포넌트 렌더링');
  }, []);

  return (
    <div className="login-container flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded-xl shadow-md w-[400px]">
        <h2 className="text-2xl font-semibold mb-4 text-center">로그인</h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-lg font-medium">이메일</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="이메일을 입력하세요"
              className="w-full p-2 border border-gray-300 rounded-md mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-lg font-medium">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="비밀번호를 입력하세요"
              className="w-full p-2 border border-gray-300 rounded-md mt-1"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#F3D0D7] text-[#686D76] font-semibold text-xl py-2 rounded-md hover:bg-[#e8b9c2]"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
