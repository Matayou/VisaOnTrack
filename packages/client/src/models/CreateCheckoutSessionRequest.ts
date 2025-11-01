/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PlanCode } from './PlanCode';

/**
 * Create Stripe Checkout session for plan upgrade (PROVIDER role)
 */
export type CreateCheckoutSessionRequest = {
    /**
     * Plan to subscribe to (FREE not allowed)
     */
    planCode: PlanCode;
    /**
     * Billing interval
     */
    interval: CreateCheckoutSessionRequest.interval;
};

export namespace CreateCheckoutSessionRequest {

    /**
     * Billing interval
     */
    export enum interval {
        MONTHLY = 'monthly',
        YEARLY = 'yearly',
    }


}
