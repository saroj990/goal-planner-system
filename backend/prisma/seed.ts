import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const BCRYPT_ROUNDS = 10;

const SEED_USERS: Array<{
  name: string;
  email: string;
  password: string;
  role: UserRole;
}> = [
  {
    name: 'Admin',
    email: 'admin@goaltracker.local',
    password: 'Admin123!',
    role: UserRole.ADMIN,
  },
  {
    name: 'Saroj',
    email: 'saroj@goaltracker.local',
    password: 'Saroj123!',
    role: UserRole.MEMBER,
  },
  {
    name: 'Tejeshw',
    email: 'tejeshw@goaltracker.local',
    password: 'Tejeshw123!',
    role: UserRole.MEMBER,
  },
];

async function upsertUser(seed: (typeof SEED_USERS)[number]) {
  const passwordHash = await bcrypt.hash(seed.password, BCRYPT_ROUNDS);
  return prisma.user.upsert({
    where: { email: seed.email },
    update: {
      name: seed.name,
      role: seed.role,
      passwordHash,
    },
    create: {
      name: seed.name,
      email: seed.email,
      role: seed.role,
      passwordHash,
    },
  });
}

async function main() {
  for (const seed of SEED_USERS) {
    const user = await upsertUser(seed);
    console.log(`Seeded ${user.role} ${user.email} (${user.name})`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
