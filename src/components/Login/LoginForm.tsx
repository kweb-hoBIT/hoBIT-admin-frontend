import React from 'react';
import { LoginRequest, LoginResponse } from '../../types/user';

const LoginForm: React.FC<{
  userData: LoginRequest['body'];
  error: string | null;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}> = ({
  userData,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}) => {
  return (
    <div className="flex justify-center items-center min-h-screen p-1 rounded-3xl max-w-2xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">로그인</h2>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={userData.email}
              onChange={onEmailChange}
              placeholder="이메일을 입력하세요"
              className="w-full p-2 border border-gray-300 rounded-md text-base"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={userData.password}
              onChange={onPasswordChange}
              placeholder="비밀번호를 입력하세요"
              className="w-full p-2 border border-gray-300 rounded-md text-base"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-crimson text-white font-semibold text-xl p-2 rounded-md transition-colors duration-300 hover:bg-crimson-dark"
          >
            로그인
          </button>
        </form>
        <div className="mt-4 text-center">
          <a
            href="/signup"
            className="text-indigo-600 hover:underline text-lg font-medium"
          >
            회원가입
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
