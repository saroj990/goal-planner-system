import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { authHeader, registerAndLogin } from '../../test/auth-test.helper';
import { AppModule } from '../app.module';
import { configureApp } from '../common/configure-app';

const describeIfDb = process.env.DATABASE_URL ? describe : describe.skip;

describeIfDb('Auth API (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('register and login return access token and user', async () => {
    const email = `auth-${Date.now()}@example.com`;
    const register = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ name: 'Auth User', email, password: 'Password123!' })
      .expect(201);

    expect(register.body.accessToken).toBeDefined();
    expect(register.body.user).toMatchObject({ name: 'Auth User', email });

    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password: 'Password123!' })
      .expect(201);

    expect(login.body.accessToken).toBeDefined();
  });

  it('GET /auth/me requires JWT', async () => {
    const { accessToken } = await registerAndLogin(app);

    const me = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set(authHeader(accessToken))
      .expect(200);

    expect(me.body.email).toBeDefined();
    expect(me.body.name).toBeDefined();

    await request(app.getHttpServer()).get('/api/v1/auth/me').expect(401);
  });

  it('forgot-password returns generic message', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/forgot-password')
      .send({ email: 'nobody@example.com' })
      .expect(201);

    expect(res.body.message).toMatch(/account exists/i);
  });
});
