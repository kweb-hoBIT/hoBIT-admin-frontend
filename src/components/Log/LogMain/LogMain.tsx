import React from 'react';
import AdminLogMain from './AdminLogMain';
import QuestionLogMain from './QuestionLogMain';

/**
 * 로그 — 유저 로그(/logs)·관리자 로그(/logs/admin)는 헤더 아래 줄 탭으로 고름
 * (예전엔 화면 안에도 탭이 있어 위 탭과 겹쳐 보였음)
 */
const LogMain: React.FC<{ view: 'question' | 'admin' }> = ({ view }) => (
  <section className="panel">{view === 'admin' ? <AdminLogMain /> : <QuestionLogMain />}</section>
);

export default LogMain;
