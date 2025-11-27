/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Error } from './Error';

export type ThrottledError = (Error & {
/**
 * Seconds until retry allowed
 */
retryAfter?: number;
});
