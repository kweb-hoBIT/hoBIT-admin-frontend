import ProtectedPage from '../components/ProtectedPage';
import FAQCategoryRename from '../components/Category/FAQ/Rename/FAQCategoryRename';

const FAQCategoryRenamePage: React.FC = () => {

  return (
    <ProtectedPage>
    <div>
      <main>
        <FAQCategoryRename />
      </main>
    </div>
    </ProtectedPage>
  );
};

export default FAQCategoryRenamePage;
