import React from 'react';
import { Link } from 'react-router-dom';
import { prefetchRoute } from '../../routes';
import { useChat } from '../Chat/ChatProvider';

const GROUPS = [
  {
    title: '카테고리',
    items: [
      { path: '/categories/faq/rename', label: 'FAQ 카테고리 이름 수정' },
      { path: '/categories/faq/reorder', label: 'FAQ 카테고리 순서 수정' },
      { path: '/categories/seniorfaq/rename', label: '선배 FAQ 카테고리 이름 수정' },
      { path: '/categories/seniorfaq/reorder', label: '선배 FAQ 카테고리 순서 수정' },
    ],
  },
  {
    title: '일괄 관리',
    items: [
      { path: '/categories/email/bulk-update', label: '이메일 변경' },
      { path: '/categories/email/bulk-delete', label: '이메일 삭제', danger: true },
      { path: '/categories/admin/bulk-update', label: '관리자 변경' },
      { path: '/categories/admin/bulk-delete', label: '관리자 삭제', danger: true },
    ],
  },
];

const CategoryMain: React.FC = () => {
  const { role } = useChat();
  // 근로장학생은 선배 FAQ 카테고리만
  const groups =
    role === 'senior'
      ? GROUPS.map((g) => ({ ...g, items: g.items.filter((i) => i.path.startsWith('/categories/seniorfaq/')) })).filter((g) => g.items.length)
      : GROUPS;
  return (
  <div className="mx-auto max-w-[880px] py-10">
    <h1 className="mb-1 text-[28px] font-bold text-ink">관리</h1>
    <p className="mb-6 text-ink-2">{role === 'senior' ? '선배 FAQ 카테고리 이름·순서를 바꿉니다.' : '카테고리 이름·순서와 이메일·관리자를 한꺼번에 바꿉니다.'}</p>
    <div className={`grid gap-6 ${groups.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
      {groups.map((group) => (
        <section key={group.title} className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="mb-3 text-sm font-semibold text-ink-3">{group.title}</h2>
          <ul className="flex flex-col gap-1">
            {group.items.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onMouseEnter={() => prefetchRoute(item.path)}
                  onFocus={() => prefetchRoute(item.path)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 font-semibold transition-colors hover:bg-card ${
                    'danger' in item && item.danger ? 'text-danger' : 'text-ink hover:text-accent-ink'
                  }`}
                >
                  {item.label}
                  <span aria-hidden="true" className="text-ink-3">›</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  </div>
  );
};

export default CategoryMain;
