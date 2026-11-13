import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { authHeader, registerAndLogin } from '../../test/auth-test.helper';
import { AppModule } from '../app.module';
import { configureApp } from '../common/configure-app';
import { PrismaService } from '../prisma/prisma.service';

const describeIfDb = process.env.DATABASE_URL ? describe : describe.skip;

describeIfDb('Projects API (integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  const createdProjectIds: string[] = [];

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
    prisma = moduleRef.get(PrismaService);
    const auth = await registerAndLogin(app);
    accessToken = auth.accessToken;
  });

  afterAll(async () => {
    if (createdProjectIds.length) {
      await prisma.project.deleteMany({ where: { id: { in: createdProjectIds } } });
    }
    await app.close();
  });

  it('CRUD projects', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/v1/projects')
      .set(authHeader(accessToken))
      .send({ title: 'My project', description: 'Scope' })
      .expect(201);
    createdProjectIds.push(created.body.id);

    const list = await request(app.getHttpServer())
      .get('/api/v1/projects')
      .set(authHeader(accessToken))
      .expect(200);
    expect(list.body.length).toBeGreaterThanOrEqual(1);

    const patched = await request(app.getHttpServer())
      .patch(`/api/v1/projects/${created.body.id}`)
      .set(authHeader(accessToken))
      .send({ title: 'Renamed project' })
      .expect(200);
    expect(patched.body.title).toBe('Renamed project');

    await request(app.getHttpServer())
      .delete(`/api/v1/projects/${created.body.id}`)
      .set(authHeader(accessToken))
      .expect(204);
    createdProjectIds.pop();
  });

  it('returns 401 without authorization', async () => {
    await request(app.getHttpServer()).get('/api/v1/projects').expect(401);
  });
});
