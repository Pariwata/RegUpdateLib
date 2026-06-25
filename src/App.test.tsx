import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders regulatory search heading', () => {
  render(<App />);
  const heading = screen.getByText(/Regulatory Search/i);
  expect(heading).toBeInTheDocument();
});
