import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { SearchPage } from './pages/SearchPage';
import { AlertsPage } from './pages/AlertsPage';
import { HearingsPage } from './pages/HearingsPage';
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
        <Routes>
          <Route path="/" element={<Navigate to="/search" replace />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/hearings" element={<HearingsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
