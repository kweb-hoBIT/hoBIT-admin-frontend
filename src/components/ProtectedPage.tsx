import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHobitMutatePostApi } from '../hooks/hobitAdmin';
import { NewAccessTokenRequest, NewAccessTokenResponse } from '../types/user';

interface ProtectedPageProps {
  children: React.ReactNode;
}

const ProtectedPage: React.FC<ProtectedPageProps> = ({ children }) => {
  const navigate = useNavigate();
  const NewAccessTokenApi = useHobitMutatePostApi<NewAccessTokenRequest, NewAccessTokenResponse>('auth/refresh');

  useEffect(() => {
    const checkTokenExpiration = async () => {
      const response = await NewAccessTokenApi({ credentials: 'include' });
      if (response.payload?.statusCode !== 200) {
        alert("세션이 만료되어 다시 로그인 부탁드립니다.");
        navigate('/login');
      }
    };

    checkTokenExpiration();
  }, [NewAccessTokenApi]);

  return <>{children}</>; // 인증된 사용자만 자식 컴포넌트를 렌더링
};

export default ProtectedPage;
