import { Module } from '@nestjs/common';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';
import { AuthModule } from '../auth/auth.module';
// PrismaService is provided globally in AppModule

@Module({
  imports: [AuthModule], // Import AuthModule to access JwtAuthGuard and RolesGuard
  controllers: [QuotesController],
  providers: [QuotesService],
  exports: [QuotesService],
})
export class QuotesModule {}

