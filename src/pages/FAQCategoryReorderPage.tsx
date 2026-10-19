import ProtectedPage from '../components/ProtectedPage';
import FAQCategoryReorder from '../components/Category/FAQ/Reorder/FAQCategoryReorder';

const FAQCategoryReorderPage: React.FC = () => {

  return (
    <ProtectedPage>
    <div>
      <main>
        <FAQCategoryReorder />
      </main>
    </div>
    </ProtectedPage>
  );
};

export default FAQCategoryReorderPage;
