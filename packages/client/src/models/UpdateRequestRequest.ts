/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RequestStatus } from './RequestStatus';

/**
 * Update visa request (owner or ADMIN only)
 */
export type UpdateRequestRequest = {
    title?: string;
    description?: string;
    visaType?: string;
    budgetMin?: number;
    budgetMax?: number;
    location?: string;
    status?: RequestStatus;
    /**
     * Raw intake form data captured during request creation
     */
    intakeData?: Record<string, any> | null;
};
