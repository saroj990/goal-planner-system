import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GoalType } from '@prisma/client';
import request from 'supertest';
import { authHeader, registerAndLogin } from '../../test/auth-test.helper';
import { AppModule } from '../app.module';
import { configureApp } from '../common/configure-app';
import { PrismaService } from '../prisma/prisma.service';

const databaseUrl = process.env.DATABASE_URL;
const describeIfDb = databaseUrl ? describe : describe.skip;

describeIfDb('Goals API (integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  const createdGoalIds: string[] = [];

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
  });

  afterAll(async () => {
    if (createdGoalIds.length > 0) {
      await prisma.goal.deleteMany({ where: { id: { in: createdGoalIds } } });
    }
    await app.close();
  });

  it('POST /goals creates a goal', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/goals')
      .set(authHeader(accessToken))
      .send({
        title: 'Learn Kafka',
        type: GoalType.MONTHLY,
        startDate: '2026-09-01',
        dueDate: '2026-09-30',
      })
      .expect(201);

    expect(response.body).toMatchObject({
      title: 'Learn Kafka',
      type: GoalType.MONTHLY,
      status: 'ACTIVE',
    });
    expect(response.body.id).toBeDefined();
    createdGoalIds.push(response.body.id);
  });

  it('GET /goals lists goals and filters by type', async () => {
    const createWeekly = await request(app.getHttpServer())
      .post('/api/v1/goals')
      .set(authHeader(accessToken))
      .send({ title: 'Weekly workout', type: GoalType.WEEKLY })
      .expect(201);
    createdGoalIds.push(createWeekly.body.id);

    const list = await request(app.getHttpServer())
      .get('/api/v1/goals')
      .set(authHeader(accessToken))
      .expect(200);
    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body.length).toBeGreaterThanOrEqual(2);

    const weeklyOnly = await request(app.getHttpServer())
      .get('/api/v1/goals')
      .set(authHeader(accessToken))
      .query({ type: GoalType.WEEKLY })
      .expect(200);
    expect(weeklyOnly.body.every((g: { type: string }) => g.type === GoalType.WEEKLY)).toBe(
      true,
    );
  });

  it('GET /goals/:id, PATCH, and DELETE', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/v1/goals')
      .set(authHeader(accessToken))
      .send({ title: 'Daily read', type: GoalType.DAILY })
      .expect(201);
    const id = created.body.id as string;
    createdGoalIds.push(id);

    const fetched = await request(app.getHttpServer())
      .get(`/api/v1/goals/${id}`)
      .set(authHeader(accessToken))
      .expect(200);
    expect(fetched.body).toMatchObject({ id, title: 'Daily read', type: GoalType.DAILY });

    const patched = await request(app.getHttpServer())
      .patch(`/api/v1/goals/${id}`)
      .set(authHeader(accessToken))
      .send({ title: 'Daily reading' })
      .expect(200);
    expect(patched.body.title).toBe('Daily reading');

    await request(app.getHttpServer())
      .delete(`/api/v1/goals/${id}`)
      .set(authHeader(accessToken))
      .expect(204);

    await request(app.getHttpServer())
      .get(`/api/v1/goals/${id}`)
      .set(authHeader(accessToken))
      .expect(404);
    createdGoalIds.pop();
  });

  it('returns 400 for invalid body', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/goals')
      .set(authHeader(accessToken))
      .send({ title: '' })
      .expect(400);
  });

  it('returns 401 without authorization', async () => {
    await request(app.getHttpServer()).get('/api/v1/goals').expect(401);
  });
});
