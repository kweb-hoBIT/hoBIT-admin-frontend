import React, { useState } from 'react';
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
  const [showPassword, setShowPassword] = useState(false);

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
          <div className="relative">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={userData.password}
                onChange={onPasswordChange}
                placeholder="비밀번호를 입력하세요"
                className="w-full p-2 border border-gray-300 rounded-md text-base"
              />
            </div>
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2  flex items-center text-gray-500 cursor-pointer"
              role="button"
              aria-label="비밀번호 보기/숨기기"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.268.803-.678 1.544-1.208 2.182C17.768 16.057 14.477 19 12 19c-2.477 0-5.768-2.943-8.334-5.818C3.136 13.544 2.726 12.803 2.458 12z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3l18 18M9.36 9.36C8.708 10.473 8.5 11.5 8.5 12c0 1.105.395 2.105 1.036 2.786M15 15c.65-.876 1.036-1.876 1.036-2.786 0-1.105-.395-2.105-1.036-2.786M9.36 9.36L3 3m18 18l-6.36-6.36"
                  />
                </svg>
              )}
            </div>
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
