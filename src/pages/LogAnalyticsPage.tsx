import ProtectedPage from '../components/ProtectedPage';
import AnalyzeMain from '../components/Log/AnalyzeMain/AnalyzeMain';

const LogAnalyticsPage: React.FC = () => {
  return (
    <ProtectedPage>
    <div>
      <main>
        <AnalyzeMain />
      </main>
    </div>
    </ProtectedPage>
  );
};

export default LogAnalyticsPage;
