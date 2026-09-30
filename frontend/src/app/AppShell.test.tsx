import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppProviders } from './providers';
import { AppShell } from './AppShell';

describe('AppShell', () => {
  it('renders the application title', () => {
    render(
      <AppProviders>
        <AppShell />
      </AppProviders>,
    );

    expect(screen.getByRole('heading', { name: /goal tracker/i })).toBeInTheDocument();
  });
});
