import { useSelector } from 'react-redux';

import Header from '../components/Header/Header';
import Signup from '../components/User/Signup/Signup';

const SignupPage: React.FC = () => {
  return (
    <div>
      <Header />
      <main>
      <main>
        <Signup/>
      </main>
      </main>
    </div>
  );
};

export default SignupPage;
