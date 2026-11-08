import React from 'react';
import { Link } from 'react-router-dom';
import { prefetchRoute } from '../../routes';
import { useChat } from '../Chat/ChatProvider';

type Item = { path: string; label: string; desc: string; danger?: boolean };
type Group = { title: string; items: Item[] };

// 관리 — 헤더 아래 줄 탭: 카테고리 · 프로필 항목(별도 화면) · 담당자·이메일
const SECTIONS: Record<'category' | 'bulk', { title: string; desc: string; groups: Group[] }> = {
  category: {
    title: '카테고리',
    desc: '학생 화면 메뉴에 보이는 FAQ 분류의 이름과 순서를 바꿔요.',
    groups: [
      {
        title: '행정실 FAQ',
        items: [
          { path: '/categories/faq/rename', label: '카테고리 이름 수정', desc: '대분류·소분류 이름을 한 번에 바꿔요' },
          { path: '/categories/faq/reorder', label: '카테고리 순서 수정', desc: '메뉴에 보이는 순서를 끌어서 바꿔요' },
        ],
      },
      {
        title: '선배 FAQ',
        items: [
          { path: '/categories/seniorfaq/rename', label: '카테고리 이름 수정', desc: '대분류·소분류 이름을 한 번에 바꿔요' },
          { path: '/categories/seniorfaq/reorder', label: '카테고리 순서 수정', desc: '메뉴에 보이는 순서를 끌어서 바꿔요' },
        ],
      },
    ],
  },
  bulk: {
    title: '담당자·이메일',
    desc: 'FAQ 답변에 적힌 담당자 이름과 이메일을 모든 FAQ에서 한 번에 바꾸거나 지워요. 엑셀의 담당자·이메일 시트로도 바꿀 수 있어요.',
    groups: [
      {
        title: '담당자',
        items: [
          { path: '/categories/admin/bulk-update', label: '담당자 변경', desc: '한 담당자의 이름을 모든 FAQ에서 바꿔요' },
          { path: '/categories/admin/bulk-delete', label: '담당자 삭제', desc: '모든 FAQ에서 그 담당자를 지워요', danger: true },
        ],
      },
      {
        title: '이메일',
        items: [
          { path: '/categories/email/bulk-update', label: '이메일 변경', desc: '한 이메일을 모든 답변에서 바꿔요' },
          { path: '/categories/email/bulk-delete', label: '이메일 삭제', desc: '모든 답변에서 그 이메일을 지워요', danger: true },
        ],
      },
    ],
  },
};

const CategoryMain: React.FC<{ section?: 'category' | 'bulk' }> = ({ section = 'category' }) => {
  const { role } = useChat();
  const sec = SECTIONS[section];
  // 근로장학생은 선배 FAQ 카테고리만
  const groups = role === 'senior' ? sec.groups.filter((g) => g.title === '선배 FAQ') : sec.groups;
  return (
    <section className="panel p-6">
      <h4 className="text-xl font-bold text-ink">{sec.title}</h4>
      <p className="mt-1 text-sm text-ink-3">{sec.desc}</p>
      <div className={`mt-5 grid gap-4 ${groups.length > 1 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
        {groups.map((group, gi) => (
          <div key={group.title} className="reveal rounded-2xl border border-line p-4" style={{ animationDelay: `${gi * 60}ms` }}>
            <h5 className="mb-2 px-2 text-sm font-semibold text-ink-3">{group.title}</h5>
            <ul className="flex flex-col gap-1">
              {group.items.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onMouseEnter={() => prefetchRoute(item.path)}
                    onFocus={() => prefetchRoute(item.path)}
                    className="group flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-card"
                  >
                    <span className="min-w-0">
                      <span className={`block font-semibold ${item.danger ? 'text-danger' : 'text-ink group-hover:text-accent-ink'}`}>{item.label}</span>
                      <span className="block truncate text-sm text-ink-3">{item.desc}</span>
                    </span>
                    <span aria-hidden="true" className="text-ink-3">›</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryMain;
