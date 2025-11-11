/**
 * Jest setup file for test environment
 * 
 * This file runs before all tests to set up:
 * - Test database configuration
 * - Mock configurations
 * - Global test utilities
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test_db';

