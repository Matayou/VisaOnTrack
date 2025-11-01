/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QuoteStatus } from './QuoteStatus';

/**
 * Update quote status (provider owner or seeker can accept/decline)
 */
export type UpdateQuoteRequest = {
    /**
     * Status change (seeker can set ACCEPTED/DECLINED, provider can update)
     */
    status?: QuoteStatus;
    /**
     * Update terms (provider only)
     */
    terms?: string;
};
