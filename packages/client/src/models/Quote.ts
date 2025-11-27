/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QuoteItem } from './QuoteItem';
import type { QuoteStatus } from './QuoteStatus';

/**
 * Quote schema per Section 3 data model
 */
export type Quote = {
    id: string;
    /**
     * Foreign key to Request
     */
    requestId: string;
    /**
     * Foreign key to ProviderProfile
     */
    providerId: string;
    /**
     * Quote line items
     */
    items: Array<QuoteItem>;
    /**
     * Total quote amount in Thai Baht
     */
    totalTHB: number;
    /**
     * Estimated completion time in days
     */
    etaDays: number;
    /**
     * Terms and conditions
     */
    terms?: string | null;
    status: QuoteStatus;
    /**
     * Quote expiration timestamp
     */
    validUntil?: string | null;
};
