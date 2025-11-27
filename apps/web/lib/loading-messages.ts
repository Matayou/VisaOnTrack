/**
 * Standardized loading message constants
 * 
 * This module provides consistent loading messages across the application,
 * ensuring a uniform user experience and making it easier to update messaging.
 * 
 * @example
 * import { LOADING_SIGNING_IN } from '@/lib/loading-messages';
 * 
 * <Button loading>
 *   {isLoading ? LOADING_SIGNING_IN : 'Sign in'}
 * </Button>
 */

/**
 * Generic loading message for general loading states
 * Use when no specific action context is available
 */
export const LOADING_GENERIC = 'Loading...';

/**
 * Loading message for authentication/sign-in actions
 * Use when user is signing in to their account
 */
export const LOADING_SIGNING_IN = 'Signing in...';

/**
 * Loading message for account creation
 * Use when user is creating a new account
 */
export const LOADING_CREATING_ACCOUNT = 'Creating account...';

/**
 * Loading message for save operations
 * Use when saving data (forms, settings, etc.)
 */
export const LOADING_SAVING = 'Saving...';

/**
 * Loading message for form submission
 * Use when submitting forms
 */
export const LOADING_SUBMITTING = 'Submitting...';

/**
 * Loading message for processing operations
 * Use when processing data or performing background operations
 */
export const LOADING_PROCESSING = 'Processing...';

/**
 * Loading message for password reset operations
 * Use when resetting passwords
 */
export const LOADING_RESETTING_PASSWORD = 'Resetting password...';

/**
 * Loading message for sending email operations
 * Use when sending emails (verification, password reset, etc.)
 */
export const LOADING_SENDING_EMAIL = 'Sending email...';

