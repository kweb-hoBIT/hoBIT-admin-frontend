import ProtectedPage from '../components/ProtectedPage';
import KeywordMain from '../components/Keyword/KeywordMain';

const KeywordPage: React.FC = () => (
  <ProtectedPage>
    <main>
      <KeywordMain />
    </main>
  </ProtectedPage>
);

export default KeywordPage;
