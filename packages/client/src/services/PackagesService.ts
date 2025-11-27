/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatePackageRequest } from '../models/CreatePackageRequest';
import type { ServicePackage } from '../models/ServicePackage';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PackagesService {

    /**
     * Create service package
     * Create service package (PROVIDER role, entitlement check: packages.max)
     * @returns ServicePackage Package created
     * @throws ApiError
     */
    public static createPackage({
requestBody,
}: {
requestBody: CreatePackageRequest,
}): CancelablePromise<ServicePackage> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/packages',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentication required or invalid token`,
                403: `Entitlement limit exceeded (e.g., quotes.monthly.max, packages.max)`,
            },
        });
    }

}
