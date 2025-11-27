/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PlanCode } from './PlanCode';
import type { SubscriptionStatus } from './SubscriptionStatus';

/**
 * Subscription schema per Section 3 data model
 */
export type Subscription = {
    /**
     * Subscription ID
     */
    id?: string;
    /**
     * Foreign key to BillingCustomer
     */
    billingCustomerId?: string;
    /**
     * Stripe subscription ID
     */
    stripeSubscriptionId?: string;
    planCode: PlanCode;
    status: SubscriptionStatus;
    /**
     * Current billing period start
     */
    currentPeriodStart: string;
    /**
     * Current billing period end
     */
    currentPeriodEnd: string;
    /**
     * Whether subscription will cancel at period end
     */
    cancelAtPeriodEnd: boolean;
    createdAt: string;
    updatedAt: string;
};
