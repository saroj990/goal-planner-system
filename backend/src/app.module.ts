import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [resolve(__dirname, '../../.env'), resolve(__dirname, '../.env')],
    }),
    PrismaModule,
    HealthModule,
  ],
})
export class AppModule {}
