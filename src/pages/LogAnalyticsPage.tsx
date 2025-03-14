import Header from '../components/Header/Header';
import ProtectedPage from '../components/ProtectedPage';
import AnalyzeMain from '../components/Log/AnalyzeMain/AnalyzeMain';

const LogAnalyticsPage: React.FC = () => {
  return (
    <ProtectedPage>
    <div>
      <Header />
      <main>
        <AnalyzeMain />
      </main>
    </div>
    </ProtectedPage>
  );
};

export default LogAnalyticsPage;
