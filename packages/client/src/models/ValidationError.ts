/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Error } from './Error';

export type ValidationError = (Error & {
errors: Array<{
/**
 * Field name that failed validation
 */
field: string;
/**
 * Validation error message
 */
message: string;
}>;
});
