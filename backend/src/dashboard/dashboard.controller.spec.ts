import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { authHeader, registerAndLogin } from '../../test/auth-test.helper';
import { AppModule } from '../app.module';
import { configureApp } from '../common/configure-app';
import { PrismaService } from '../prisma/prisma.service';

const describeIfDb = process.env.DATABASE_URL ? describe : describe.skip;

describeIfDb('Dashboard API (integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  const projectIds: string[] = [];

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
    if (projectIds.length) await prisma.project.deleteMany({ where: { id: { in: projectIds } } });
    await app.close();
  });

  it('GET /dashboard returns summary shape', async () => {
    const project = await request(app.getHttpServer())
      .post('/api/v1/projects')
      .set(authHeader(accessToken))
      .send({ title: 'Dash project' })
      .expect(201);
    projectIds.push(project.body.id);

    await request(app.getHttpServer())
      .post(`/api/v1/projects/${project.body.id}/tasks`)
      .set(authHeader(accessToken))
      .send({ title: 'Dash task' })
      .expect(201);

    const res = await request(app.getHttpServer())
      .get('/api/v1/dashboard')
      .set(authHeader(accessToken))
      .expect(200);

    expect(res.body).toMatchObject({
      tasksTotal: expect.any(Number),
      completionPercent: expect.any(Number),
      activeProjectsCount: expect.any(Number),
      tasksByStatus: {
        todo: expect.any(Array),
        inProgress: expect.any(Array),
        blocked: expect.any(Array),
        done: expect.any(Array),
      },
    });
  });

  it('GET /dashboard?projectId= scopes metrics', async () => {
    const project = await request(app.getHttpServer())
      .post('/api/v1/projects')
      .set(authHeader(accessToken))
      .send({ title: 'Scoped project' })
      .expect(201);
    projectIds.push(project.body.id);

    const res = await request(app.getHttpServer())
      .get(`/api/v1/dashboard?projectId=${project.body.id}`)
      .set(authHeader(accessToken))
      .expect(200);

    expect(res.body.filterProjectId).toBe(project.body.id);
    expect(res.body.projectsTotal).toBe(1);
  });
});
