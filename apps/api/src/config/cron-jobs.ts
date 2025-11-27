import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AuthService } from '../auth/auth.service';
import { RateLimitService } from '../common/services/rate-limit.service';

/**
 * Cron jobs for scheduled tasks
 * - Cleanup expired password reset tokens (daily)
 * - Clear expired rate limit entries (hourly)
 */
@Injectable()
export class CronJobsService {
  constructor(
    private authService: AuthService,
    private rateLimitService: RateLimitService,
  ) {}

  /**
   * Cleanup expired password reset tokens
   * Runs daily at 2 AM for data retention policy compliance (PDPA/GDPR)
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async cleanupExpiredTokens(): Promise<void> {
    console.log('[CronJobs] Starting expired token cleanup...');
    
    try {
      const count = await this.authService.cleanupExpiredTokens();
      console.log(`[CronJobs] Cleaned up ${count} expired password reset tokens`);
    } catch (error) {
      console.error('[CronJobs] Error cleaning up expired tokens:', error);
    }
  }

  /**
   * Clear expired rate limit entries
   * Runs hourly to prevent memory leaks
   */
  @Cron(CronExpression.EVERY_HOUR)
  async clearExpiredRateLimits(): Promise<void> {
    console.log('[CronJobs] Clearing expired rate limit entries...');
    
    try {
      this.rateLimitService.clearExpiredEntries();
      console.log('[CronJobs] Expired rate limit entries cleared');
    } catch (error) {
      console.error('[CronJobs] Error clearing expired rate limits:', error);
    }
  }
}

