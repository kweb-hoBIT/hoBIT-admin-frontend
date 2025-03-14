import Header from '../components/Header/Header';
import Login from '../components/User/Login/Login';

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
