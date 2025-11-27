/**
 * Standardized error handling utilities
 * 
 * This module provides consistent error handling patterns across the application,
 * ensuring uniform error message extraction and user-friendly error display.
 * 
 * @example
 * import { extractErrorMessage, handleApiError } from '@/lib/error-handling';
 * 
 * try {
 *   await api.someAction();
 * } catch (error) {
 *   const { message } = handleApiError(error, 'Failed to perform action');
 *   setError(message);
 * }
 */

import { isApiError, getApiErrorMessage } from './api-error';

/**
 * Extracts a user-friendly error message from any error type
 * 
 * @param error - The error to extract message from (unknown type)
 * @param fallback - Fallback message if error message cannot be extracted
 * @returns User-friendly error message
 * 
 * @example
 * const message = extractErrorMessage(error, 'Something went wrong');
 */
export function extractErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (isApiError(error)) {
    return getApiErrorMessage(error, fallback);
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  if (typeof error === 'string') {
    return error;
  }

  return fallback;
}

/**
 * Structured error handling result
 */
export interface ErrorHandleResult {
  message: string;
  status?: number;
  code?: string;
  isNetworkError?: boolean;
  isValidationError?: boolean;
  isAuthError?: boolean;
}

/**
 * Handles API errors and returns structured error information
 * 
 * @param error - The error to handle (unknown type)
 * @param context - Optional context for the error (e.g., 'login', 'registration')
 * @returns Structured error information
 * 
 * @example
 * const { message, status, isAuthError } = handleApiError(error, 'login');
 * if (isAuthError) {
 *   // Handle authentication error
 * }
 */
export function handleApiError(error: unknown, context?: string): ErrorHandleResult {
  const result: ErrorHandleResult = {
    message: extractErrorMessage(error),
    isNetworkError: isNetworkError(error),
    isValidationError: isValidationError(error),
    isAuthError: isAuthError(error),
  };

  if (isApiError(error)) {
    result.status = error.status;
    result.code = error.body?.code;
    
    // Enhance message with context if provided
    if (context && result.message === 'Something went wrong.') {
      result.message = `Failed to ${context}. Please try again.`;
    }
  }

  return result;
}

/**
 * Gets a user-friendly error message for display
 * 
 * Provides context-aware error messages that are safe to show to users.
 * 
 * @param error - The error to get message from
 * @param context - Optional context for the error
 * @returns User-friendly error message
 * 
 * @example
 * const message = getErrorDisplayMessage(error, 'sign in');
 * // Returns: "Failed to sign in. Please try again." or specific error message
 */
export function getErrorDisplayMessage(error: unknown, context?: string): string {
  const handled = handleApiError(error, context);
  
  // Provide user-friendly messages for common error types
  if (handled.isNetworkError) {
    return 'Network error. Please check your connection and try again.';
  }

  if (handled.isAuthError) {
    if (handled.status === 401) {
      return 'Invalid credentials. Please check your email and password.';
    }
    if (handled.status === 403) {
      return 'You do not have permission to perform this action.';
    }
  }

  if (handled.isValidationError) {
    return handled.message || 'Please check your input and try again.';
  }

  // Use the extracted message or provide context-aware fallback
  if (context && handled.message === 'Something went wrong.') {
    return `Failed to ${context}. Please try again.`;
  }

  return handled.message;
}

/**
 * Checks if an error is a network error
 * 
 * @param error - The error to check
 * @returns True if the error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('network') ||
      error.message.includes('fetch') ||
      error.message.includes('NetworkError') ||
      error.name === 'NetworkError' ||
      error.name === 'TypeError' // Common for network failures
    );
  }

  if (isApiError(error)) {
    // Network errors often don't have a status or have status 0
    return error.status === 0 || (!error.status && !error.body);
  }

  return false;
}

/**
 * Checks if an error is a validation error
 * 
 * @param error - The error to check
 * @returns True if the error is a validation error
 */
export function isValidationError(error: unknown): boolean {
  if (isApiError(error)) {
    if (error.status === 400) {
      return true;
    }
    if (error.body?.code === 'VALIDATION_ERROR' || error.body?.code === 'BAD_REQUEST') {
      return true;
    }
    if (error.body?.message?.toLowerCase().includes('validation') ||
        error.body?.message?.toLowerCase().includes('invalid')) {
      return true;
    }
  }

  if (error instanceof Error) {
    return error.message.toLowerCase().includes('validation') ||
           error.message.toLowerCase().includes('invalid');
  }

  return false;
}

/**
 * Checks if an error is an authentication/authorization error
 * 
 * @param error - The error to check
 * @returns True if the error is an auth error
 */
export function isAuthError(error: unknown): boolean {
  if (isApiError(error)) {
    if (error.status === 401 || error.status === 403) {
      return true;
    }
    if (error.body?.code === 'UNAUTHORIZED' || error.body?.code === 'FORBIDDEN') {
      return true;
    }
  }

  if (error instanceof Error) {
    return error.message.toLowerCase().includes('unauthorized') ||
           error.message.toLowerCase().includes('forbidden') ||
           error.message.toLowerCase().includes('authentication') ||
           error.message.toLowerCase().includes('authorization');
  }

  return false;
}

/**
 * Checks if an error is a rate limit error
 * 
 * @param error - The error to check
 * @returns True if the error is a rate limit error
 */
export function isRateLimitError(error: unknown): boolean {
  if (isApiError(error)) {
    if (error.status === 429) {
      return true;
    }
    if (error.body?.code === 'RATE_LIMIT_EXCEEDED' || error.body?.code === 'TOO_MANY_REQUESTS') {
      return true;
    }
  }

  if (error instanceof Error) {
    return error.message.toLowerCase().includes('rate limit') ||
           error.message.toLowerCase().includes('too many requests');
  }

  return false;
}

/**
 * Gets a user-friendly message for rate limit errors
 * 
 * @param error - The rate limit error
 * @returns User-friendly rate limit message
 */
export function getRateLimitMessage(error: unknown): string {
  if (isRateLimitError(error)) {
    return 'Too many requests. Please wait a few minutes and try again.';
  }
  return 'Please try again later.';
}

