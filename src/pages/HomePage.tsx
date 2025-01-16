import ProtectedPage from '../components/ProtectedPage';
import Header from '../components/Header/Header';
import Home from '../components/Home/Home';

const MainPage: React.FC = () => {
  return (
    <ProtectedPage>
    <div>
      <Header />
      <main>
      <Home />
      </main>
    </div>
    </ProtectedPage>
  );
};

export default MainPage;
