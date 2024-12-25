import React from 'react';

const SignupForm: React.FC<{
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  phone_num: string;
  invitationKey: string;
  error: string | null;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneNumChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInvitationKeyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}> = ({
  email,
  password,
  confirmPassword,
  username,
  phone_num,
  invitationKey,
  error,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onUsernameChange,
  onPhoneNumChange,
  onInvitationKeyChange,
  onSubmit,
}) => {
  return (
    <div className="flex justify-center items-center min-h-screen p-1 rounded-3xl max-w-2xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">회원가입</h2>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
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
              value={password}
              onChange={onPasswordChange}
              placeholder="비밀번호를 입력하세요"
              className="w-full p-2 border border-gray-300 rounded-md text-base"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              비밀번호 확인
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={onConfirmPasswordChange}
              placeholder="비밀번호를 확인하세요"
              className="w-full p-2 border border-gray-300 rounded-md text-base"
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              사용자명
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={onUsernameChange}
              placeholder="사용자명을 입력하세요"
              className="w-full p-2 border border-gray-300 rounded-md text-base"
            />
          </div>
          <div>
            <label htmlFor="phone_num" className="block text-sm font-medium text-gray-700">
              전화번호
            </label>
            <input
              id="phone_num"
              type="text"
              value={phone_num}
              onChange={onPhoneNumChange}
              placeholder="전화번호를 입력하세요"
              className="w-full p-2 border border-gray-300 rounded-md text-base"
            />
          </div>
          <div>
            <label htmlFor="invitationKey" className="block text-sm font-medium text-gray-700">
              초대 키
            </label>
            <input
              id="invitationKey"
              type="text"
              value={invitationKey}
              onChange={onInvitationKeyChange}
              placeholder="초대 키를 입력하세요"
              className="w-full p-2 border border-gray-300 rounded-md text-base"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-crimson text-white font-semibold text-xl p-2 rounded-md transition-colors duration-300 hover:bg-crimson-dark"
          >
            회원가입
          </button>
        </form>
        <div className="mt-4 text-center">
          <a
            href="/login"
            className="text-indigo-600 hover:underline text-lg font-medium"
          >
            이미 계정이 있나요? 로그인
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
