import { UserRole } from '@prisma/client';
import { RequestUser } from './auth.types';

export function isAdmin(user: Pick<RequestUser, 'role'>): boolean {
  return user.role === UserRole.ADMIN;
}
