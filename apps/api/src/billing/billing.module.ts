import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { EntitlementsService } from './entitlements.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule], // Provide JwtAuthGuard and RolesGuard
  controllers: [BillingController],
  providers: [EntitlementsService],
  exports: [EntitlementsService],
})
export class BillingModule {}
