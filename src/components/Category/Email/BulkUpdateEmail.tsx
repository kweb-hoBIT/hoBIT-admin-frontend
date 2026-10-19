import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { selectAuth } from '../../../redux/authSlice';
import { useHobitMutatePutApi, useHobitQueryGetApi } from '../../../hooks/hobitAdmin';
import { BulkUpdateEmailRequest, BulkUpdateEmailResponse, GetAllEmailsRequest, GetAllEmailsResponse } from '../../../types/email';

import { appAlert } from '../../ui/Dialog';
const BulkUpdateEmail: React.FC = () => {
  const { user_id } = useSelector((state: RootState) => selectAuth(state));
  const [oldEmail, setOldEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [emailList, setEmailList] = useState<string[]>([]);

  const bulkUpdateEmailApi = useHobitMutatePutApi<BulkUpdateEmailRequest, BulkUpdateEmailResponse>(
    'emails/bulk-update'
  );

  const getAllEmailsApi = useHobitQueryGetApi<GetAllEmailsRequest, GetAllEmailsResponse>('emails');

  useEffect(() => {
    if (getAllEmailsApi.data?.payload?.statusCode === 200) {
      setEmailList(getAllEmailsApi.data.payload.data.emails);
    }
  }, [getAllEmailsApi.data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!oldEmail || !newEmail) {
      appAlert('변경 전 이메일과 변경 후 이메일을 모두 입력해주세요.');
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(oldEmail) || !emailRegex.test(newEmail)) {
      appAlert('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    setShowConfirmPopup(true);
  };

  const handleConfirmUpdate = async () => {
    setIsUpdating(true);
    setShowConfirmPopup(false);

    try {
      const response = await bulkUpdateEmailApi({
        body: {
          old_email: oldEmail,
          new_email: newEmail,
          user_id: Number(user_id),
        },
      });

      if (response.payload?.statusCode === 200) {
        const { updated_faqs } = response.payload.data;
        appAlert(
          `이메일이 성공적으로 변경되었습니다!\n\n` +
          `변경된 FAQ: ${updated_faqs}건`
        );
        setOldEmail('');
        setNewEmail('');
      } else {
        appAlert('이메일 변경 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('이메일 변경 오류:', error);
      appAlert('이메일 변경 중 오류가 발생했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEmailSelect = (email: string) => {
    setOldEmail(email);
    setShowDropdown(false);
  };

  const filteredEmails = emailList.filter(email => 
    email.toLowerCase().includes(oldEmail.toLowerCase())
  );

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4.5rem)] py-10">
      <div className="bg-surface p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-ink">
          이메일 전체 변경
        </h2>
        <p className="text-sm text-ink-2 mb-6 text-center">
          모든 FAQ의 답변에서 특정 이메일을 일괄 변경합니다.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-medium text-ink mb-2">
              변경 전 이메일
            </label>
            <input
              type="text"
              value={oldEmail}
              onChange={(e) => {
                setOldEmail(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              placeholder="example@korea.ac.kr"
              className="w-full px-4 py-2 border border-line rounded-xl focus:ring-2 focus:ring-accent-ink/40 focus:border-transparent"
              disabled={isUpdating}
              autoComplete="off"
            />
            {showDropdown && filteredEmails.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-surface border border-line rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {filteredEmails.map((email, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleEmailSelect(email)}
                    className="w-full text-left px-4 py-2 hover:bg-card transition-colors"
                  >
                    {email}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">
              변경 후 이메일
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="newexample@korea.ac.kr"
              className="w-full px-4 py-2 border border-line rounded-xl focus:ring-2 focus:ring-accent-ink/40 focus:border-transparent"
              disabled={isUpdating}
            />
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 ${
              isUpdating
                ? 'bg-card-3 cursor-not-allowed'
                : 'bg-accent hover:bg-accent/90 transform hover:scale-105'
            }`}
          >
            {isUpdating ? '변경 중...' : '이메일 변경'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-warn-soft border border-warn/40 rounded-xl">
          <p className="text-sm text-warn">
            <strong>⚠️ 주의사항:</strong>
            <br />
            이 작업은 되돌릴 수 없습니다. 변경하기 전에 이메일 주소를 다시 한번 확인해주세요.
          </p>
        </div>
      </div>

      {/* 확인 팝업 */}
      {showConfirmPopup && (
        <div className="modal-overlay">
          <div className="modal-panel max-w-[440px]">
            <h3 className="text-xl font-bold mb-4 text-ink">이메일 변경 확인</h3>
            <p className="text-ink-2 mb-2">
              모든 데이터베이스에서 다음과 같이 이메일을 변경하시겠습니까?
            </p>
            <div className="bg-card p-4 rounded-xl my-4 space-y-2">
              <p className="text-sm">
                <span className="font-semibold">변경 전:</span>{' '}
                <span className="text-danger">{oldEmail}</span>
              </p>
              <p className="text-sm">
                <span className="font-semibold">변경 후:</span>{' '}
                <span className="text-success">{newEmail}</span>
              </p>
            </div>
            <p className="text-sm text-danger mb-4">
              ⚠️ 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmPopup(false)}
                className="flex-1 px-4 py-2 bg-card-2 text-ink rounded-xl hover:bg-card-3 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleConfirmUpdate}
                className="flex-1 px-4 py-2 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkUpdateEmail;
