import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from '@prisma/client';
import request from 'supertest';
import { authHeader, registerAndLogin } from '../../test/auth-test.helper';
import { AppModule } from '../app.module';
import { configureApp } from '../common/configure-app';
import { PrismaService } from '../prisma/prisma.service';

const databaseUrl = process.env.DATABASE_URL;
const describeIfDb = databaseUrl ? describe : describe.skip;

describeIfDb('Tasks API (integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let projectId: string;
  const createdTaskIds: string[] = [];

  const server = () => request(app.getHttpServer());

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();

    prisma = moduleRef.get(PrismaService);
    const auth = await registerAndLogin(app);
    accessToken = auth.accessToken;

    const project = await server()
      .post('/api/v1/projects')
      .set(authHeader(accessToken))
      .send({ title: 'Project for tasks' })
      .expect(201);
    projectId = project.body.id;
  });

  afterAll(async () => {
    if (createdTaskIds.length > 0) {
      await prisma.task.deleteMany({ where: { id: { in: createdTaskIds } } });
    }
    if (projectId) {
      await prisma.project.delete({ where: { id: projectId } }).catch(() => undefined);
    }
    await app.close();
  });

  it('POST /projects/:projectId/tasks creates a task with position', async () => {
    const response = await server()
      .post(`/api/v1/projects/${projectId}/tasks`)
      .set(authHeader(accessToken))
      .send({ title: 'Read docs' })
      .expect(201);

    expect(response.body).toMatchObject({
      title: 'Read docs',
      projectId,
      status: TaskStatus.TODO,
    });
    expect(response.body.position).toBeGreaterThan(0);
    createdTaskIds.push(response.body.id);
  });

  it('GET /projects/:projectId/tasks lists tasks ordered by position', async () => {
    const second = await server()
      .post(`/api/v1/projects/${projectId}/tasks`)
      .set(authHeader(accessToken))
      .send({ title: 'Build demo' })
      .expect(201);
    createdTaskIds.push(second.body.id);

    const list = await server()
      .get(`/api/v1/projects/${projectId}/tasks`)
      .set(authHeader(accessToken))
      .expect(200);

    expect(list.body.length).toBeGreaterThanOrEqual(2);
    const positions = list.body.map((t: { position: number }) => t.position);
    expect(positions[0]).toBeLessThanOrEqual(positions[1]);
  });

  it('GET/PATCH/DELETE /tasks/:id', async () => {
    const created = await server()
      .post(`/api/v1/projects/${projectId}/tasks`)
      .set(authHeader(accessToken))
      .send({ title: 'Patch me' })
      .expect(201);
    const taskId = created.body.id as string;
    createdTaskIds.push(taskId);

    await server()
      .get(`/api/v1/tasks/${taskId}`)
      .set(authHeader(accessToken))
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(taskId);
      });

    const patched = await server()
      .patch(`/api/v1/tasks/${taskId}`)
      .set(authHeader(accessToken))
      .send({ status: TaskStatus.IN_PROGRESS, title: 'In progress task' })
      .expect(200);
    expect(patched.body.status).toBe(TaskStatus.IN_PROGRESS);

    await server().delete(`/api/v1/tasks/${taskId}`).set(authHeader(accessToken)).expect(204);
    await server().get(`/api/v1/tasks/${taskId}`).set(authHeader(accessToken)).expect(404);
    createdTaskIds.pop();
  });

  it('GET /tasks?projectId= filters board tasks', async () => {
    const created = await server()
      .post(`/api/v1/projects/${projectId}/tasks`)
      .set(authHeader(accessToken))
      .send({ title: 'Filtered task' })
      .expect(201);
    createdTaskIds.push(created.body.id);

    const list = await server()
      .get(`/api/v1/tasks?projectId=${projectId}`)
      .set(authHeader(accessToken))
      .expect(200);
    expect(list.body.every((t: { projectId: string }) => t.projectId === projectId)).toBe(true);
  });
});
