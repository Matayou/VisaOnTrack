/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ResetPasswordRequest = {
    /**
     * Password reset token from email link
     */
    token: string;
    /**
     * New password (must meet strength requirements)
     */
    newPassword: string;
};
