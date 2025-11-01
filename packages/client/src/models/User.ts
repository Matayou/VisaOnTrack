/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserRole } from './UserRole';

/**
 * User schema per Section 3 data model
 */
export type User = {
    id: string;
    email: string;
    role: UserRole;
    name?: string | null;
    phone?: string | null;
    locale?: string;
    createdAt: string;
};
