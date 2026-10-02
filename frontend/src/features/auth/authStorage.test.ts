import { afterEach, describe, expect, it } from 'vitest';
import { clearStoredAuth, getStoredAccessToken, persistAuth } from './authStorage';

describe('authStorage', () => {
  afterEach(() => {
    clearStoredAuth();
  });

  it('persists and clears access token', () => {
    persistAuth('token-abc', JSON.stringify({ id: '1', name: 'A', email: 'a@b.com' }));
    expect(getStoredAccessToken()).toBe('token-abc');
    clearStoredAuth();
    expect(getStoredAccessToken()).toBeNull();
  });
});
