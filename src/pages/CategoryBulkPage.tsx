import ProtectedPage from '../components/ProtectedPage';
import CategoryMain from '../components/Category/CategoryMain';

/** 관리 > 담당자·이메일 */
const CategoryBulkPage: React.FC = () => (
  <ProtectedPage>
    <div>
      <main>
        <CategoryMain section="bulk" />
      </main>
    </div>
  </ProtectedPage>
);

export default CategoryBulkPage;
