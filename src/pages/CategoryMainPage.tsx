import ProtectedPage from '../components/ProtectedPage';
import CategoryMain from '../components/Category/CategoryMain';

const CategoryPage: React.FC = () => {

  return (
    <ProtectedPage>
    <div>
      <main>
        <CategoryMain />
      </main>
    </div>
    </ProtectedPage>
  );
};

export default CategoryPage;
