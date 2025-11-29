import { Module, Global } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProvidersModule } from './providers/providers.module';
import { MessagesModule } from './messages/messages.module';
import { RequestsModule } from './requests/requests.module';
import { ConsultationsModule } from './consultations/consultations.module';
import { CronJobsService } from './config/cron-jobs';
import { PrismaService } from './common/services/prisma.service';
import { RateLimitService } from './common/services/rate-limit.service';
import { CreditsModule } from './credits/credits.module';

/**
 * Global PrismaService provider
 * Makes PrismaService available to all modules without importing
 */
@Global()
@Module({
  imports: [
    AuthModule, // Must be imported before CronJobsService to access AuthService
    UsersModule,
    ProvidersModule,
    MessagesModule,
    RequestsModule,
    ConsultationsModule,
    ScheduleModule.forRoot(),
    CreditsModule, // Enable cron jobs
  ],
  providers: [
    PrismaService,
    RateLimitService,
    CronJobsService, // Must be after AuthModule import to access AuthService
  ],
  exports: [PrismaService, RateLimitService], // Export so other modules can use it
})
export class AppModule {}

