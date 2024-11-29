import React from 'react';
import InputField from '../InputField';
import Button from '../Button';
import ErrorMessage from '../ErrorMessage';

const LoginForm: React.FC<{
  email: string;
  password: string;
  error: string | null;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}> = ({
  email,
  password,
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
          <ErrorMessage message={error} />
          <InputField
            id="email"
            label="이메일"
            type="email"
            value={email}
            onChange={onEmailChange}
            placeholder="이메일을 입력하세요"
            className="w-full p-2 border border-gray-300 rounded-md text-base"
          />
          <InputField
            id="password"
            label="비밀번호"
            type="password"
            value={password}
            onChange={onPasswordChange}
            placeholder="비밀번호를 입력하세요"
            className="w-full p-2 border border-gray-300 rounded-md text-base"
          />
          <Button 
            type="submit" 
            children="로그인"
            className="w-full bg-crimson text-white font-semibold text-xl p-2 rounded-md transition-colors duration-300 hover:bg-crimson-dark"
          />
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
