/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MilestoneStatus } from './MilestoneStatus';

/**
 * Milestone input for order updates
 */
export type MilestoneInput = {
    /**
     * Milestone ID (if updating existing)
     */
    id?: string;
    title?: string;
    dueAt?: string;
    status?: MilestoneStatus;
};
