import ProtectedPage from '../components/ProtectedPage';
import Header from '../components/Header/Header';
import SeniorFAQCategoryReorder from '../components/Category/SeniorFAQ/Reorder/SeniorFAQCategoryReorder';

const SeniorFAQCategoryReorderPage: React.FC = () => {

  return (
    <ProtectedPage>
    <div>
      <Header />
      <main>
        <SeniorFAQCategoryReorder />
      </main>
    </div>
    </ProtectedPage>
  );
};

export default SeniorFAQCategoryReorderPage;
