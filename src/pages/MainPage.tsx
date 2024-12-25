import ProtectedPage from '../components/ProtectedPage';
import Header from '../components/Header/Header';
import Main from '../components/Main/Main';

const MainPage: React.FC = () => {
  return (
    <ProtectedPage>
    <div>
      <Header />
      <main>
      <Main />
      </main>
    </div>
    </ProtectedPage>
  );
};

export default MainPage;
