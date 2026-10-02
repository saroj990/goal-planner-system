import { INestApplication } from '@nestjs/common';
import request from 'supertest';

export async function registerAndLogin(
  app: INestApplication,
  overrides?: { name?: string; email?: string; password?: string },
): Promise<{ accessToken: string; userId: string; email: string }> {
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const email = overrides?.email ?? `test-${unique}@example.com`;
  const password = overrides?.password ?? 'Password123!';
  const name = overrides?.name ?? 'Test User';

  const register = await request(app.getHttpServer())
    .post('/api/v1/auth/register')
    .send({ name, email, password })
    .expect(201);

  const accessToken = register.body.accessToken as string;
  const userId = register.body.user.id as string;

  return { accessToken, userId, email };
}

export function authHeader(accessToken: string): { Authorization: string } {
  return { Authorization: `Bearer ${accessToken}` };
}
