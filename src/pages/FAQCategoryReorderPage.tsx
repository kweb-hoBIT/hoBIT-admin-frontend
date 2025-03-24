import ProtectedPage from '../components/ProtectedPage';
import Header from '../components/Header/Header';
import FAQCategoryReorder from '../components/Category/FAQ/Reorder/FAQCategoryReorder';

const FAQCategoryReorderPage: React.FC = () => {

  return (
    <ProtectedPage>
    <div>
      <Header />
      <main>
        <FAQCategoryReorder />
      </main>
    </div>
    </ProtectedPage>
  );
};

export default FAQCategoryReorderPage;
