import { Module, Global } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProvidersModule } from './providers/providers.module';
import { MessagesModule } from './messages/messages.module';
import { RequestsModule } from './requests/requests.module';
import { CronJobsService } from './config/cron-jobs';
import { PrismaService } from './common/services/prisma.service';
import { RateLimitService } from './common/services/rate-limit.service';

/**
 * Global PrismaService provider
 * Makes PrismaService available to all modules without importing
 */
@Global()
@Module({
  imports: [
    AuthModule,
    UsersModule,
    ProvidersModule,
    MessagesModule,
    RequestsModule,
    ScheduleModule.forRoot(), // Enable cron jobs
  ],
  providers: [CronJobsService, PrismaService, RateLimitService], // Added RateLimitService for CronJobsService
  exports: [PrismaService], // Export so other modules can use it
})
export class AppModule {}

