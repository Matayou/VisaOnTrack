export interface ApiErrorBody {
  message?: string;
  code?: string;
  [key: string]: unknown;
}

export interface ApiError extends Error {
  status?: number;
  statusText?: string;
  body?: ApiErrorBody;
}

export const isApiError = (error: unknown): error is ApiError => {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const candidate = error as Partial<ApiError>;
  return (
    'status' in candidate ||
    'statusText' in candidate ||
    'body' in candidate ||
    'message' in candidate
  );
};

export const getApiErrorMessage = (error: ApiError, fallback = 'Something went wrong.') =>
  error.body?.message || error.message || fallback;
