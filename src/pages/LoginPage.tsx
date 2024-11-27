import Header from '../components/Header';
import Login from '../components/auth/Login';

const LoginPage: React.FC = () => {
  return (
    <div>
      <Header />
      <main>
        <Login />
      </main>
    </div>
  );
};

export default LoginPage;
