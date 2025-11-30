/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PlanCode } from './PlanCode';

/**
 * Plan entitlements and usage stats for the authenticated provider
 */
export type EntitlementsResponse = {
    planCode: PlanCode;
    /**
     * Human-readable plan name (Free, Pro, Agency)
     */
    planName: string;
    /**
     * Key-value entitlements per plan
     */
    entitlements: Record<string, (string | number | boolean)>;
    usage: {
/**
 * Current credits balance
 */
creditsRemaining: number;
/**
 * Credits used in current month
 */
creditsUsedThisMonth: number;
/**
 * Free credits allocated per month based on plan
 */
monthlyFreeCredits: number;
/**
 * Number of service packages created
 */
packagesCreated: number;
/**
 * Maximum service packages allowed by plan
 */
packagesMax: number;
/**
 * Total consultations offered by provider
 */
consultationsOffered: number;
};
};
