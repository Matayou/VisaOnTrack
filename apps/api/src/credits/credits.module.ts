import { Module } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { CreditsController } from './credits.controller';
import { PrismaService } from '../common/services/prisma.service'; // Adjust path if needed
import { AuthModule } from '../auth/auth.module'; // Import AuthModule to use JwtAuthGuard and RolesGuard

@Module({
  imports: [AuthModule], // Make JwtService and guards available in this module
  controllers: [CreditsController],
  providers: [CreditsService, PrismaService],
})
export class CreditsModule {}
