/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RequestStatus } from './RequestStatus';

/**
 * Visa request schema per Section 3 data model
 */
export type Request = {
    id: string;
    /**
     * Foreign key to User (role=SEEKER)
     */
    seekerId: string;
    title: string;
    description: string;
    /**
     * Type of visa (e.g., 'Tourist', 'Business', 'Work Permit')
     */
    visaType?: string | null;
    /**
     * Minimum budget in THB
     */
    budgetMin?: number | null;
    /**
     * Maximum budget in THB
     */
    budgetMax?: number | null;
    /**
     * Location preference
     */
    location?: string | null;
    status: RequestStatus;
    createdAt: string;
};
