/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateRequestRequest } from '../models/CreateRequestRequest';
import type { Request } from '../models/Request';
import type { RequestListResponse } from '../models/RequestListResponse';
import type { RequestStatus } from '../models/RequestStatus';
import type { UpdateRequestRequest } from '../models/UpdateRequestRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class RequestsService {

    /**
     * List requests
     * List visa requests with pagination
     * @returns RequestListResponse Request list
     * @throws ApiError
     */
    public static listRequests({
page = 1,
limit = 20,
status,
seekerId,
}: {
/**
 * Page number (1-based)
 */
page?: number,
/**
 * Items per page
 */
limit?: number,
status?: RequestStatus,
seekerId?: string,
}): CancelablePromise<RequestListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/requests',
            query: {
                'page': page,
                'limit': limit,
                'status': status,
                'seekerId': seekerId,
            },
            errors: {
                401: `Authentication required or invalid token`,
            },
        });
    }

    /**
     * Create request
     * Post new visa request (SEEKER role required)
     * @returns Request Request created
     * @throws ApiError
     */
    public static createRequest({
requestBody,
}: {
requestBody: CreateRequestRequest,
}): CancelablePromise<Request> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/requests',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentication required or invalid token`,
            },
        });
    }

    /**
     * Get request by ID
     * Get request details
     * @returns Request Request details
     * @throws ApiError
     */
    public static getRequest({
id,
}: {
id: string,
}): CancelablePromise<Request> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/requests/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Resource not found`,
            },
        });
    }

    /**
     * Update request
     * Update request (owner or ADMIN only)
     * @returns Request Request updated
     * @throws ApiError
     */
    public static updateRequest({
id,
requestBody,
}: {
id: string,
requestBody: UpdateRequestRequest,
}): CancelablePromise<Request> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/requests/{id}',
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

    /**
     * Unlock request
     * Unlock a request to view contact details and submit a proposal (PROVIDER only)
     * @returns any Request unlocked successfully
     * @throws ApiError
     */
    public static unlockRequest({
id,
}: {
id: string,
}): CancelablePromise<{ success: boolean; proposalId: string; remainingCredits: number }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/requests/{id}/unlock',
            path: {
                'id': id,
            },
            errors: {
                401: `Authentication required or invalid token`,
                403: `Insufficient credits or permissions`,
                404: `Request not found`,
            },
        });
    }

}
