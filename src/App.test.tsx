import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock react-router-dom completely to avoid CJS/ESM issues with v7
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Routes: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Route: ({ element }: { element: React.ReactNode }) => <>{element}</>,
  Navigate: () => null,
  NavLink: ({ children, to, className }: any) => (
    <a href={to} className={typeof className === 'function' ? className({ isActive: false }) : className}>
      {children}
    </a>
  ),
}));

import App from './App';

test('renders app title', () => {
  render(<App />);
  const titleElement = screen.getByText(/ระบบค้นหากฎเกณฑ์ธนาคาร/i);
  expect(titleElement).toBeInTheDocument();
});
