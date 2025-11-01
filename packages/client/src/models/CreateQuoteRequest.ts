/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QuoteItem } from './QuoteItem';

/**
 * Submit quote for request (PROVIDER role, entitlement check: quotes.monthly.max)
 */
export type CreateQuoteRequest = {
    items: Array<QuoteItem>;
    /**
     * Total amount in Thai Baht (should match sum of items)
     */
    totalTHB: number;
    etaDays: number;
    terms?: string | null;
};
