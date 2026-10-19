import ProtectedPage from '../components/ProtectedPage';
import SeniorFAQCategoryReorder from '../components/Category/SeniorFAQ/Reorder/SeniorFAQCategoryReorder';

const SeniorFAQCategoryReorderPage: React.FC = () => {

  return (
    <ProtectedPage>
    <div>
      <main>
        <SeniorFAQCategoryReorder />
      </main>
    </div>
    </ProtectedPage>
  );
};

export default SeniorFAQCategoryReorderPage;
