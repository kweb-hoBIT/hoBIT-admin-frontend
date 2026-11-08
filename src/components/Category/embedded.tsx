import React, { createContext, useContext } from 'react';

/**
 * 관리 탭 안에 끼워 넣은 화면인지 — 예전 단독 화면(화면 가운데 상자·큰 제목)을
 * 관리 > 카테고리·담당자·이메일 탭 안에서는 상자 없이, 제목은 탭 쪽에서 보여 줌
 */
const EmbeddedContext = createContext(false);
export const EmbeddedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <EmbeddedContext.Provider value={true}>{children}</EmbeddedContext.Provider>
);
export const useEmbedded = () => useContext(EmbeddedContext);
