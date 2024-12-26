import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

import Header from '../components/Header/Header';
import Signup from '../components/Signup/Signup';

const SignupPage: React.FC = () => {
  const isEmpty = useSelector((state: RootState) => state.input?.isEmpty);

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
