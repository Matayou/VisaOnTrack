/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EscrowStatus } from './EscrowStatus';
import type { Milestone } from './Milestone';
import type { OrderStatus } from './OrderStatus';

/**
 * Order schema per Section 3 data model
 */
export type Order = {
    id: string;
    /**
     * Foreign key to Quote
     */
    quoteId: string;
    /**
     * Stripe Connect escrow state
     */
    escrowStatus: EscrowStatus;
    /**
     * Order lifecycle status
     */
    status: OrderStatus;
    /**
     * Order milestones
     */
    milestones?: Array<Milestone> | null;
};
