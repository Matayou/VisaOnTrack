/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MilestoneStatus } from './MilestoneStatus';

/**
 * Milestone schema per Section 3 data model
 */
export type Milestone = {
    id: string;
    /**
     * Foreign key to Order
     */
    orderId: string;
    /**
     * Milestone title
     */
    title: string;
    /**
     * Due date/timestamp
     */
    dueAt: string;
    status: MilestoneStatus;
};
