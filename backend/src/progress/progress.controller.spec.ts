import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GoalStatus, GoalType } from '@prisma/client';
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
  const goalIds: string[] = [];

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
    if (goalIds.length) await prisma.goal.deleteMany({ where: { id: { in: goalIds } } });
    await app.close();
  });

  it('GET /progress returns daily series', async () => {
    const goal = await request(app.getHttpServer())
      .post('/api/v1/goals')
      .set(authHeader(accessToken))
      .send({ title: 'Progress goal', type: GoalType.WEEKLY })
      .expect(201);
    goalIds.push(goal.body.id);

    await request(app.getHttpServer())
      .patch(`/api/v1/goals/${goal.body.id}`)
      .set(authHeader(accessToken))
      .send({ status: GoalStatus.COMPLETED })
      .expect(200);

    const res = await request(app.getHttpServer())
      .get('/api/v1/progress?days=7')
      .set(authHeader(accessToken))
      .expect(200);

    expect(res.body.days).toHaveLength(7);
    expect(res.body.days[0]).toMatchObject({
      date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
      goals: { daily: expect.any(Number), weekly: expect.any(Number), monthly: expect.any(Number) },
      tasks: expect.any(Number),
    });

    const weeklyTotal = res.body.days.reduce(
      (sum: number, d: { goals: { weekly: number } }) => sum + d.goals.weekly,
      0,
    );
    expect(weeklyTotal).toBeGreaterThanOrEqual(1);
  });
});
