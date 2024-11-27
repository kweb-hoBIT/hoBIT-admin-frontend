import Header from '../components/Header';
import ProtectedPage from '../components/ProtectedPage';
import AnalyzeFilter from '../components/log/AnalyzeFilter';

const LogAnalyticsPage: React.FC = () => {
  return (
    <ProtectedPage>
    <div>
      <Header />
      <main>
        <AnalyzeFilter />
      </main>
    </div>
    </ProtectedPage>
  );
};

export default LogAnalyticsPage;
