import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';
import { VerificationController } from './verification.controller';
import { VerificationDocumentsService } from './verification-documents.service';
import { ProviderVerifiedGuard } from './guards/provider-verified.guard';
import { AuditLogService } from '../common/services/audit-log.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MulterModule.register({
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  ],
  controllers: [ProvidersController, VerificationController],
  providers: [
    ProvidersService,
    VerificationDocumentsService,
    ProviderVerifiedGuard,
    AuditLogService,
  ],
  exports: [ProvidersService, VerificationDocumentsService, ProviderVerifiedGuard],
})
export class ProvidersModule {}
