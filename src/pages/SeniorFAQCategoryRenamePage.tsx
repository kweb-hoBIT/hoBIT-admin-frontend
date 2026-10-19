import ProtectedPage from '../components/ProtectedPage';
import SeniorFAQCategoryRename from '../components/Category/SeniorFAQ/Rename/SeniorFAQCategoryRename';

const FAQCategoryRenamePage: React.FC = () => {

  return (
    <ProtectedPage>
    <div>
      <main>
        <SeniorFAQCategoryRename />
      </main>
    </div>
    </ProtectedPage>
  );
};

export default FAQCategoryRenamePage;
