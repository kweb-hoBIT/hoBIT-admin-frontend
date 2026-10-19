import React, { useState } from 'react';
import { useHobitMutatePostApi, useHobitMutatePutApi } from '../../../hooks/hobitAdmin';
import { FindUserRequest, FindUserResponse, UpdatePasswordRequest, UpdatePasswordResponse } from '../../../types/user';

import { appAlert } from '../../ui/Dialog';
const FindPassword: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    phone_num: '',
    manageKey: '',
  });

  const [userId, setUserId] = useState<number>(0);
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const FindUserwordApi = useHobitMutatePostApi<FindUserRequest, FindUserResponse>('users/find');
  const UpdatePasswordApi = useHobitMutatePutApi<UpdatePasswordRequest, UpdatePasswordResponse>('users/newpassword');

  const togglePopup = () => {
    setIsOpen((prev) => !prev);
    setFormData({ email: '', username: '', phone_num: '', manageKey: '' });
    setPassword('');
    setConfirmPassword('');
    setIsResetOpen(false);
    setUserId(0);
    setResetToken('');
    setShowPassword(false)
    setShowConfirmPassword(false)
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email) {
      appAlert('이메일을 입력해주세요.');
      return;
    }

    if (!formData.username) {
      appAlert('이름을 입력해주세요.');
      return;
    }

    if (!formData.phone_num) {
      appAlert('전화번호를 입력해주세요.');
      return;
    }

    if (!formData.manageKey) {
      appAlert('관리자 키를 입력해주세요.');
      return;
    }

    const response = await FindUserwordApi({
      body: { ...formData },
    });

    if (response.payload?.statusCode === 200) {
      setUserId(response.payload.data.user_id);
      setResetToken(response.payload.data.resetToken);
      setIsResetOpen(true);
    } else if (response.payload?.statusCode === 403) {
      appAlert('관리자 키가 일치하지 않습니다');
    } else if (response.payload?.statusCode === 400) {
      appAlert('입력하신 정보가 일치하지 않습니다.');
    } else {
      appAlert('비밀번호 찾는 중 오류가 발생했습니다.');
      console.log(response.error);
    }
  };

  const handlePasswordChange = async () => {
    if (!password) {
      appAlert('비밀번호를 입력해주세요.');
      return;
    }

    if (!confirmPassword) {
      appAlert('비밀번호 확인을 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      appAlert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 6) {
      appAlert('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    const response = await UpdatePasswordApi({
      params: { user_id: String(userId) },
      body: { password, resetToken },
    });

    if (response.payload?.statusCode === 200) {
      appAlert('비밀번호가 변경되었습니다. 로그인해주세요.');
      togglePopup();
    } else {
      appAlert('비밀번호 변경 중 오류가 발생했습니다.');
      console.log(response.error);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={togglePopup}
        className="rounded-full px-3 py-1.5 text-[17px] font-semibold text-ink-2 hover:bg-card hover:text-accent-ink"
      >
        비밀번호 찾기
      </button>

      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-panel max-w-[440px] text-center">
            {!isResetOpen ? (
              <>
                <p className="text-lg font-semibold mb-2">비밀번호 찾기</p>
                <p className="text-sm text-ink-2">계정 정보를 입력해주세요.</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4">
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="이메일"
                    className="w-full rounded-xl border border-line px-3.5 py-3"
                    required
                  />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="이름"
                    className="w-full rounded-xl border border-line px-3.5 py-3"
                    required
                  />
                  <input
                    type="tel"
                    name="phone_num"
                    value={formData.phone_num}
                    onChange={handleChange}
                    placeholder="010-XXXX-XXXX 형식으로 입력해주세요."
                    className="w-full rounded-xl border border-line px-3.5 py-3"
                    required
                  />
                  <input
                    type="password"
                    name="manageKey"
                    value={formData.manageKey}
                    onChange={handleChange}
                    placeholder="관리자 키"
                    className="w-full rounded-xl border border-line px-3.5 py-3"
                    required
                  />

                  <button
                    type="submit"
                    className="mt-4 w-full bg-accent text-white font-semibold p-2 rounded-xl transition-colors duration-300 hover:bg-accent/90"
                  >
                    비밀번호 찾기
                  </button>
                  <button
                    type="button"
                    onClick={togglePopup}
                    className="mt-2 w-full bg-card-2 text-ink font-semibold p-2 rounded-xl transition-colors duration-300 hover:bg-card-3"
                  >
                    취소
                  </button>
                </form>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold mb-2">비밀번호 재설정</p>
                <p className="text-sm text-ink-2">새로운 비밀번호를 입력하세요.</p>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="새 비밀번호"
                    className="p-2 border border-line rounded-xl w-full mt-2"
                    required
                  />
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-[calc(50%-3px)] flex items-center text-ink-2 cursor-pointer"
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
                <div className="relative">
                  <input
                    type= {showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="비밀번호 확인"
                    className="p-2 border border-line rounded-xl w-full mt-2"
                    required
                  />
                  <div
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-[calc(50%-3px)] flex items-center text-ink-2 cursor-pointer"
                    role="button"
                    aria-label="비밀번호 확인 보기/숨기기"
                  >
                    {showConfirmPassword ? (
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
                  type="button"
                  onClick={handlePasswordChange}
                  className="mt-4 w-full bg-accent text-white font-semibold p-2 rounded-xl transition-colors duration-300 hover:bg-accent/90"
                >
                  비밀번호 변경
                </button>
                <button
                    type="button"
                    onClick={togglePopup}
                    className="mt-2 w-full bg-card-2 text-ink font-semibold p-2 rounded-xl transition-colors duration-300 hover:bg-card-3"
                  >
                    취소
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FindPassword;
