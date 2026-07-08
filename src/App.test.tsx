import React from 'react';
import { render, screen } from '@testing-library/react';

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

test('renders app title in header', () => {
  render(<App />);
  const titleElements = screen.getAllByText(/ระบบค้นหากฎเกณฑ์ธนาคาร/i);
  expect(titleElements.length).toBeGreaterThanOrEqual(1);
  expect(titleElements[0].tagName).toBe('H1');
});

test('renders page signature', () => {
  render(<App />);
  const signatureElement = screen.getByText(/ฝ่ายกำกับดูแลการปฏิบัติงาน/i);
  expect(signatureElement).toBeInTheDocument();
});

test('renders navigation links from page config', () => {
  render(<App />);
  expect(screen.getByText('ค้นหากฎเกณฑ์')).toBeInTheDocument();
  expect(screen.getByText('แจ้งเตือนการเปลี่ยนแปลง')).toBeInTheDocument();
  expect(screen.getByText('สถานะ Hearing')).toBeInTheDocument();
});
