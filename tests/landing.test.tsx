import React from 'react';
import { render, screen } from '@testing-library/react';
import LandingPage from '@/app/page';

describe('LandingPage', () => {
  it('renders hero text', () => {
    render(<LandingPage />);
    expect(screen.getByText(/PastureAI Demo/i)).toBeInTheDocument();
  });
});
