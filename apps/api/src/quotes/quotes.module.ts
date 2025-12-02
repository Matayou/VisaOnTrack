import { Module } from '@nestjs/common';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';
import { AuthModule } from '../auth/auth.module';
import { ProvidersModule } from '../providers/providers.module';
// PrismaService is provided globally in AppModule

@Module({
  imports: [
    AuthModule, // Import AuthModule to access JwtAuthGuard and RolesGuard
    ProvidersModule, // Import for ProviderVerifiedGuard (RFC-005)
  ],
  controllers: [QuotesController],
  providers: [QuotesService],
  exports: [QuotesService],
})
export class QuotesModule {}
