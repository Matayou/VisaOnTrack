/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginRequest } from '../models/LoginRequest';
import type { LoginResponse } from '../models/LoginResponse';

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

}
