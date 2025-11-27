/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateQuoteRequest } from '../models/CreateQuoteRequest';
import type { Quote } from '../models/Quote';
import type { UpdateQuoteRequest } from '../models/UpdateQuoteRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class QuotesService {

    /**
     * Submit quote
     * Submit quote for request (PROVIDER role, entitlement check: quotes.monthly.max)
     * @returns Quote Quote submitted
     * @throws ApiError
     */
    public static submitQuote({
id,
requestBody,
}: {
id: string,
requestBody: CreateQuoteRequest,
}): CancelablePromise<Quote> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/requests/{id}/quotes',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentication required or invalid token`,
                403: `Entitlement limit exceeded (e.g., quotes.monthly.max, packages.max)`,
                429: `Rate limit exceeded`,
            },
        });
    }

    /**
     * Get quote by ID
     * Get quote details
     * @returns Quote Quote details
     * @throws ApiError
     */
    public static getQuote({
id,
}: {
id: string,
}): CancelablePromise<Quote> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/quotes/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }

    /**
     * Update quote
     * Update quote status (provider owner or seeker can accept/decline)
     * @returns Quote Quote updated
     * @throws ApiError
     */
    public static updateQuote({
id,
requestBody,
}: {
id: string,
requestBody: UpdateQuoteRequest,
}): CancelablePromise<Quote> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/quotes/{id}',
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
