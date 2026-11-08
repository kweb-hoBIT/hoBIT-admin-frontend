import ProtectedPage from '../components/ProtectedPage';
import FAQMain from '../components/FAQ/FAQMain/FAQMain';

/** 대학원 FAQ — 대상이 대학원·공통인 행정실 FAQ (학부 FAQ 화면과 같은 목록, 거르는 대상만 다름) */
const FAQGradPage: React.FC = () => (
  <ProtectedPage>
    <div>
      <main>
        <FAQMain view="graduate" />
      </main>
    </div>
  </ProtectedPage>
);

export default FAQGradPage;
