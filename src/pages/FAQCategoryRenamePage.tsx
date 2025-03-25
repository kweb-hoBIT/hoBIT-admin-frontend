import ProtectedPage from '../components/ProtectedPage';
import Header from '../components/Header/Header';
import FAQCategoryRename from '../components/Category/FAQ/Rename/FAQCategoryRename';

const FAQCategoryRenamePage: React.FC = () => {

  return (
    <ProtectedPage>
    <div>
      <Header />
      <main>
        <FAQCategoryRename />
      </main>
    </div>
    </ProtectedPage>
  );
};

export default FAQCategoryRenamePage;
