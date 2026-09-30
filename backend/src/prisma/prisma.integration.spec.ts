import { PrismaClient, GoalStatus, GoalType, TaskStatus } from '@prisma/client';

const databaseUrl = process.env.DATABASE_URL;

const describeIfDb = databaseUrl ? describe : describe.skip;

describeIfDb('Prisma schema (integration)', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient({
      datasources: { db: { url: databaseUrl } },
    });
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('creates user → goal → task and enforces enums', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: `test-${Date.now()}@example.com`,
      },
    });

    const goal = await prisma.goal.create({
      data: {
        userId: user.id,
        title: 'Learn Kafka',
        type: GoalType.MONTHLY,
        status: GoalStatus.ACTIVE,
        startDate: new Date('2026-09-01'),
        dueDate: new Date('2026-09-30'),
      },
    });

    const task = await prisma.task.create({
      data: {
        goalId: goal.id,
        title: 'Read docs',
        status: TaskStatus.TODO,
        position: 100,
      },
    });

    expect(task.goalId).toBe(goal.id);
    expect(goal.userId).toBe(user.id);

    await prisma.task.delete({ where: { id: task.id } });
    await prisma.goal.delete({ where: { id: goal.id } });
    await prisma.user.delete({ where: { id: user.id } });
  });
});
