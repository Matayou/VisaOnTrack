/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RequestStatus } from './RequestStatus';

/**
 * Create visa request (SEEKER role required)
 */
export type CreateRequestRequest = {
    title: string;
    description: string;
    visaType?: string | null;
    budgetMin?: number | null;
    budgetMax?: number | null;
    location?: string | null;
    status?: RequestStatus;
};
