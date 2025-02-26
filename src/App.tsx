// App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';

import store from './redux/store';

// 페이지 컴포넌트 임포트
import Layout from './components/Layout/Layout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import FAQMainPage from './pages/FAQMainPage';
import FAQDetailPage from './pages/FAQDetailPage';
import FAQCreatePage from './pages/FAQCreatePage';
import FAQUpdatePage from './pages/FAQUpdatePage';
import SeniorFAQMainPage from './pages/SeniorFAQMainPage';
import SeniorFAQDetailPage from './pages/SeniorFAQDetailPage';
import SeniorFAQCreatePage from './pages/SeniorFAQCreatePage';
import SeniorFAQUpdatePage from './pages/SeniorFAQUpdatePage';
import LogsPage from './pages/LogsPage';
import FAQLogDetailPage from './pages/FAQLogDetailPage';
import SeniorFAQLogDetailPage from './pages/SeniorFAQLogDetailPage';
import LogAnalyticsPage from './pages/LogAnalyticsPage';
import UserFeedbackPage from './pages/UserFeedbackPage';

const queryClient = new QueryClient();

const App: React.FC = () => {

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Layout>
            <Routes>
              {/* 시작 페이지 */}
              <Route path="/" element={<Navigate to="/login" />} />
              
              {/* 인증 관련 페이지 */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              
              {/* 메인 페이지 */}
              <Route path="/home" element={<HomePage />} />

              {/* FAQ 관련 페이지 */}
              <Route path="/faqs" element={<FAQMainPage />} />
              <Route path="/faqs/:id" element={<FAQDetailPage />} />
              <Route path="/faqs/create" element={<FAQCreatePage />} />
              <Route path="/faqs/update/:id" element={<FAQUpdatePage />} />

              {/* Senior FAQ 관련 페이지 */}
              <Route path="/seniorfaqs" element={<SeniorFAQMainPage />} />
              <Route path="/seniorfaqs/:id" element={<SeniorFAQDetailPage />} />
              <Route path="/seniorfaqs/create" element={<SeniorFAQCreatePage />} />
              <Route path="/seniorfaqs/update/:id" element={<SeniorFAQUpdatePage />} />

              {/* 로그 관련 페이지 */}
              <Route path="/logs" element={<LogsPage />} />
              <Route path="/adminlogs/faqlogs/:id" element={<FAQLogDetailPage />} />
              <Route path="/adminlogs/seniorfaqlogs/:id" element={<SeniorFAQLogDetailPage />} />
              <Route path="/logs/analytics" element={<LogAnalyticsPage />} />

              {/* 유저 피드백 관련 페이지 */}
              <Route path="/userfeedbacks" element={<UserFeedbackPage />} />
              
              </Routes>
            </Layout>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
