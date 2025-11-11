import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuditLogService } from '../common/services/audit-log.service';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule to use JwtAuthGuard
// PrismaService is provided globally in AppModule

@Module({
  imports: [AuthModule], // Import AuthModule to access JwtAuthGuard
  controllers: [UsersController],
  providers: [
    UsersService,
    AuditLogService,
    // PrismaService is provided globally in AppModule
  ],
  exports: [UsersService],
})
export class UsersModule {}

