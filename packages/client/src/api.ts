/**
 * VisaOnTrack v2 — API Client Wrapper
 * 
 * This file exports the generated API client with proper configuration.
 * 
 * Usage:
 *   import { api } from '@visaontrack/client';
 *   const response = await api.auth.login({ email, password });
 */

import { OpenAPI } from './core/OpenAPI';
import * as Services from './index';

/**
 * Configure OpenAPI client to use JWT cookies.
 * This ensures all requests include credentials (JWT HttpOnly cookies).
 */
function configureClient() {
  // Get base URL from environment
  let baseUrl = 'http://localhost:3001'; // Default for local development
  
  // Try to get from environment (works in both browser and Node.js)
  // @ts-ignore - process.env might not be available in all contexts
  const publicApiUrl = typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL;
  // @ts-ignore
  const apiUrl = typeof process !== 'undefined' && process.env?.API_URL;
  
  if (publicApiUrl) {
    baseUrl = publicApiUrl;
  } else if (apiUrl) {
    baseUrl = apiUrl;
  }
  // Removed the browser fallback to '/api' - always use explicit URL in development

  // Configure OpenAPI client
  OpenAPI.BASE = baseUrl;
  OpenAPI.WITH_CREDENTIALS = true; // Enable credentials (JWT HttpOnly cookies)
  OpenAPI.CREDENTIALS = 'include'; // Include credentials with all requests
  OpenAPI.VERSION = '0.2.0';
}

// Configure on import
configureClient();

/**
 * API client instance.
 * Exports all services for type-safe API calls.
 * 
 * Example:
 *   import { api } from '@visaontrack/client';
 *   const user = await api.auth.login({ email, password });
 */
export const api = {
  auth: Services.AuthService,
  users: Services.UsersService,
  providers: Services.ProvidersService,
  packages: Services.PackagesService,
  requests: Services.RequestsService,
  messages: Services.MessagesService,
  quotes: Services.QuotesService,
  checkout: Services.CheckoutService,
  orders: Services.OrdersService,
  reviews: Services.ReviewsService,
  billing: Services.BillingService,
  admin: Services.AdminService,
  credits: Services.CreditsService,
};

// Re-export types and models
export type * from './index';

// Re-export enums as values (not types)
export { UserRole } from './models/UserRole';
export { RequestStatus } from './models/RequestStatus';
