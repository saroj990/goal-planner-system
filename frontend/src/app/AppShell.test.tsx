import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AppProviders } from './providers';
import { HomePage } from '../pages/HomePage';

describe('HomePage', () => {
  it('renders the application title and link to goals', () => {
    render(
      <AppProviders>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </AppProviders>,
    );

    expect(screen.getByRole('heading', { name: /your goals/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /open goals/i })).toHaveAttribute('href', '/goals');
  });
});
