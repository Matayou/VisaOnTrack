import { Module } from '@nestjs/common';
import { ConsultationsController } from './consultations.controller';
import { ConsultationsService } from './consultations.service';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule to access JwtAuthGuard and RolesGuard
import { BillingModule } from '../billing/billing.module';

@Module({
  imports: [
    AuthModule, // Provide JwtService/JwtAuthGuard/RolesGuard to this module
    BillingModule, // Provide EntitlementsService
  ],
  controllers: [ConsultationsController],
  providers: [ConsultationsService],
  exports: [ConsultationsService],
})
export class ConsultationsModule {}
