import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { PageSignature } from './components/PageSignature';
import { pages, defaultPath } from './config/pageConfig';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">ระบบค้นหากฎเกณฑ์ธนาคาร</h1>
          <p className="app-subtitle">
            ค้นหากฎหมายและประกาศกฎเกณฑ์ของหน่วยงานกำกับดูแลที่ใช้บังคับกับธนาคาร
          </p>
        </div>
      </header>

      <NavBar />

      <main className="app-main">
        <Suspense fallback={<div className="page-loading">กำลังโหลด...</div>}>
          <Routes>
            <Route path="/" element={<Navigate to={defaultPath} replace />} />
            {pages.map((page) => (
              <Route
                key={page.path}
                path={page.path}
                element={<page.component />}
              />
            ))}
          </Routes>
        </Suspense>
      </main>

      <PageSignature />
    </div>
  );
}

export default App;
