import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHobitMutatePostApi } from '../hooks/hobitAdmin';
import { NewAccessTokenRequest, NewAccessTokenResponse } from '../types/user';
import { appAlert } from './ui/Dialog';

interface ProtectedPageProps {
  children: React.ReactNode;
}

// 로그인 확인은 몇 분에 한 번만 — 예전엔 화면을 옮길 때마다 토큰 갱신 요청을 보냈음
// (토큰이 만료되면 API가 401을 주므로 그 사이 만료돼도 데이터가 새지는 않음)
const RECHECK_MS = 5 * 60 * 1000;
let verifiedAt = 0;

/** 로그아웃·탈퇴 때 다음 화면에서 바로 다시 확인하도록 */
export const resetAuthCheck = () => {
  verifiedAt = 0;
};

const ProtectedPage: React.FC<ProtectedPageProps> = ({ children }) => {
  const navigate = useNavigate();
  const NewAccessTokenApi = useHobitMutatePostApi<NewAccessTokenRequest, NewAccessTokenResponse>('auth/refresh');

  useEffect(() => {
    if (Date.now() - verifiedAt < RECHECK_MS) return;
    let cancelled = false;
    (async () => {
      const response = await NewAccessTokenApi({});
      if (cancelled) return;
      if (response.payload?.statusCode === 200) {
        verifiedAt = Date.now();
      } else {
        verifiedAt = 0;
        appAlert('세션이 만료되어 다시 로그인 부탁드립니다.');
        navigate('/login');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [NewAccessTokenApi, navigate]);

  return <>{children}</>;
};

export default ProtectedPage;
