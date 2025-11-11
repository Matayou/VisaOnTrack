/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { User } from './User';

/**
 * Login response (RFC-003: includes emailVerified status)
 */
export type LoginResponse = {
    user?: User;
    /**
     * Success message
     */
    message?: string;
};
