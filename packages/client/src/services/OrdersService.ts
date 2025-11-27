/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Order } from '../models/Order';
import type { OrderListResponse } from '../models/OrderListResponse';
import type { OrderStatus } from '../models/OrderStatus';
import type { UpdateOrderRequest } from '../models/UpdateOrderRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class OrdersService {

    /**
     * List orders
     * List orders (user's own orders)
     * @returns OrderListResponse Order list
     * @throws ApiError
     */
    public static listOrders({
page = 1,
limit = 20,
status,
}: {
/**
 * Page number (1-based)
 */
page?: number,
/**
 * Items per page
 */
limit?: number,
status?: OrderStatus,
}): CancelablePromise<OrderListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders',
            query: {
                'page': page,
                'limit': limit,
                'status': status,
            },
            errors: {
                401: `Authentication required or invalid token`,
            },
        });
    }

    /**
     * Get order by ID
     * Get order details (participants only)
     * @returns Order Order details
     * @throws ApiError
     */
    public static getOrder({
id,
}: {
id: string,
}): CancelablePromise<Order> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Authentication required or invalid token`,
                403: `Insufficient permissions`,
                404: `Resource not found`,
            },
        });
    }

    /**
     * Update order
     * Update order status/milestones (participants or ADMIN only)
     * @returns Order Order updated
     * @throws ApiError
     */
    public static updateOrder({
id,
requestBody,
}: {
id: string,
requestBody: UpdateOrderRequest,
}): CancelablePromise<Order> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/orders/{id}',
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
