# E2E Tests with Playwright

This directory contains end-to-end tests using Playwright.

## Setup

Playwright is already installed and configured. Browsers have been downloaded.

## Running Tests

### Run All E2E Tests
```bash
pnpm test:e2e
```

### Run Tests in UI Mode (Interactive)
```bash
pnpm test:e2e:ui
```

### Run Tests in Debug Mode
```bash
pnpm test:e2e:debug
```

### View Test Report
```bash
pnpm test:e2e:report
```

## Test Structure

Tests are located in `tests/e2e/` directory:

- `example.spec.ts` - Example test (placeholder)
- `auth.spec.ts` - Authentication flow tests (to be created)
- `onboarding.spec.ts` - Onboarding flow tests (to be created)
- `providers.spec.ts` - Provider feature tests (to be created)
- `seekers.spec.ts` - Seeker feature tests (to be created)

## Configuration

Playwright configuration is in `playwright.config.ts` at the root.

**Key Settings:**
- **Base URL:** `http://localhost:3000` (frontend)
- **API URL:** `http://localhost:3001` (backend)
- **Browsers:** Chromium, Firefox, WebKit
- **Mobile:** Chrome (Pixel 5), Safari (iPhone 12)
- **Web Servers:** Automatically starts frontend and backend before tests

## Writing Tests

### Example Test

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Fill in login form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Test123!@#');
    await page.click('button[type="submit"]');
    
    // Wait for redirect
    await page.waitForURL('/dashboard');
    
    // Verify user is logged in
    await expect(page.locator('text=Welcome')).toBeVisible();
  });
});
```

## Environment Variables

Set these environment variables if needed:

- `PLAYWRIGHT_TEST_BASE_URL` - Override base URL (default: `http://localhost:3000`)
- `CI` - Set to `true` in CI environment (enables retries, single worker)

## Test Data

For E2E tests, you may need:
- Test user accounts
- Test database setup
- Test API endpoints

Consider creating a test data setup script in `tests/setup/` directory.

## Best Practices

1. **Use Page Object Model** - Create page objects for reusable page interactions
2. **Use Fixtures** - Create custom fixtures for authentication, test data, etc.
3. **Clean Up** - Always clean up test data after tests
4. **Isolation** - Each test should be independent and not rely on other tests
5. **Wait for Elements** - Use `waitFor` instead of `sleep` for better reliability

## CI/CD Integration

Playwright tests can be run in CI/CD pipelines. The configuration includes:
- Retries on CI (2 retries)
- Single worker on CI (prevents resource exhaustion)
- HTML report generation

---

**Created:** 2025-01-11  
**Status:** ✅ **READY** — Playwright installed and configured

