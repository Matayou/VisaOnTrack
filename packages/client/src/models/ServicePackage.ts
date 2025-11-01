/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Service package schema per Section 3 data model
 */
export type ServicePackage = {
    id: string;
    /**
     * Foreign key to ProviderProfile
     */
    providerId: string;
    title: string;
    description: string;
    /**
     * Price in Thai Baht
     */
    priceTHB: number;
    /**
     * List of deliverables included in package
     */
    deliverables: Array<string>;
    /**
     * Estimated delivery time in days
     */
    etaDays: number;
    isActive: boolean;
};
