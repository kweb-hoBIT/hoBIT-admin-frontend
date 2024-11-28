import ProtectedPage from '../components/ProtectedPage';
import Header from '../components/Header';
import FAQFilter from '../components/faq/FAQFilter';

const FAQsPage: React.FC = () => {
  return (
    <ProtectedPage>
    <div>
      <Header />
      <main>
        <FAQFilter />
      </main>
    </div>
    </ProtectedPage>
  );
};

export default FAQsPage;