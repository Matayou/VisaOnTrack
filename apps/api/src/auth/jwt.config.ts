/**
 * JWT Configuration
 * 
 * Token expiration:
 * - Normal login: 15 minutes
 * - Remember me: 7 days
 */

if (!process.env.JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET is not defined in environment variables.');
}

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = '15m'; // 15 minutes for normal login
export const JWT_REMEMBER_ME_EXPIRES_IN = '7d'; // 7 days for remember me

export const COOKIE_NAME = 'token';
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: (process.env.NODE_ENV === 'production' ? 'strict' : 'lax') as 'strict' | 'lax' | 'none', // 'lax' for localhost cross-origin
  path: '/',
};

