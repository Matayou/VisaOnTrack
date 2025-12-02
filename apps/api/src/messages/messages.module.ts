import { Module } from '@nestjs/common';
import { AttachmentsController } from './attachments.controller';
import { AttachmentsService } from './attachments.service';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { AuditLogService } from '../common/services/audit-log.service';
import { AuthModule } from '../auth/auth.module';
import { BillingModule } from '../billing/billing.module';
import { ProvidersModule } from '../providers/providers.module';

@Module({
  imports: [
    AuthModule,
    BillingModule,
    ProvidersModule,
  ],
  controllers: [
    AttachmentsController,
    MessagesController,
  ],
  providers: [
    AttachmentsService,
    MessagesService,
    AuditLogService,
  ],
  exports: [AttachmentsService, MessagesService],
})
export class MessagesModule {}
