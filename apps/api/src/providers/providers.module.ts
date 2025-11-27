import { Module } from '@nestjs/common';
import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';
import { AuditLogService } from '../common/services/audit-log.service';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule to use JwtAuthGuard
// PrismaService is provided globally in AppModule

@Module({
  imports: [AuthModule], // Import AuthModule to access JwtAuthGuard
  controllers: [ProvidersController],
  providers: [
    ProvidersService,
    AuditLogService,
    // PrismaService is provided globally in AppModule
  ],
  exports: [ProvidersService],
})
export class ProvidersModule {}

