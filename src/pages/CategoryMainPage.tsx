import ProtectedPage from '../components/ProtectedPage';
import Header from '../components/Header/Header';
import CategoryMain from '../components/Category/CategoryMain';

const CategoryPage: React.FC = () => {

  return (
    <ProtectedPage>
    <div>
      <Header />
      <main>
        <CategoryMain />
      </main>
    </div>
    </ProtectedPage>
  );
};

export default CategoryPage;
