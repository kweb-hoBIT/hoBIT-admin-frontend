import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { LoginRequest } from '../../../types/user';
import EyeIcon from '../../ui/EyeIcon';
import UpdatePassword from './UpdatePassword';

const LoginForm: React.FC<{
  userData: LoginRequest['body'];
  error: string | null;
  isLoading: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}> = ({
  userData,
  error,
  isLoading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center py-10">
      <div className="animate-appear w-[420px] rounded-[24px] border border-line bg-surface p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center gap-2">
          <img src="/hoBIT64.ico" alt="" className="h-14 w-14 rounded-full" />
          <p className="text-[26px] font-bold tracking-tight text-accent-ink">hoBIT <span className="text-ink-3 text-lg font-semibold">관리자</span></p>
        </div>
        <h2 className="mb-5 text-center text-xl font-bold text-ink">로그인</h2>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {error && <div className="rounded-xl bg-danger-soft px-3.5 py-2.5 text-sm text-danger">{error}</div>}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={userData.email}
              onChange={onEmailChange}
              placeholder="이메일을 입력하세요"
              className="w-full rounded-xl border border-line px-3.5 py-3 text-base"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-ink">
              비밀번호
            </label>
            {/* 입력칸만 감싸서 아이콘을 입력칸 높이의 가운데에 (예전엔 고정 높이라 위아래가 어긋났음) */}
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={userData.password}
                onChange={onPasswordChange}
                placeholder="비밀번호를 입력하세요"
                className="w-full rounded-xl border border-line py-3 pl-3.5 pr-12 text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-1.5 my-auto flex h-9 w-9 items-center justify-center rounded-full text-ink-2 hover:bg-card hover:text-ink"
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="mt-2 flex min-h-[52px] w-full items-center justify-center rounded-full bg-accent text-lg font-semibold text-white transition-colors hover:bg-accent/90 disabled:opacity-70"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin"></div>
            ) : (
              '로그인'
            )}
          </button>
        </form>
        <div className="mt-6 flex items-center justify-center gap-1 text-ink-3">
          <Link
            to="/signup"
            className="rounded-full px-3 py-1.5 text-[17px] font-semibold text-ink-2 hover:bg-card hover:text-accent-ink"
          >
            회원가입
          </Link>
          <span aria-hidden="true">·</span>
          <UpdatePassword />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
