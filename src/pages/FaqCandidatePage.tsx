import ProtectedPage from '../components/ProtectedPage';
import FaqCandidateMain from '../components/FaqCandidate/FaqCandidateMain';

const FaqCandidatePage: React.FC = () => (
  <ProtectedPage>
    <main>
      <FaqCandidateMain />
    </main>
  </ProtectedPage>
);

export default FaqCandidatePage;
