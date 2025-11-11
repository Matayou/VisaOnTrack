/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ForgotPasswordRequest } from '../models/ForgotPasswordRequest';
import type { ForgotPasswordResponse } from '../models/ForgotPasswordResponse';
import type { LoginRequest } from '../models/LoginRequest';
import type { LoginResponse } from '../models/LoginResponse';
import type { LogoutResponse } from '../models/LogoutResponse';
import type { RegisterRequest } from '../models/RegisterRequest';
import type { RegisterResponse } from '../models/RegisterResponse';
import type { ResendVerificationResponse } from '../models/ResendVerificationResponse';
import type { ResetPasswordRequest } from '../models/ResetPasswordRequest';
import type { ResetPasswordResponse } from '../models/ResetPasswordResponse';
import type { VerifyEmailResponse } from '../models/VerifyEmailResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AuthService {

    /**
     * Login user
     * Authenticate user with email/password. Returns JWT in HttpOnly cookie.
     * @returns LoginResponse Login successful. JWT set in HttpOnly cookie.
     * @throws ApiError
     */
    public static login({
requestBody,
}: {
requestBody: LoginRequest,
}): CancelablePromise<LoginResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Invalid credentials`,
            },
        });
    }

    /**
     * Request password reset
     * Send password reset email to user. Always returns success (200 OK) for security reasons (no user enumeration).
 * If user exists, email with reset token link is sent. Token expires in 1 hour.
 * 
     * @returns ForgotPasswordResponse Always returns success (200 OK) regardless of whether user exists, to prevent user enumeration.
 * If user exists, password reset email is sent with reset token link.
 * 
     * @throws ApiError
     */
    public static forgotPassword({
requestBody,
}: {
requestBody: ForgotPasswordRequest,
}): CancelablePromise<ForgotPasswordResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/forgot-password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid email format`,
                429: `Rate limit exceeded`,
            },
        });
    }

    /**
     * Reset password with token
     * Reset user password using reset token from email. Token must be valid, not expired, and not already used.
 * Token is single-use and invalidated after successful reset.
 * 
     * @returns ResetPasswordResponse Password reset successful. User can now login with new password.
     * @throws ApiError
     */
    public static resetPassword({
requestBody,
}: {
requestBody: ResetPasswordRequest,
}): CancelablePromise<ResetPasswordResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/reset-password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid token or weak password`,
                401: `Token expired or already used`,
                429: `Rate limit exceeded`,
            },
        });
    }

    /**
     * Verify email with token
     * Verify email address using token from verification email link (RFC-003).
 * Token expires after 24 hours and is single-use.
 * 
     * @returns VerifyEmailResponse Email verified successfully
     * @throws ApiError
     */
    public static verifyEmail({
token,
}: {
/**
 * Verification token from email link
 */
token: string,
}): CancelablePromise<VerifyEmailResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/verify-email',
            query: {
                'token': token,
            },
            errors: {
                400: `Invalid request parameters or body`,
                401: `Authentication required or invalid token`,
            },
        });
    }

    /**
     * Resend verification email
     * Resend verification email to authenticated user (RFC-003).
 * Rate limited to 3 requests per hour per user.
 * 
     * @returns ResendVerificationResponse Verification email sent successfully
     * @throws ApiError
     */
    public static resendVerification(): CancelablePromise<ResendVerificationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/resend-verification',
            errors: {
                400: `Invalid request parameters or body`,
                401: `Authentication required or invalid token`,
                429: `Rate limit exceeded`,
            },
        });
    }

    /**
     * Logout user
     * Logout authenticated user. Clears JWT cookie and logs logout event for audit.
 * Requires authentication (JWT token in HttpOnly cookie).
 * 
     * @returns LogoutResponse Logout successful. JWT cookie cleared.
     * @throws ApiError
     */
    public static logout(): CancelablePromise<LogoutResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/logout',
            errors: {
                401: `Authentication required or invalid token`,
            },
        });
    }

    /**
     * Register new user
     * Register a new user account. Creates user with default role SEEKER.
 * Password must meet strength requirements (uppercase, lowercase, number, special character).
 * Returns JWT token in HttpOnly cookie.
 * Sends verification email (RFC-003). User must verify email before full access.
 * 
     * @returns RegisterResponse Registration successful. JWT set in HttpOnly cookie.
     * @throws ApiError
     */
    public static register({
requestBody,
}: {
requestBody: RegisterRequest,
}): CancelablePromise<RegisterResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid email format, weak password, or duplicate email`,
                429: `Rate limit exceeded`,
            },
        });
    }

}
