/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserRole } from './UserRole';

/**
 * Update user profile request (partial update, including role selection)
 */
export type UpdateUserRequest = {
    /**
     * Update user role (for account type selection)
     */
    role?: UserRole;
    /**
     * Update user name
     */
    name?: string | null;
    /**
     * Update user phone number
     */
    phone?: string | null;
    /**
     * Update user locale preference
     */
    locale?: string | null;
};
