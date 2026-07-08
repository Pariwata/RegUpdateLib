import React from 'react';

export interface PageConfig {
  path: string;
  title: string;
  icon: React.ReactNode;
  component: React.ComponentType;
}

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nav-icon">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nav-icon">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const HearingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nav-icon">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const LazySearchPage = React.lazy(() =>
  import('../pages/SearchPage').then((m) => ({ default: m.SearchPage }))
);
const LazyAlertsPage = React.lazy(() =>
  import('../pages/AlertsPage').then((m) => ({ default: m.AlertsPage }))
);
const LazyHearingsPage = React.lazy(() =>
  import('../pages/HearingsPage').then((m) => ({ default: m.HearingsPage }))
);

export const pages: PageConfig[] = [
  {
    path: '/search',
    title: 'ค้นหากฎเกณฑ์',
    icon: <SearchIcon />,
    component: LazySearchPage,
  },
  {
    path: '/alerts',
    title: 'แจ้งเตือนการเปลี่ยนแปลง',
    icon: <AlertIcon />,
    component: LazyAlertsPage,
  },
  {
    path: '/hearings',
    title: 'สถานะ Hearing',
    icon: <HearingIcon />,
    component: LazyHearingsPage,
  },
];

export const defaultPath = pages[0].path;
