import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHobitMutatePostApi } from '../hooks/hobitAdmin';
import { jwtDecode } from 'jwt-decode';
import { NewAccessTokenRequest, NewAccessTokenResponse } from '../types/user';

interface ProtectedPageProps {
  children: React.ReactNode;
}

const ProtectedPage: React.FC<ProtectedPageProps> = ({ children }) => {
  const navigate = useNavigate();
  const NewAccessTokenApi = useHobitMutatePostApi<NewAccessTokenRequest, NewAccessTokenResponse>('auth/refresh');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkTokenExpiration = async () => {
      const response = await NewAccessTokenApi({ credentials: 'include' });
      if (response.payload?.statusCode === 200) {
        setIsAuthenticated(true);
      } else {
        alert("세션이 만료되어 다시 로그인 부탁드립니다.");
        setIsAuthenticated(false);
        navigate('/login');
      }
    };

    checkTokenExpiration();
  }, [NewAccessTokenApi]);

  if (isAuthenticated === false) {
    // 인증되지 않은 경우 아무것도 렌더링하지 않음
    return null;
  }

  return <>{children}</>; // 인증된 사용자만 자식 컴포넌트를 렌더링
};

export default ProtectedPage;
