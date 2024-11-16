import React from "react";
import InputField from '../InputField';
import ErrorMessage from '../ErrorMessage';

interface SignupFormProps {
  email: string;
  password: string;
  confirmPassword: string; // 비밀번호 확인
  username: string;
  phone_num: string;
  invitationKey: string;
  error: string | null;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // 비밀번호 확인 변경 핸들러
  onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneNumChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInvitationKeyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({
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
      <InputField
        id="confirmPassword"
        label="비밀번호 확인"
        type="password"
        value={confirmPassword}
        onChange={onConfirmPasswordChange}
        placeholder="비밀번호를 확인하세요"
      />
      <InputField
        id="username"
        label="사용자명"
        type="text"
        value={username}
        onChange={onUsernameChange}
        placeholder="사용자명을 입력하세요"
      />
      <InputField
        id="phone_num"
        label="전화번호"
        type="text"
        value={phone_num}
        onChange={onPhoneNumChange}
        placeholder="전화번호를 입력하세요"
      />
      <InputField
        id="invitationKey"
        label="초대 키"
        type="text"
        value={invitationKey}
        onChange={onInvitationKeyChange}
        placeholder="초대 키를 입력하세요"
      />
      <button
        type="submit"
        className="w-full bg-[#F3D0D7] text-[#686D76] font-semibold text-xl py-2 rounded-md hover:bg-[#e8b9c2]"
      >
        회원가입
      </button>
    </form>
  );
};

export default SignupForm;
