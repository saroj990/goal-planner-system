import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getHealth() {
    const databaseUp = await this.prisma.ping();
    return {
      status: databaseUp ? 'ok' : 'degraded',
      database: databaseUp ? 'up' : 'down',
    };
  }
}
