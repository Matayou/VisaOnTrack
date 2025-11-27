/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateReviewRequest } from '../models/CreateReviewRequest';
import type { Review } from '../models/Review';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ReviewsService {

    /**
     * Submit review
     * Submit review for completed order (order participant only)
     * @returns Review Review submitted
     * @throws ApiError
     */
    public static submitReview({
id,
requestBody,
}: {
id: string,
requestBody: CreateReviewRequest,
}): CancelablePromise<Review> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orders/{id}/review',
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
