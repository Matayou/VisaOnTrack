import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { EntitlementsService, EntitlementsResponse } from './entitlements.service';

@Controller('billing')
export class BillingController {
  constructor(private readonly entitlements: EntitlementsService) {}

  /**
   * GET /billing/entitlements/me
   * Get current plan entitlements and usage stats for the authenticated user
   * Works for both SEEKERS and PROVIDERS
   */
  @Get('entitlements/me')
  @UseGuards(JwtAuthGuard)
  async getEntitlements(@Request() req): Promise<EntitlementsResponse> {
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role;
    return this.entitlements.getEntitlementsWithUsage(userId, userRole);
  }
}
