import { UserRole } from '@prisma/client';

export interface RequestUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthUserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface AuthTokensResponse {
  accessToken: string;
  user: AuthUserResponse;
}
