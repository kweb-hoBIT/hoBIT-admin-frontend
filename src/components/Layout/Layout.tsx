import React, { useEffect, useState } from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [minWidth, setMinWidth] = useState(800); // 기본 최소 너비 설정

  useEffect(() => {
    const updateMinWidth = () => {
      setMinWidth(Math.max(window.innerWidth * 0.6, 800));
    };

    updateMinWidth();
    window.addEventListener('resize', updateMinWidth);
    return () => window.removeEventListener('resize', updateMinWidth);
  }, []);

  return <div style={{ minWidth: `${minWidth}px`, width: '100%' }}>{children}</div>;
};

export default Layout;