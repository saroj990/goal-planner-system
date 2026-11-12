import { describe, expect, it } from 'vitest';
import { initialsFromName } from './userDisplay';

describe('initialsFromName', () => {
  it('returns initials for one and multiple names', () => {
    expect(initialsFromName('Ada')).toBe('AD');
    expect(initialsFromName('Ada Lovelace')).toBe('AL');
  });
});
