import { Module } from '@nestjs/common';
import { AttachmentsController } from './attachments.controller';
import { AttachmentsService } from './attachments.service';
import { AuditLogService } from '../common/services/audit-log.service';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule to use JwtAuthGuard
// PrismaService is provided globally in AppModule

@Module({
  imports: [AuthModule], // Import AuthModule to access JwtAuthGuard
  controllers: [AttachmentsController],
  providers: [
    AttachmentsService,
    AuditLogService,
    // PrismaService is provided globally in AppModule
  ],
  exports: [AttachmentsService],
})
export class MessagesModule {}

