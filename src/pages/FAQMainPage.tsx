import ProtectedPage from '../components/ProtectedPage';
import FAQMain from '../components/FAQ/FAQMain/FAQMain';

const FAQMainPage: React.FC = () => {
  return (
    <ProtectedPage>
    <div>
      <main>
        <FAQMain />
      </main>
    </div>
    </ProtectedPage>
  );
};

export default FAQMainPage;