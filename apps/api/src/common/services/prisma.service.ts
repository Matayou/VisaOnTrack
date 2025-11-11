import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Prisma Service
 * 
 * Shared PrismaClient instance for the entire application.
 * Prevents connection pool exhaustion by reusing a single client instance.
 * 
 * Implements OnModuleInit and OnModuleDestroy to properly manage connections.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  /**
   * Connect to database when module initializes
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Disconnect from database when module destroys
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}

