import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GoalType } from '@prisma/client';
import request from 'supertest';
import { authHeader, registerAndLogin } from '../../test/auth-test.helper';
import { AppModule } from '../app.module';
import { configureApp } from '../common/configure-app';
import { PrismaService } from '../prisma/prisma.service';

const describeIfDb = process.env.DATABASE_URL ? describe : describe.skip;

describeIfDb('Task comments API (integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let userId: string;
  let taskId: string;
  const commentIds: string[] = [];

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
    prisma = moduleRef.get(PrismaService);

    const auth = await registerAndLogin(app);
    accessToken = auth.accessToken;
    userId = auth.userId;

    const goal = await request(app.getHttpServer())
      .post('/api/v1/goals')
      .set(authHeader(accessToken))
      .send({ title: 'Comment goal', type: GoalType.DAILY })
      .expect(201);

    const task = await request(app.getHttpServer())
      .post(`/api/v1/goals/${goal.body.id}/tasks`)
      .set(authHeader(accessToken))
      .send({ title: 'Comment task' })
      .expect(201);
    taskId = task.body.id;
  });

  afterAll(async () => {
    if (commentIds.length) {
      await prisma.taskComment.deleteMany({ where: { id: { in: commentIds } } });
    }
    await prisma.task.deleteMany({ where: { id: taskId } }).catch(() => undefined);
    await app.close();
  });

  it('POST and GET comments with markdown body', async () => {
    const created = await request(app.getHttpServer())
      .post(`/api/v1/tasks/${taskId}/comments`)
      .set(authHeader(accessToken))
      .send({ body: '**Done** with `code` and a list:\n- one' })
      .expect(201);

    expect(created.body).toMatchObject({
      taskId,
      body: '**Done** with `code` and a list:\n- one',
      author: { id: userId, name: expect.any(String) },
    });
    commentIds.push(created.body.id);

    const list = await request(app.getHttpServer())
      .get(`/api/v1/tasks/${taskId}/comments`)
      .set(authHeader(accessToken))
      .expect(200);

    expect(list.body).toHaveLength(1);
    expect(list.body[0].id).toBe(created.body.id);
  });

  it('DELETE own comment', async () => {
    const created = await request(app.getHttpServer())
      .post(`/api/v1/tasks/${taskId}/comments`)
      .set(authHeader(accessToken))
      .send({ body: 'temporary' })
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/api/v1/tasks/${taskId}/comments/${created.body.id}`)
      .set(authHeader(accessToken))
      .expect(204);
  });

  it('returns 404 for unknown task', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/tasks/nonexistent/comments')
      .set(authHeader(accessToken))
      .expect(404);
  });
});
