/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EscrowStatus } from './EscrowStatus';
import type { MilestoneInput } from './MilestoneInput';
import type { OrderStatus } from './OrderStatus';

/**
 * Update order status/milestones (participants or ADMIN only)
 */
export type UpdateOrderRequest = {
    /**
     * Order status update
     */
    status?: OrderStatus;
    /**
     * Escrow status (admin-controlled, via Stripe webhook)
     */
    escrowStatus?: EscrowStatus;
    /**
     * Milestone updates
     */
    milestones?: Array<MilestoneInput>;
};
