import ProtectedPage from '../components/ProtectedPage';
import AnswerReviewMain from '../components/AnswerReview/AnswerReviewMain';

const AnswerReviewPage: React.FC = () => (
  <ProtectedPage>
    <main>
      <AnswerReviewMain />
    </main>
  </ProtectedPage>
);

export default AnswerReviewPage;
