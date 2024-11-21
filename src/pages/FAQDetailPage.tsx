import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useParams } from 'react-router-dom';

import Header from '../components/Header';
import FaqDetailsTitle from '../components/faqs/FaqDetailsTitle';
import FaqDetailsMain from '../components/faqs/FaqDetailsMain';

const FAQDetailPage: React.FC = () => {
  const isEmpty = useSelector((state: RootState) => state.input?.isEmpty);
  const { id } = useParams<{ id: string }>();
  const faqId = Number(id);

  return (
    <div>
      <Header />
      <main>
        <FaqDetailsTitle />
        <FaqDetailsMain faqId={faqId}/>

      </main>
    </div>
  );
};

export default FAQDetailPage;
