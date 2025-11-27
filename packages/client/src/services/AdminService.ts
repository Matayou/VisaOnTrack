/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AdminService {

    /**
     * List providers (admin)
     * Admin-only endpoint for provider management (M7 placeholder)
     * @returns any Provider list
     * @throws ApiError
     */
    public static adminListProviders(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/providers',
            errors: {
                401: `Authentication required or invalid token`,
                403: `Insufficient permissions`,
            },
        });
    }

}
