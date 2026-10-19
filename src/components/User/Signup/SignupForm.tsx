import { Link } from 'react-router-dom';
import EyeIcon from '../../ui/EyeIcon';
import React, { useState } from 'react';

export type Field = 'email' | 'password' | 'confirmPassword' | 'username' | 'phone_num' | 'manageKey';
export type FieldErrors = Partial<Record<Field, string>>;
export const FIELD_ORDER: Field[] = ['email', 'password', 'confirmPassword', 'username', 'phone_num', 'manageKey'];

/** 칸 아래 오류 문구 + 칸 테두리 빨갛게 */
const inputClass = (bad: boolean, extra: string) =>
  `w-full rounded-xl border text-base ${extra} ${bad ? 'border-danger focus-visible:border-danger' : 'border-line'}`;
const FieldError: React.FC<{ id: Field; message?: string }> = ({ id, message }) =>
  message ? (
    <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-danger">
      {message}
    </p>
  ) : null;

const SignupForm: React.FC<{
  userData: {
    email: string;
    password: string;
    confirmPassword: string;
    username: string;
    phone_num: string;
    manageKey: string;
  };
  error: string | null;
  fieldErrors: FieldErrors;
  /** 중복검사 상태: 안 함 / 확인 중 / 사용 가능 (이름을 바꾸면 다시 'idle') */
  usernameState: 'idle' | 'checking' | 'ok';
  onCheckUsername: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}> = ({ userData, error, fieldErrors, usernameState, onCheckUsername, onInputChange, onSubmit }) => {
  const a11y = (f: Field) => ({ 'aria-invalid': !!fieldErrors[f], 'aria-describedby': fieldErrors[f] ? `${f}-error` : undefined });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center py-10">
      <div className="animate-appear w-[420px] rounded-[24px] border border-line bg-surface p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center gap-2">
          <img src="/hoBIT64.ico" alt="" className="h-14 w-14 rounded-full" />
          <p className="text-[26px] font-bold tracking-tight text-accent-ink">hoBIT <span className="text-ink-3 text-lg font-semibold">관리자</span></p>
        </div>
        <h2 className="mb-5 text-center text-xl font-bold text-ink">회원가입</h2>
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          {error && <div className="rounded-xl bg-danger-soft px-3.5 py-2.5 text-sm text-danger">{error}</div>}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink">
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={userData.email}
              onChange={onInputChange}
              placeholder="이메일을 입력하세요"
              {...a11y('email')}
              className={inputClass(!!fieldErrors.email, 'px-3.5 py-3')}
            />
            <FieldError id="email" message={fieldErrors.email} />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-ink">
              비밀번호
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={userData.password}
                onChange={onInputChange}
                placeholder="비밀번호를 입력하세요"
                {...a11y('password')}
                className={inputClass(!!fieldErrors.password, 'py-3 pl-3.5 pr-12')}
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-1.5 my-auto flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-ink-2 hover:bg-card hover:text-ink"
                role="button"
                aria-label="비밀번호 보기/숨기기"
              >
                <EyeIcon open={showPassword} />
              </div>
            </div>
            <FieldError id="password" message={fieldErrors.password} />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-semibold text-ink">
              비밀번호 확인
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={userData.confirmPassword}
                onChange={onInputChange}
                placeholder="비밀번호를 확인하세요"
                {...a11y('confirmPassword')}
                className={inputClass(!!fieldErrors.confirmPassword, 'py-3 pl-3.5 pr-12')}
              />
              <div
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-1.5 my-auto flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-ink-2 hover:bg-card hover:text-ink"
                role="button"
                aria-label="비밀번호 확인 보기/숨기기"
              >
                <EyeIcon open={showConfirmPassword} />
              </div>
            </div>
            <FieldError id="confirmPassword" message={fieldErrors.confirmPassword} />
          </div>
          <div>
            <label htmlFor="username" className="mb-1.5 block text-sm font-semibold text-ink">
              사용자명
            </label>
            <div className="relative">
              <input
                id="username"
                name="username"
                type="text"
                value={userData.username}
                onChange={onInputChange}
                placeholder="이름 입력"
                autoComplete="off"
                {...a11y('username')}
                className={inputClass(!!fieldErrors.username, 'py-3 pl-3.5 pr-[6.5rem]')}
              />
              {/* 중복검사 — 칸 오른쪽 끝 */}
              <button
                type="button"
                onClick={onCheckUsername}
                disabled={!userData.username.trim() || usernameState === 'checking' || usernameState === 'ok'}
                className={`absolute inset-y-0 right-1.5 my-auto h-9 rounded-full px-3.5 text-sm font-semibold transition-colors ${
                  usernameState === 'ok' ? 'bg-success-soft text-success' : 'bg-card text-ink hover:bg-card-2 disabled:opacity-50'
                }`}
              >
                {usernameState === 'checking' ? '확인 중…' : usernameState === 'ok' ? '확인됨 ✓' : '중복검사'}
              </button>
            </div>
            {usernameState === 'ok' && !fieldErrors.username && <p className="mt-1.5 text-sm text-success">사용할 수 있는 이름이에요.</p>}
            <FieldError id="username" message={fieldErrors.username} />
          </div>
          <div>
            <label htmlFor="phone_num" className="mb-1.5 block text-sm font-semibold text-ink">
              전화번호
            </label>
            <input
              id="phone_num"
              name="phone_num"
              type="text"
              value={userData.phone_num}
              autoComplete="off"
              onChange={onInputChange}
              placeholder="010-XXXX-XXXX 형식으로 입력해주세요."
              {...a11y('phone_num')}
              className={inputClass(!!fieldErrors.phone_num, 'px-3.5 py-3')}
            />
            <FieldError id="phone_num" message={fieldErrors.phone_num} />
          </div>
          <div>
            <label htmlFor="manageKey" className="mb-1.5 block text-sm font-semibold text-ink">
              가입 키
            </label>
            <input
              id="manageKey"
              name="manageKey"
              type="text"
              value={userData.manageKey}
              autoComplete="off"
              onChange={onInputChange}
              placeholder="관리자 키 또는 근장 키"
              {...a11y('manageKey')}
              className={inputClass(!!fieldErrors.manageKey, 'px-3.5 py-3')}
            />
            {!fieldErrors.manageKey && (
              <p className="mt-1.5 text-xs text-ink-3">관리자 키로 가입하면 행정실, 근장 키로 가입하면 근로장학생(선배 FAQ·선배 채팅만) 계정이에요.</p>
            )}
            <FieldError id="manageKey" message={fieldErrors.manageKey} />
          </div>
          <button
            type="submit"
            className="mt-2 min-h-[52px] w-full rounded-full bg-accent text-lg font-semibold text-white transition-colors hover:bg-accent/90"
          >
            회원가입
          </button>
        </form>
        <div className="mt-5 text-center">
          <Link
            to="/login"
            className="rounded-full px-3 py-1.5 text-[17px] font-semibold text-ink-2 hover:bg-card hover:text-accent-ink"
          >
            이미 계정이 있나요? 로그인
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
