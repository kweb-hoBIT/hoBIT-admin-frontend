import React from 'react';
import InputField from '../InputField';
import ErrorMessage from '../ErrorMessage';

interface LoginFormProps {
  email: string;
  password: string;
  error: string | null;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit}>
      <ErrorMessage message={error} />
      <InputField
        id="email"
        label="이메일"
        type="email"
        value={email}
        onChange={onEmailChange}
        placeholder="이메일을 입력하세요"
      />
      <InputField
        id="password"
        label="비밀번호"
        type="password"
        value={password}
        onChange={onPasswordChange}
        placeholder="비밀번호를 입력하세요"
      />
      <button
        type="submit"
        className="w-full bg-[#F3D0D7] text-[#686D76] font-semibold text-xl py-2 rounded-md hover:bg-[#e8b9c2]"
      >
        로그인
      </button>
    </form>
  );
};

export default LoginForm;
