import ProtectedPage from '../components/ProtectedPage';
import ChatMain from '../components/Chat/ChatMain';

const ChatPage: React.FC = () => (
  <ProtectedPage>
    <main>
      <ChatMain />
    </main>
  </ProtectedPage>
);

export default ChatPage;
