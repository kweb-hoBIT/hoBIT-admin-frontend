import ProtectedPage from '../components/ProtectedPage';
import BotSettings from '../components/Category/BotSettings';

/** 관리 > 챗봇 설정 — 답변 자유도·길이, 주변 장소 검색, 학식, 과다 사용 기준 */
const CategoryBotPage: React.FC = () => (
  <ProtectedPage>
    <div>
      <main>
        <BotSettings />
      </main>
    </div>
  </ProtectedPage>
);

export default CategoryBotPage;
