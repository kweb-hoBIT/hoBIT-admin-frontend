import React from 'react';
import InputField from '../InputField';
import Button from '../Button';
import ErrorMessage from '../ErrorMessage';

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
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">회원가입</h2>
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
          <InputField
            id="confirmPassword"
            label="비밀번호 확인"
            type="password"
            value={confirmPassword}
            onChange={onConfirmPasswordChange}
            placeholder="비밀번호를 확인하세요"
            className="w-full p-2 border border-gray-300 rounded-md text-base"
          />
          <InputField
            id="username"
            label="사용자명"
            type="text"
            value={username}
            onChange={onUsernameChange}
            placeholder="사용자명을 입력하세요"
            className="w-full p-2 border border-gray-300 rounded-md text-base"
          />
          <InputField
            id="phone_num"
            label="전화번호"
            type="text"
            value={phone_num}
            onChange={onPhoneNumChange}
            placeholder="전화번호를 입력하세요"
            className="w-full p-2 border border-gray-300 rounded-md text-base"
          />
          <InputField
            id="invitationKey"
            label="초대 키"
            type="text"
            value={invitationKey}
            onChange={onInvitationKeyChange}
            placeholder="초대 키를 입력하세요"
            className="w-full p-2 border border-gray-300 rounded-md text-base"
          />
          <Button 
            type="submit" 
            children="회원가입"
            className="w-full bg-pink-200 text-gray-600 font-semibold text-xl p-2 rounded-md transition-colors duration-300"
          />
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
