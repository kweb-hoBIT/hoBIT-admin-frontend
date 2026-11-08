import ProtectedPage from '../components/ProtectedPage';
import LogMain from '../components/Log/LogMain/LogMain';

/** 관리자 로그 — FAQ·선배 FAQ를 누가 언제 바꿨는지 */
const AdminLogsPage: React.FC = () => (
  <ProtectedPage>
    <div>
      <main>
        <LogMain view="admin" />
      </main>
    </div>
  </ProtectedPage>
);

export default AdminLogsPage;
