/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UsageCounter } from './UsageCounter';

/**
 * Full entitlements and usage counters per Section 4
 */
export type EntitlementsResponse = {
    /**
     * Key-value entitlements per plan (e.g., quotes.monthly.max=50, packages.max=12, visibility.weight=1.2, attachments.maxSizeMB=25)
     */
    entitlements: Record<string, (string | number | boolean)>;
    /**
     * Usage counters for current period
     */
    usage: Array<UsageCounter>;
};
