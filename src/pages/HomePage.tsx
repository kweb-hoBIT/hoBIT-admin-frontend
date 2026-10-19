import ProtectedPage from '../components/ProtectedPage';
import Home from '../components/Home/Home';

const MainPage: React.FC = () => {
  return (
    <ProtectedPage>
    <div>
      <main>
      <Home />
      </main>
    </div>
    </ProtectedPage>
  );
};

export default MainPage;
