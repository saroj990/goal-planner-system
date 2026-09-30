import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GoalType, TaskStatus } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../app.module';
import { configureApp } from '../common/configure-app';
import { PrismaService } from '../prisma/prisma.service';

const databaseUrl = process.env.DATABASE_URL;
const describeIfDb = databaseUrl ? describe : describe.skip;

describeIfDb('Tasks API (integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let goalId: string;
  const createdTaskIds: string[] = [];

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();

    prisma = moduleRef.get(PrismaService);

    const goal = await request(app.getHttpServer())
      .post('/api/v1/goals')
      .send({ title: 'Goal for tasks', type: GoalType.WEEKLY })
      .expect(201);
    goalId = goal.body.id;
  });

  afterAll(async () => {
    if (createdTaskIds.length > 0) {
      await prisma.task.deleteMany({ where: { id: { in: createdTaskIds } } });
    }
    if (goalId) {
      await prisma.goal.delete({ where: { id: goalId } }).catch(() => undefined);
    }
    await app.close();
  });

  it('POST /goals/:goalId/tasks creates a task with position', async () => {
    const response = await request(app.getHttpServer())
      .post(`/api/v1/goals/${goalId}/tasks`)
      .send({ title: 'Read docs' })
      .expect(201);

    expect(response.body).toMatchObject({
      title: 'Read docs',
      goalId,
      status: TaskStatus.TODO,
    });
    expect(response.body.position).toBeGreaterThan(0);
    createdTaskIds.push(response.body.id);
  });

  it('GET /goals/:goalId/tasks lists tasks ordered by position', async () => {
    const second = await request(app.getHttpServer())
      .post(`/api/v1/goals/${goalId}/tasks`)
      .send({ title: 'Build demo' })
      .expect(201);
    createdTaskIds.push(second.body.id);

    const list = await request(app.getHttpServer())
      .get(`/api/v1/goals/${goalId}/tasks`)
      .expect(200);

    expect(list.body.length).toBeGreaterThanOrEqual(2);
    const positions = list.body.map((t: { position: number }) => t.position);
    expect(positions[0]).toBeLessThanOrEqual(positions[1]);
  });

  it('GET/PATCH/DELETE /tasks/:id', async () => {
    const created = await request(app.getHttpServer())
      .post(`/api/v1/goals/${goalId}/tasks`)
      .send({ title: 'Patch me' })
      .expect(201);
    const taskId = created.body.id as string;
    createdTaskIds.push(taskId);

    await request(app.getHttpServer())
      .get(`/api/v1/tasks/${taskId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(taskId);
      });

    const patched = await request(app.getHttpServer())
      .patch(`/api/v1/tasks/${taskId}`)
      .send({ status: TaskStatus.IN_PROGRESS, title: 'In progress task' })
      .expect(200);
    expect(patched.body.status).toBe(TaskStatus.IN_PROGRESS);
    expect(patched.body.title).toBe('In progress task');

    await request(app.getHttpServer()).delete(`/api/v1/tasks/${taskId}`).expect(204);
    await request(app.getHttpServer()).get(`/api/v1/tasks/${taskId}`).expect(404);
    createdTaskIds.pop();
  });

  it('returns 404 for tasks on unknown goal', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/goals/nonexistent/tasks')
      .send({ title: 'Nope' })
      .expect(404);
  });

  it('POST /tasks/reorder updates status and positions', async () => {
    const a = await request(app.getHttpServer())
      .post(`/api/v1/goals/${goalId}/tasks`)
      .send({ title: 'Reorder A' })
      .expect(201);
    const b = await request(app.getHttpServer())
      .post(`/api/v1/goals/${goalId}/tasks`)
      .send({ title: 'Reorder B' })
      .expect(201);
    createdTaskIds.push(a.body.id, b.body.id);

    const reordered = await request(app.getHttpServer())
      .post('/api/v1/tasks/reorder')
      .send({
        goalId,
        items: [
          { id: b.body.id, status: TaskStatus.IN_PROGRESS, position: 100 },
          { id: a.body.id, status: TaskStatus.TODO, position: 200 },
        ],
      })
      .expect(200);

    expect(reordered.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: b.body.id, status: TaskStatus.IN_PROGRESS, position: 100 }),
        expect.objectContaining({ id: a.body.id, status: TaskStatus.TODO, position: 200 }),
      ]),
    );
  });
});
