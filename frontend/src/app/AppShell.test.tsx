import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AppProviders } from './providers';
import { HomePage } from '../pages/HomePage';

describe('HomePage', () => {
  it('renders welcome copy and link to projects', () => {
    render(
      <AppProviders>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </AppProviders>,
    );

    expect(screen.getByRole('heading', { name: /your projects/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /open projects/i })).toHaveAttribute('href', '/projects');
  });
});
