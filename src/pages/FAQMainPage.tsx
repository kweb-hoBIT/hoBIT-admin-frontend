import ProtectedPage from '../components/ProtectedPage';
import Header from '../components/Header/Header';
import FAQMain from '../components/FAQMain/FAQMain';

const FAQsPage: React.FC = () => {
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

export default FAQsPage;