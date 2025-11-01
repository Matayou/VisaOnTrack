/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Provider profile schema per Section 3 data model
 */
export type ProviderProfile = {
    id: string;
    /**
     * Foreign key to User
     */
    userId: string;
    businessName: string;
    description?: string | null;
    location?: string | null;
    languages?: Array<string>;
    /**
     * ISO 8601 timestamp when provider was verified
     */
    verifiedAt?: string | null;
};
