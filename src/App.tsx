// App.tsx
import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';

import store from './redux/store';
import Layout from './components/Layout/Layout';
import { DialogHost } from './components/ui/Dialog';
import envs from './config/envs';
import { ROUTES, warmRoutes, seniorCanOpen } from './routes';
import { ChatProvider, useChat } from './components/Chat/ChatProvider';

// 목록을 오가도 30초 안에는 받아 둔 데이터를 바로 보여줌 (예전엔 화면에 들어갈 때마다 새로 받았음).
// 창을 다시 볼 때마다 다시 받던 것(refetchOnWindowFocus)도 끔.
// 등록·수정·삭제(POST/PUT/DELETE)가 끝나면 받아 둔 데이터를 모두 낡은 것으로 표시 → 목록에 바로 반영
const queryClient: QueryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: () => queryClient.invalidateQueries(),
  }),
  defaultOptions: {
    queries: { staleTime: 30_000, gcTime: 10 * 60_000, refetchOnWindowFocus: false, retry: 1 },
  },
});

/** 화면 코드를 받는 동안 — 헤더는 그대로 두고 본문 자리만 */
const PageFallback: React.FC = () => (
  <div className="flex justify-center py-24" aria-busy="true">
    <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-card-2 border-t-accent-ink" />
  </div>
);

/** 근로장학생 계정은 허용된 화면만 — 다른 주소로 들어오면 선배 FAQ로 (서버도 막지만 빈 화면·오류 대신) */
const RoleGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role } = useChat();
  const { pathname } = useLocation();
  if (role === 'senior' && !seniorCanOpen(pathname)) return <Navigate to="/seniorfaqs" replace />;
  return <>{children}</>;
};

/** 베타 점검 스위치 — 관리자 API가 "점검 중"(503)이라고 알려주면 안내만 (연결 실패는 막지 않음) */
const MaintenanceGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    const ctrl = new AbortController();
    const t = window.setTimeout(() => ctrl.abort(), 4000);
    fetch(`${envs.HOBIT_ADMIN_BACKEND_ENDPOINT}/health`, { signal: ctrl.signal })
      .then(async (r) => {
        if (r.status !== 503) return;
        const body = await r.json().catch(() => null);
        if (body?.maintenance) setMessage(body.message || '서비스 점검 중이에요.');
      })
      .catch(() => undefined)
      .finally(() => window.clearTimeout(t));
    return () => ctrl.abort();
  }, []);
  if (!message) return <>{children}</>;
  return (
    // 학생 화면의 서버 오류 화면과 같은 모양 (우는 hoBIT)
    <div className="flex min-h-screen flex-col items-center justify-center bg-card px-4 text-center">
      <img src="/error_image.png" alt="" className="mb-6 w-48 md:w-64" />
      <h1 className="mb-2 text-xl font-semibold text-ink">잠시 쉬어가요</h1>
      <p className="mb-6 text-ink-2">{message}</p>
      <button type="button" onClick={() => window.location.reload()} className="rounded-full bg-accent px-6 py-2 font-semibold text-white hover:bg-accent/90">
        새로고침
      </button>
    </div>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    warmRoutes();
  }, []);

  return (
    <MaintenanceGate>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <ChatProvider>
          <Layout>
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                {ROUTES.map(({ path, Component }) => (
                  <Route key={path} path={path} element={<RoleGate><Component /></RoleGate>} />
                ))}
              </Routes>
            </Suspense>
          </Layout>
          </ChatProvider>
          <DialogHost />
        </Router>
      </QueryClientProvider>
    </Provider>
    </MaintenanceGate>
  );
};

export default App;
