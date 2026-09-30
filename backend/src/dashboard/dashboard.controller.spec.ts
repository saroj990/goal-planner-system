import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GoalType } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../app.module';
import { configureApp } from '../common/configure-app';
import { PrismaService } from '../prisma/prisma.service';

const describeIfDb = process.env.DATABASE_URL ? describe : describe.skip;

describeIfDb('Dashboard API (integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const goalIds: string[] = [];

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
    prisma = moduleRef.get(PrismaService);
  });

  afterAll(async () => {
    if (goalIds.length) await prisma.goal.deleteMany({ where: { id: { in: goalIds } } });
    await app.close();
  });

  it('GET /dashboard returns summary shape', async () => {
    const goal = await request(app.getHttpServer())
      .post('/api/v1/goals')
      .send({ title: 'Dash goal', type: GoalType.DAILY })
      .expect(201);
    goalIds.push(goal.body.id);

    await request(app.getHttpServer())
      .post(`/api/v1/goals/${goal.body.id}/tasks`)
      .send({ title: 'Dash task' })
      .expect(201);

    const res = await request(app.getHttpServer()).get('/api/v1/dashboard').expect(200);

    expect(res.body).toMatchObject({
      goalsTotal: expect.any(Number),
      tasksTotal: expect.any(Number),
      completionPercent: expect.any(Number),
      activeGoalsCount: expect.any(Number),
      tasksByStatus: {
        todo: expect.any(Array),
        inProgress: expect.any(Array),
        done: expect.any(Array),
      },
    });
  });
});
