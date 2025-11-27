/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Create service package request (entitlement check: packages.max)
 */
export type CreatePackageRequest = {
    title: string;
    description: string;
    priceTHB: number;
    deliverables: Array<string>;
    etaDays: number;
};
