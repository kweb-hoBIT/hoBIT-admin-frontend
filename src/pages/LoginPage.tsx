import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

import Header from '../components/Header';
import Login from '../components/auth/Login';

const LoginPage: React.FC = () => {
  const isEmpty = useSelector((state: RootState) => state.input?.isEmpty);

  return (
    <div>
      <Header />
      <main className="flex justify-center items-center h-screen">
        <Login />
      </main>
    </div>
  );
};

export default LoginPage;
