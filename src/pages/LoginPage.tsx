// pages/LoginPage.tsx
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

import Header from '../components/Header';
import Login from '../components/auth/Login';  // Login 컴포넌트 import

const LoginPage: React.FC = () => {
  // Redux 상태 예시 (필요 시 사용)
  const isEmpty = useSelector((state: RootState) => state.input?.isEmpty);

  return (
    <div>
      {/* 공통 헤더 */}
      <Header />

      {/* 로그인 폼 콘텐츠 영역 */}
      <main className="flex justify-center items-center h-screen">
        {/* Login 컴포넌트 호출 */}
        <Login />
      </main>
    </div>
  );
};

export default LoginPage;
