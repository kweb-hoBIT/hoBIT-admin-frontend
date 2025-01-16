import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHobitMutatePostApi } from '../../hooks/hobitAdmin';
import { useNavigate } from 'react-router-dom';
import SignupForm from './SignupForm';
import { SignupRequest, SignupResponse } from '../../types/user';

const Signup: React.FC = () => {
  const [userData, setUserData] = useState<SignupRequest['body'] & { confirmPassword: string }>({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    phone_num: '',
    invitationKey: ''
  });

  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const SignupApi = useHobitMutatePostApi<SignupRequest, SignupResponse>('users');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { email, password, confirmPassword, username, phone_num, invitationKey } = userData;

    // 모든 값이 존재하는지 확인
    if (!email || !password || !username || !phone_num || !invitationKey) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    // 유효성 검사
    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }
    if (password !== confirmPassword) {
      setError('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    const phoneRegex = /^[0]{1}[1]{1}[0-9]{1}[-]?[0-9]{4}[-]?[0-9]{4}$/;
    if (!phoneRegex.test(phone_num)) {
      setError('전화번호 형식이 올바르지 않습니다. 010-XXXX-XXXX 형식으로 입력해주세요.');
      return;
    }

    // 회원가입 API 호출
    try {
      const response = await SignupApi({
        body: { email, password, username, phone_num, invitationKey }
      });

      if (response.payload?.statusCode === 201) {
        alert('회원가입 성공! 로그인 해주세요.');
        navigate('/login');
      } else {
        if (response.payload?.statusCode === 403) {
          setError('초대키가 올바르지 않습니다. 다시 확인해주세요.');
        } else if (response.payload?.statusCode === 400) {
          setError('이미 존재하는 이메일입니다. 다른 이메일로 시도해주세요.');
        }
      }
    } catch {
      setError('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <SignupForm
      userData={userData}
      error={error}
      onInputChange={(e) => setUserData({ ...userData, [e.target.name]: e.target.value })}
      onSubmit={handleSubmit}
    />
  );
};

export default Signup;
