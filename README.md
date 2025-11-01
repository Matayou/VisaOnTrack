# VisaOnTrack v2

**Two-sided marketplace connecting visa seekers with vetted service providers in Thailand.**

Request-centric platform where seekers post requests and providers reply with quotes.

---

## 🏗️ Architecture

**Frontend**
- Next.js (App Router) + React + TypeScript
- Tailwind + shadcn/ui + Lucide icons
- TanStack Query for data fetching
- Zod for runtime validation
- API client auto-generated from OpenAPI (contract-first)

**Backend**
- NestJS + TypeScript
- PostgreSQL + Prisma (schema-first)
- REST API (OpenAPI 3.1)
- JWT authentication (HttpOnly cookies)
- Role-based authorization (RBAC)

**Infrastructure**
- Frontend: Vercel
- Backend: Fly.io / Railway
- Database: Neon / Supabase
- CI/CD: GitHub Actions
- Observability: Sentry + OpenTelemetry

---

## 📁 Monorepo Structure

```
/visaontrack
  /apps
    /web      (Next.js frontend)
    /api      (NestJS backend)
  /packages
    /types    (OpenAPI spec, Zod models)
    /client   (generated API client)
    /ui       (shared UI components)
  /infra      (IaC, migrations)
  .github/workflows/ (CI/CD)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL (or use Neon/Supabase)

### Setup

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Generate Prisma client
cd apps/api
npx prisma generate

# Generate API client
pnpm generate:client

# Run development servers
pnpm dev
```

### Development Workflow

1. **Frontend:** `cd apps/web && pnpm dev`
2. **Backend:** `cd apps/api && pnpm dev`
3. **Watch mode:** `pnpm dev` (from root)

---

## 📋 Development Workflow

### Contract-First Development

1. Update OpenAPI spec (`packages/types/openapi.yaml`)
2. Regenerate API client: `pnpm generate:client`
3. Use generated client in frontend: `import { api } from '@visaontrack/client'`

### Schema-First Development

1. Update Prisma schema (`apps/api/prisma/schema.prisma`)
2. Generate Prisma client: `npx prisma generate`
3. Create migration: `npx prisma migrate dev`

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Type check
pnpm typecheck

# Lint
pnpm lint

# E2E tests
pnpm test:e2e
```

---

## 📚 Documentation

- **Specification:** [`visaontrack-v2-spec.md`](./visaontrack-v2-spec.md) - Single source of truth
- **Contributing:** [`CONTRIBUTING.md`](./CONTRIBUTING.md) - DoR/DoD, RFC process
- **Architecture:** [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) - High-level overview
- **Agent Team:** [`AGENT_TEAM.md`](./AGENT_TEAM.md) - Team structure and coordination
- **Scope Guardian:** [`SCOPE_GUARDIAN.md`](./SCOPE_GUARDIAN.md) - Anti-scope-creep playbook

---

## 🔒 Security

- RBAC (SEEKER/PROVIDER/ADMIN roles)
- MFA for admin users
- Audit logging for all admin mutations
- JWT authentication via HttpOnly cookies
- PDPA/GDPR compliance

See [`visaontrack-v2-spec.md`](./visaontrack-v2-spec.md) Section 11 for full security requirements.

---

## 📄 License

[Add license information]

---

## 🙏 Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for:
- DoR (Definition of Ready) checklist
- DoD (Definition of Done) checklist
- RFC process for spec changes
- PR guidelines

---

**Built with contract-first (OpenAPI) + schema-first (Prisma) principles.**

