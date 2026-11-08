import React from 'react';
import Header from '../Header/Header';
import BackFab from '../ui/BackFab';

/** 모든 화면 공통 — 헤더는 여기 한 번만 (예전엔 화면마다 헤더를 따로 그려 화면을 옮길 때마다 다시 만들어졌음) */
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-page text-ink">
    <Header />
    {/* 휴대폰: 옆 여백 좁게 + 아래 여백 (떠 있는 "목록으로" 버튼이 마지막 내용을 가리지 않게) */}
    <div className="mx-auto max-w-[1680px] px-4 pb-20 sm:px-6 sm:pb-0 2xl:px-10">{children}</div>
    <BackFab />
  </div>
);

export default Layout;
