/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from '../models/User';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UsersService {

    /**
     * Get current user
     * Returns authenticated user profile
     * @returns User User profile
     * @throws ApiError
     */
    public static getCurrentUser(): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/me',
            errors: {
                401: `Authentication required or invalid token`,
            },
        });
    }

}
