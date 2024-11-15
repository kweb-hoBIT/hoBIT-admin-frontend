import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

import Header from '../components/Header.tsx';

const MainPage: React.FC = () => {
  const isEmpty = useSelector((state: RootState) => state.input.isEmpty);

  return (
    <>
      <Header />
    </>
  );
};

export default MainPage;
