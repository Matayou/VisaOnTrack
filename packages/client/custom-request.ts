/**
 * Custom request function for OpenAPI client generation.
 * 
 * This ensures all requests include credentials (JWT HttpOnly cookies)
 * and handles the base URL properly.
 */

export interface RequestConfig {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: any;
  queryParams?: Record<string, string>;
}

/**
 * Get the base URL for the API.
 */
function getBaseUrl(): string {
  // In browser, use relative path (same origin) or env variable
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || '/api';
  }
  
  // In Node.js/SSR, use full URL
  return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
}

/**
 * Custom request function that wraps fetch with JWT cookie support.
 * 
 * This ensures:
 * - Credentials (JWT HttpOnly cookies) are included
 * - Base URL is configured correctly
 * - Headers are set properly
 */
export async function request<T>(config: RequestConfig): Promise<T> {
  const baseUrl = getBaseUrl();
  
  // Build full URL
  let url = config.url;
  if (!url.startsWith('http')) {
    url = `${baseUrl}${url}`;
  }

  // Add query parameters
  if (config.queryParams && Object.keys(config.queryParams).length > 0) {
    const params = new URLSearchParams(config.queryParams);
    url += `?${params.toString()}`;
  }

  // Prepare headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...config.headers,
  };

  // Prepare body
  let body: string | undefined;
  if (config.body) {
    if (typeof config.body === 'string') {
      body = config.body;
    } else {
      body = JSON.stringify(config.body);
    }
  }

  // Make request with credentials
  const response = await fetch(url, {
    method: config.method,
    headers,
    body,
    credentials: 'include', // Include credentials (JWT HttpOnly cookies)
  });

  // Handle errors
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      code: 'HTTP_ERROR',
      message: response.statusText,
      status: response.status,
    }));
    throw error;
  }

  // Handle empty responses
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T;
  }

  // Parse and return response
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return response.json() as Promise<T>;
  }

  return response.text() as Promise<T>;
}

