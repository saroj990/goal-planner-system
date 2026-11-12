import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ProjectStatus } from '@prisma/client';
import request from 'supertest';
import { authHeader, registerAndLogin } from '../../test/auth-test.helper';
import { AppModule } from '../app.module';
import { configureApp } from '../common/configure-app';
import { PrismaService } from '../prisma/prisma.service';

const describeIfDb = process.env.DATABASE_URL ? describe : describe.skip;

describeIfDb('Progress API (integration)', () => {
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

  it('GET /progress returns daily series', async () => {
    const project = await request(app.getHttpServer())
      .post('/api/v1/projects')
      .set(authHeader(accessToken))
      .send({ title: 'Progress project' })
      .expect(201);
    projectIds.push(project.body.id);

    await request(app.getHttpServer())
      .patch(`/api/v1/projects/${project.body.id}`)
      .set(authHeader(accessToken))
      .send({ status: ProjectStatus.COMPLETED })
      .expect(200);

    const res = await request(app.getHttpServer())
      .get('/api/v1/progress?days=7')
      .set(authHeader(accessToken))
      .expect(200);

    expect(res.body.days).toHaveLength(7);
    expect(res.body.days[0]).toMatchObject({
      date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
      projects: expect.any(Number),
      tasks: expect.any(Number),
    });

    const projectTotal = res.body.days.reduce(
      (sum: number, d: { projects: number }) => sum + d.projects,
      0,
    );
    expect(projectTotal).toBeGreaterThanOrEqual(1);
  });
});
