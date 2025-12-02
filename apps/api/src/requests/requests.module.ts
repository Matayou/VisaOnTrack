import { Module } from '@nestjs/common';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { AuthModule } from '../auth/auth.module';
import { ProvidersModule } from '../providers/providers.module';
import { AuditLogService } from '../common/services/audit-log.service';

@Module({
  imports: [
    AuthModule,
    ProvidersModule,
  ],
  controllers: [RequestsController],
  providers: [RequestsService, AuditLogService],
})
export class RequestsModule {}
