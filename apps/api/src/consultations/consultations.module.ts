import { Module } from '@nestjs/common';
import { ConsultationsController } from './consultations.controller';
import { ConsultationsService } from './consultations.service';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule to access JwtAuthGuard and RolesGuard

@Module({
  imports: [AuthModule], // Provide JwtService/JwtAuthGuard/RolesGuard to this module
  controllers: [ConsultationsController],
  providers: [ConsultationsService],
  exports: [ConsultationsService],
})
export class ConsultationsModule {}
