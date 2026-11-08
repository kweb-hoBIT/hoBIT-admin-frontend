import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { startBootSplash } from './bootSplash';

startBootSplash(); // 첫 화면이 다 그려질 때까지 로딩 화면 유지

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <App />
  );
}
