import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const DEV_USER_EMAIL = 'dev@goaltracker.local';

/** Until JWT auth (Iteration 7), all goals belong to a single dev user. */
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getDevUserId(): Promise<string> {
    const user = await this.prisma.user.upsert({
      where: { email: DEV_USER_EMAIL },
      create: {
        email: DEV_USER_EMAIL,
        name: 'Dev User',
      },
      update: {},
    });
    return user.id;
  }
}
