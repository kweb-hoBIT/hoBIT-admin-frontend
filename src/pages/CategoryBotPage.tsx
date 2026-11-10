import ProtectedPage from '../components/ProtectedPage';
import BotSettings from '../components/Category/BotSettings';
import CrawlSettings from '../components/Category/CrawlSettings';

/** 관리 > 챗봇 설정 — 답변 자유도·길이, 대학원 답변, 주변 장소 검색, 학식, 과다 사용 기준 + 정기 수집 */
const CategoryBotPage: React.FC = () => (
  <ProtectedPage>
    <div>
      <main>
        <BotSettings />
        <CrawlSettings />
      </main>
    </div>
  </ProtectedPage>
);

export default CategoryBotPage;
