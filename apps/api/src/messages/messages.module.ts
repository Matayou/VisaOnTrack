import { Module } from '@nestjs/common';
import { AttachmentsController } from './attachments.controller';
import { AttachmentsService } from './attachments.service';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { AuditLogService } from '../common/services/audit-log.service';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule to use JwtAuthGuard
import { BillingModule } from '../billing/billing.module'; // Import for EntitlementsService
// PrismaService is provided globally in AppModule

@Module({
  imports: [
    AuthModule, // Import AuthModule to access JwtAuthGuard
    BillingModule, // Import for EntitlementsService
  ],
  controllers: [
    AttachmentsController,
    MessagesController,
  ],
  providers: [
    AttachmentsService,
    MessagesService,
    AuditLogService,
    // PrismaService is provided globally in AppModule
  ],
  exports: [AttachmentsService, MessagesService],
})
export class MessagesModule {}

