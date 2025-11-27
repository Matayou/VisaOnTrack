/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Error } from './Error';

export type EntitlementExceededError = (Error & {
/**
 * Entitlement key (e.g., 'quotes.monthly.max')
 */
entitlement?: string;
/**
 * Entitlement limit
 */
limit?: number;
/**
 * Current usage
 */
used?: number;
});
