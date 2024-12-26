import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAccessToken } from '../redux/authSlice';
import { RootState } from '../redux/store';
import { useHobitMutatePostApi } from '../hooks/hobitAdmin';
import { selectAuth } from '../redux/authSlice';
import { jwtDecode } from 'jwt-decode';
import { NewAccessTokenRequest, NewAccessTokenResponse } from '../types/user';

interface ProtectedPageProps {
  children: React.ReactNode;
}

const ProtectedPage: React.FC<ProtectedPageProps> = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const NewAccessTokenApi = useHobitMutatePostApi<NewAccessTokenRequest, NewAccessTokenResponse>('auth/refresh');

  // Redux에서 인증 상태 가져오기
  const { accessToken, refreshToken } = useSelector((state: RootState) => selectAuth(state));

  useEffect(() => {
    const checkTokenExpiration = async () => {
      if (accessToken && refreshToken) {
        try {
          // JWT 디코딩하여 만료 시간 확인
          const decodedAccessToken: any = jwtDecode(accessToken);
          const decodedRefreshToken: any = jwtDecode(refreshToken);
          const currentTime = Date.now() / 1000;
          
          if (decodedAccessToken.exp < currentTime) {
            if (decodedRefreshToken.exp < currentTime) {
              // 리프레시 토큰도 만료되었으면 로그인 페이지로 이동
              navigate('/login');
            } else {
              // 리프레시 토큰을 사용하여 새로운 accessToken을 요청
              const response = await NewAccessTokenApi({ 
                body : { refreshToken }
              });

              if (response.payload?.statusCode === 200) {
                const { accessToken } = response.payload.data ?? {};
                if (accessToken) {
                  dispatch(setAccessToken(accessToken));
                }
              } else {
                navigate('/login');
              }
            }
          }
        } catch (error) {
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    checkTokenExpiration();
  }, [accessToken, refreshToken, navigate, NewAccessTokenApi]);

  return accessToken ? <>{children}</> : null; // 인증된 사용자만 children을 렌더링
};

export default ProtectedPage;
