import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import BackFab from '../ui/BackFab';
import { ScrollTopFab } from '../ui/ListKit';
import { startNavLoading, subscribeNavLoading } from '../../bootSplash';

/**
 * 화면 이동 로딩 — 첫 로딩 화면과 같은 호빗 캐릭터를 헤더 아래 본문 자리에 (index.html의 .hobit-splash 스타일)
 * 주소(탭·하위 탭·검색 조건)가 바뀌면 시작하고, 새 화면의 데이터가 다 오면 걷힘 (src/bootSplash.ts)
 */
const NavLoader: React.FC = () => {
  const { pathname, search } = useLocation();
  const [visible, setVisible] = useState(false);
  const first = useRef(true);
  useEffect(() => subscribeNavLoading(setVisible), []);
  useEffect(() => {
    if (first.current) {
      first.current = false; // 첫 화면은 #boot-splash가 맡음
      return;
    }
    startNavLoading();
  }, [pathname, search]);
  if (!visible) return null;
  return (
    <div className="hobit-splash hobit-splash--nav" role="status" aria-label="화면을 불러오는 중">
      <img className="hobit-splash__char" src="/hobit-splash.png" width={96} height={96} alt="" />
      <div className="hobit-splash__shadow" aria-hidden="true" />
      <div className="hobit-splash__dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
    </div>
  );
};

/** 모든 화면 공통 — 헤더는 여기 한 번만 (예전엔 화면마다 헤더를 따로 그려 화면을 옮길 때마다 다시 만들어졌음) */
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-page text-ink">
    <Header />
    {/* 휴대폰: 옆 여백 좁게 */}
    <div className="mx-auto max-w-[var(--page-max)] px-4 sm:px-6 2xl:px-10">{children}</div>
    <NavLoader />
    <BackFab />
    <ScrollTopFab />
  </div>
);

export default Layout;
