import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHobitMutatePostApi } from '../../../hooks/hobitAdmin';
import { hobitGetApi } from '../../../api/api';
import { useNavigate } from 'react-router-dom';
import SignupForm, { Field, FieldErrors, FIELD_ORDER } from './SignupForm';
import { CheckUsernameResponse, SignupRequest, SignupResponse } from '../../../types/user';

import { appAlert } from '../../ui/Dialog';
const Signup: React.FC = () => {
  const [userData, setUserData] = useState<SignupRequest['body'] & { confirmPassword: string }>({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    phone_num: '',
    manageKey: ''
  });

  const [error, setError] = useState<string | null>(null); // 특정 칸이 아닌 오류 (서버 오류 등)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [usernameState, setUsernameState] = useState<'idle' | 'checking' | 'ok'>('idle');

  const checkUsername = async () => {
    const username = userData.username.trim();
    if (!username) return showErrors({ username: '이름을 입력해주세요.' });
    if (username.length > 45) return showErrors({ username: '이름은 45자 이하로 입력해주세요.' });
    setUsernameState('checking');
    const r = await hobitGetApi<{ query: { username: string } }, CheckUsernameResponse>('users/check-username', { query: { username } });
    if (r.payload?.statusCode === 200 && r.payload.data.available) {
      setUsernameState('ok');
      setFieldErrors((f) => ({ ...f, username: undefined }));
    } else {
      setUsernameState('idle');
      showErrors({ username: r.payload?.statusCode === 200 ? '이미 사용 중인 이름이에요. 다른 이름을 입력해주세요.' : '중복검사를 하지 못했어요. 다시 시도해주세요.' });
    }
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const SignupApi = useHobitMutatePostApi<SignupRequest, SignupResponse>('users');

  /** 문제 있는 칸들에 표시하고, 첫 번째 칸으로 커서 이동 */
  const showErrors = (errs: FieldErrors) => {
    setFieldErrors(errs);
    const first = FIELD_ORDER.find((f) => errs[f]);
    if (first) document.getElementById(first)?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let { email, password, confirmPassword, username, phone_num, manageKey } = userData;
    const phoneRegex = /^[0]{1}[1]{1}[0-9]{1}[-]?[0-9]{4}[-]?[0-9]{4}$/;
    const compactPhoneRegex = /^[0]{1}[1]{1}[0-9]{1}[0-9]{4}[0-9]{4}$/;

    // 칸마다 검사 — 한 번에 모두 보여줌
    const errs: FieldErrors = {};
    if (!email) errs.email = '이메일을 입력해주세요.';
    else if (email.length > 45) errs.email = '이메일은 45자 이하로 입력해주세요.';
    if (!password) errs.password = '비밀번호를 입력해주세요.';
    else if (password.length < 6) errs.password = '비밀번호는 6자 이상이어야 합니다.';
    if (password && confirmPassword !== password) errs.confirmPassword = '비밀번호가 일치하지 않습니다.';
    if (!username) errs.username = '이름을 입력해주세요.';
    else if (username.length > 45) errs.username = '이름은 45자 이하로 입력해주세요.';
    else if (usernameState !== 'ok') errs.username = '이름 중복검사를 해주세요.';
    if (!phone_num) errs.phone_num = '전화번호를 입력해주세요.';
    else if (!phoneRegex.test(phone_num)) errs.phone_num = '010-XXXX-XXXX 형식으로 입력해주세요.';
    if (!manageKey) errs.manageKey = '관리자 키를 입력해주세요.';
    if (Object.keys(errs).length) return showErrors(errs);

    // `01012345678` 형식인 경우 `010-1234-5678`로 변환
    if (compactPhoneRegex.test(phone_num)) {
      phone_num = phone_num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }

    // 회원가입 API 호출
    try {
      const response = await SignupApi({
        body: { email, password, username, phone_num, manageKey }
      });
      const payload = response.payload as (SignupResponse & { field?: Field }) | undefined;

      if (payload?.statusCode === 201) {
        appAlert(`회원가입 성공! ${payload.role === 'senior' ? '근로장학생' : payload.role === 'developer' ? '개발자' : '행정실'} 계정으로 만들어졌어요. 로그인 해주세요.`);
        navigate('/login');
        return;
      }
      // 서버가 알려준 문제 칸에 표시
      const msg = payload?.message;
      if (payload?.statusCode === 403) return showErrors({ manageKey: '가입 키가 올바르지 않습니다.' });
      if (msg === 'Username already exists') {
        setUsernameState('idle');
        return showErrors({ username: '이미 사용 중인 이름이에요. 다른 이름을 입력해주세요.' });
      }
      if (msg === 'User already exists') return showErrors({ email: '이미 가입된 이메일입니다.' });
      if (msg === 'Phone number already registered')
        return showErrors({ phone_num: '이미 가입된 전화번호입니다. 비밀번호 찾기를 이용하거나 다른 번호를 입력해주세요.' });
      if (payload?.statusCode === 400 && payload.field) return showErrors({ [payload.field]: '45자 이하로 입력해주세요.' });
      setError('회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } catch {
      setError('회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <SignupForm
      userData={userData}
      error={error}
      fieldErrors={fieldErrors}
      usernameState={usernameState}
      onCheckUsername={checkUsername}
      onInputChange={(e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
        if (e.target.name === 'username') setUsernameState('idle'); // 이름을 바꾸면 다시 검사
        // 고치기 시작하면 그 칸 표시는 지움
        if (fieldErrors[e.target.name as Field]) setFieldErrors({ ...fieldErrors, [e.target.name]: undefined });
      }}
      onSubmit={handleSubmit}
    />
  );
};

export default Signup;
