import ProtectedPage from '../components/ProtectedPage';
import Header from '../components/Header/Header';
import SeniorFAQCategoryRename from '../components/Category/SeniorFAQ/Rename/SeniorFAQCategoryRename';

const FAQCategoryRenamePage: React.FC = () => {

  return (
    <ProtectedPage>
    <div>
      <Header />
      <main>
        <SeniorFAQCategoryRename />
      </main>
    </div>
    </ProtectedPage>
  );
};

export default FAQCategoryRenamePage;
