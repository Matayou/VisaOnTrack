import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('credits')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}

  @Get('balance')
  @Roles(UserRole.PROVIDER)
  async getBalance(@Req() req) {
    const userId = (req as any).user?.userId;
    return this.creditsService.getBalance(userId);
  }

  @Get('history')
  @Roles(UserRole.PROVIDER)
  async getHistory(@Req() req) {
    const userId = (req as any).user?.userId;
    return this.creditsService.getHistory(userId);
  }

  @Post('purchase')
  @Roles(UserRole.PROVIDER)
  async purchaseCredits(@Req() req, @Body('packId') packId: string) {
    // In a real app, this would init Stripe Checkout
    // For MVP, we simulate a successful purchase for testing
    const userId = (req as any).user?.userId;
    return this.creditsService.simulatePurchase(userId, packId);
  }
}
