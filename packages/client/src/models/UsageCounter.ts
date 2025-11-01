/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Usage counter schema per Section 3 data model
 */
export type UsageCounter = {
    /**
     * Counter metric name
     */
    metric: string;
    /**
     * Current usage count
     */
    used: number;
    /**
     * Usage limit (from entitlements)
     */
    limit: number;
    /**
     * Period key in YYYY-MM format
     */
    periodKey: string;
    /**
     * When counter resets (first of next month)
     */
    resetAt: string;
};
