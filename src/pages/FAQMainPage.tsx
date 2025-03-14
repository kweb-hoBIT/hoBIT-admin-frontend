import ProtectedPage from '../components/ProtectedPage';
import Header from '../components/Header/Header';
import FAQMain from '../components/FAQ/FAQMain/FAQMain';

const FAQMainPage: React.FC = () => {
  return (
    <ProtectedPage>
    <div>
      <Header />
      <main>
        <FAQMain />
      </main>
    </div>
    </ProtectedPage>
  );
};

export default FAQMainPage;