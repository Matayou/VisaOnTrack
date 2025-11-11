import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from '../common/services/email.service';
import { AuditLogService } from '../common/services/audit-log.service';
import { RateLimitService } from '../common/services/rate-limit.service';
import { PrismaService } from '../common/services/prisma.service';
import { JWT_SECRET, JWT_EXPIRES_IN } from './jwt.config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: {
        expiresIn: JWT_EXPIRES_IN,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailService,
    AuditLogService,
    RateLimitService,
    JwtAuthGuard, // Export guard so other modules can use it
    // PrismaService is provided globally in AppModule
  ],
  exports: [AuthService, JwtAuthGuard, JwtModule], // Export guard and JwtModule for other modules
})
export class AuthModule {}

