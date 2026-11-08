import ProtectedPage from '../components/ProtectedPage';
import ChatFeatures from '../components/Category/ChatFeatures';

/** 관리 > 채팅 — 행정실 채팅·근로장학생 채팅 켜고 끄기, 학교 메일 인증 */
const CategoryChatPage: React.FC = () => (
  <ProtectedPage>
    <div>
      <main>
        <ChatFeatures />
      </main>
    </div>
  </ProtectedPage>
);

export default CategoryChatPage;
