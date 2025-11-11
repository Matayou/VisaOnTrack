/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type LoginRequest = {
    email: string;
    password: string;
    /**
     * If true, token expiration extended to 7 days instead of 15 minutes
     */
    rememberMe?: boolean | null;
};
