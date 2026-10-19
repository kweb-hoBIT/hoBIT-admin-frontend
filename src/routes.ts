import { lazy, ComponentType } from 'react';
import { matchPath } from 'react-router-dom';

/**
 * 화면 목록 — 화면마다 따로 받음 (예전엔 26개 화면과 Swagger·차트 라이브러리를 첫 로딩에 한꺼번에 받았음)
 * 같은 import 함수를 lazy()와 미리 받기(prefetchRoute)가 함께 써서, 미리 받은 화면은 누르는 순간 바로 뜸.
 */
type Importer = () => Promise<{ default: ComponentType }>;

type RouteDef = { path: string; load: Importer; Component: ComponentType };

const def = (path: string, load: Importer): RouteDef => ({ path, load, Component: lazy(load) });

export const ROUTES: RouteDef[] = [
  def('/api-docs', () => import('./pages/SwaggerPage')),
  def('/login', () => import('./pages/LoginPage')),
  def('/signup', () => import('./pages/SignupPage')),
  def('/home', () => import('./pages/HomePage')),

  def('/faqs', () => import('./pages/FAQMainPage')),
  def('/faqs/create', () => import('./pages/FAQCreatePage')),
  def('/faqs/update/:id', () => import('./pages/FAQUpdatePage')),
  def('/faqs/:id', () => import('./pages/FAQDetailPage')),

  def('/seniorfaqs', () => import('./pages/SeniorFAQMainPage')),
  def('/seniorfaqs/create', () => import('./pages/SeniorFAQCreatePage')),
  def('/seniorfaqs/update/:id', () => import('./pages/SeniorFAQUpdatePage')),
  def('/seniorfaqs/:id', () => import('./pages/SeniorFAQDetailPage')),

  def('/categories', () => import('./pages/CategoryMainPage')),
  def('/categories/faq/rename', () => import('./pages/FAQCategoryRenamePage')),
  def('/categories/faq/reorder', () => import('./pages/FAQCategoryReorderPage')),
  def('/categories/seniorfaq/rename', () => import('./pages/SeniorFAQCategoryRenamePage')),
  def('/categories/seniorfaq/reorder', () => import('./pages/SeniorFAQCategoryReorderPage')),
  def('/categories/email/bulk-delete', () => import('./pages/BulkDeleteEmailPage')),
  def('/categories/email/bulk-update', () => import('./pages/BulkUpdateEmailPage')),
  def('/categories/admin/bulk-delete', () => import('./pages/BulkDeleteAdminPage')),
  def('/categories/admin/bulk-update', () => import('./pages/BulkUpdateAdminPage')),

  def('/logs', () => import('./pages/LogsPage')),
  def('/logs/analytics', () => import('./pages/LogAnalyticsPage')),
  def('/adminlogs/faqlogs/:id', () => import('./pages/FAQLogDetailPage')),
  def('/adminlogs/seniorfaqlogs/:id', () => import('./pages/SeniorFAQLogDetailPage')),

  def('/userfeedbacks', () => import('./pages/UserFeedbackPage')),
  def('/keywords', () => import('./pages/KeywordPage')),
  def('/chats', () => import('./pages/ChatPage')),
  def('/mypage', () => import('./pages/MyPage')),
];

/** 근로장학생 계정이 열 수 있는 화면 — 선배 FAQ, 관리의 선배 FAQ 카테고리, 선배 채팅, 마이페이지 (서버도 같은 범위만 허용) */
const SENIOR_PATHS = [/^\/seniorfaqs(\/|$)/, /^\/categories\/?$/, /^\/categories\/seniorfaq\//, /^\/adminlogs\/seniorfaqlogs\//, /^\/chats\/?$/, /^\/home\/?$/, /^\/mypage\/?$/, /^\/(login|signup)\/?$/];
export const seniorCanOpen = (pathname: string) => SENIOR_PATHS.some((re) => re.test(pathname));

const requested = new Set<string>();

/** 그 주소의 화면 코드를 미리 받아 둠 (메뉴에 마우스를 올렸을 때 등). 여러 번 불러도 한 번만 받음 */
export function prefetchRoute(to: string) {
  const path = to.split('?')[0];
  const route = ROUTES.find((r) => matchPath(r.path, path));
  if (!route || requested.has(route.path)) return;
  requested.add(route.path);
  route.load().catch(() => requested.delete(route.path)); // 실패하면 다음에 다시
}

/** 자주 쓰는 화면은 브라우저가 한가할 때 미리 받음 (Swagger·로그 분석처럼 무거운 화면은 마우스를 올렸을 때만) */
const WARM_PATHS = ['/chats', '/home', '/faqs', '/seniorfaqs', '/faqs/1', '/seniorfaqs/1', '/keywords', '/logs', '/userfeedbacks', '/categories'];

export function warmRoutes() {
  const idle: (cb: () => void) => void =
    (window as any).requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
  WARM_PATHS.forEach((p, i) => window.setTimeout(() => idle(() => prefetchRoute(p)), i * 150));
}
