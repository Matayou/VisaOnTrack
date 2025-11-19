import { Module } from '@nestjs/common';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { AuthModule } from '../auth/auth.module';
import { AuditLogService } from '../common/services/audit-log.service';

@Module({
  imports: [AuthModule],
  controllers: [RequestsController],
  providers: [RequestsService, AuditLogService],
})
export class RequestsModule {}

