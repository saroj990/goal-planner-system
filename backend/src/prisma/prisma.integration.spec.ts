import { PrismaClient, ProjectStatus, TaskPriority, TaskStatus } from '@prisma/client';

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

  it('creates user → project → task and enforces enums', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: `test-${Date.now()}@example.com`,
      },
    });

    const project = await prisma.project.create({
      data: {
        userId: user.id,
        title: 'Learn Kafka',
        status: ProjectStatus.ACTIVE,
        startDate: new Date('2026-09-01'),
        dueDate: new Date('2026-09-30'),
      },
    });

    const task = await prisma.task.create({
      data: {
        projectId: project.id,
        title: 'Read docs',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        position: 100,
      },
    });

    expect(task.projectId).toBe(project.id);
    expect(project.userId).toBe(user.id);

    await prisma.task.delete({ where: { id: task.id } });
    await prisma.project.delete({ where: { id: project.id } });
    await prisma.user.delete({ where: { id: user.id } });
  });
});
