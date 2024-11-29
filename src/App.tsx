// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';

import store from './redux/store';

// 페이지 컴포넌트 임포트
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MainPage from './pages/MainPage';
import FAQsPage from './pages/FAQsPage';
import FAQDetailPage from './pages/FAQDetailPage';
import FAQCreatePage from './pages/FAQCreatePage';
import FAQUpdatePage from './pages/FAQUpdatePage';
import LogsPage from './pages/LogsPage';
import FAQLogDetailPage from './pages/FAQLogDetailPage';
import LogAnalyticsPage from './pages/LogAnalyticsPage';


const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* 시작 페이지 */}
            <Route path="/" element={<Navigate to="/login" />} />
            
            {/* 인증 관련 페이지 */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* 메인 페이지 */}
            <Route path="/main" element={<MainPage />} />

            {/* FAQ 관련 페이지 */}
            <Route path="/faqs" element={<FAQsPage />} />
            <Route path="/faqs/create" element={<FAQCreatePage />} />
            <Route path="/faqs/update/:id" element={<FAQUpdatePage />} />
            <Route path="/faqs/:id" element={<FAQDetailPage />} />

            {/* 로그 관련 페이지 */}
            <Route path="/logs" element={<LogsPage />} />
            <Route path="/logs/:id" element={<FAQLogDetailPage />} />
            <Route path="/logs/analytics" element={<LogAnalyticsPage />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
};


export default App;
