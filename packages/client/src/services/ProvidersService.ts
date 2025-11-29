/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateProviderRequest } from '../models/CreateProviderRequest';
import type { ProviderListResponse } from '../models/ProviderListResponse';
import type { ProviderProfile } from '../models/ProviderProfile';
import type { UpdateProviderRequest } from '../models/UpdateProviderRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ProvidersService {

    /**
     * Search providers
     * Search and list providers with pagination
     * @returns ProviderListResponse Provider list
     * @throws ApiError
     */
    public static searchProviders({
page = 1,
limit = 20,
query,
location,
}: {
/**
 * Page number (1-based)
 */
page?: number,
/**
 * Items per page
 */
limit?: number,
/**
 * Search query
 */
query?: string,
/**
 * Location filter
 */
location?: string,
}): CancelablePromise<ProviderListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/providers',
            query: {
                'page': page,
                'limit': limit,
                'query': query,
                'location': location,
            },
            errors: {
                401: `Authentication required or invalid token`,
            },
        });
    }

    /**
     * Create provider profile
     * Create or update provider profile (PROVIDER role required)
     * @returns ProviderProfile Provider created
     * @throws ApiError
     */
    public static createProvider({
requestBody,
}: {
requestBody: CreateProviderRequest,
}): CancelablePromise<ProviderProfile> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/providers',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentication required or invalid token`,
                403: `Insufficient permissions`,
            },
        });
    }

    /**
     * Get provider by ID
     * Get provider profile by ID
     * @returns ProviderProfile Provider profile
     * @throws ApiError
     */
    public static getProvider({
id,
}: {
id: string,
}): CancelablePromise<ProviderProfile> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/providers/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }

    /**
     * Update provider profile
     * Update provider profile (owner or ADMIN only)
     * @returns ProviderProfile Provider updated
     * @throws ApiError
     */
    public static updateProvider({
id,
requestBody,
}: {
id: string,
requestBody: UpdateProviderRequest,
}): CancelablePromise<ProviderProfile> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/providers/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentication required or invalid token`,
                403: `Insufficient permissions`,
                404: `Resource not found`,
            },
        });
    }

}
