import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';
import { DashboardModule } from './dashboard/dashboard.module';
import { ProgressModule } from './progress/progress.module';
import { GoalsModule } from './goals/goals.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [resolve(__dirname, '../../.env'), resolve(__dirname, '../.env')],
    }),
    PrismaModule,
    HealthModule,
    DashboardModule,
    ProgressModule,
    GoalsModule,
    TasksModule,
  ],
})
export class AppModule {}
