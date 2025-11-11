/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type RegisterRequest = {
    /**
     * User email address (must be unique)
     */
    email: string;
    /**
     * Password must be at least 8 characters and contain:
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character (!@#$%^&*)
 * 
     */
    password: string;
    /**
     * User name (optional)
     */
    name?: string | null;
    /**
     * User phone number (optional)
     */
    phone?: string | null;
};
