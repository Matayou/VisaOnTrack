import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CreditTransactionType } from '@prisma/client';

@Injectable()
export class CreditsService {
  constructor(private prisma: PrismaService) {}

  async getBalance(userId: string) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { userId },
      select: { credits: true },
    });

    if (!provider) throw new NotFoundException('Provider profile not found');
    return { credits: provider.credits };
  }

  async getHistory(userId: string) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!provider) throw new NotFoundException('Provider profile not found');

    return this.prisma.creditTransaction.findMany({
      where: { providerId: provider.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  // MVP Simulation for Purchase
  async simulatePurchase(userId: string, packId: string) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!provider) throw new NotFoundException('Provider profile not found');

    let amount = 0;
    if (packId === 'pack_small') amount = 5;
    if (packId === 'pack_medium') amount = 15;
    if (packId === 'pack_large') amount = 50;

    if (amount === 0) throw new BadRequestException('Invalid credit pack');

    // Transaction
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.providerProfile.update({
        where: { id: provider.id },
        data: { credits: { increment: amount } },
      });

      await tx.creditTransaction.create({
        data: {
          providerId: provider.id,
          amount,
          type: CreditTransactionType.PURCHASE,
          reason: `Simulated purchase of ${packId}`,
        },
      });

      return { success: true, newBalance: updated.credits };
    });
  }
}
