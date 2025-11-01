# @visaontrack/client

Generated API client for VisaOnTrack v2 from OpenAPI specification.

## Installation

This package is part of the VisaOnTrack monorepo. No separate installation needed.

## Generating the Client

To generate the API client from the OpenAPI specification:

```bash
pnpm generate:client
```

Or from the client package directly:

```bash
cd packages/client
pnpm generate
```

This will:
1. Read the OpenAPI spec from `/packages/types/openapi.yaml`
2. Generate TypeScript types and fetch-based client
3. Output to `/packages/client/src/`

## Usage

```typescript
import { api } from '@visaontrack/client';

// Login
const loginResponse = await api.auth.login({
  email: 'user@example.com',
  password: 'password',
});

// Get current user
const user = await api.users.getCurrentUser();

// Create a request
const request = await api.requests.createRequest({
  title: 'Tourist Visa',
  description: 'Looking for tourist visa assistance',
  visaType: 'TOURIST',
  budgetMin: 5000,
  budgetMax: 10000,
  location: 'Bangkok',
});
```

## Authentication

The client automatically includes credentials (JWT HttpOnly cookies) with all requests. No manual token handling is required.

## Type Safety

All API endpoints and models are fully typed based on the OpenAPI specification. TypeScript will provide autocomplete and type checking.

## Environment Variables

The client uses the following environment variables:
- `NEXT_PUBLIC_API_URL` - API base URL (browser/SSR)
- `API_URL` - API base URL (Node.js/SSR fallback)

Default: `http://localhost:3001` (development)

## Regenerating

Regenerate the client when the OpenAPI spec changes:

1. Update `/packages/types/openapi.yaml`
2. Run `pnpm generate:client`
3. Commit the generated files

## Contract-First Principle

This client is generated from the OpenAPI contract (contract-first approach). Any breaking changes to the API will require:
1. Updating the OpenAPI spec version (semver)
2. Regenerating the client
3. Updating frontend code to match new types

