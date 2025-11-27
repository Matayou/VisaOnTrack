# M1-BE-7: Setup Steps Required

**Date:** 2025-01-11  
**Status:** ⚠️ **SETUP REQUIRED**  
**Backend Engineer:** Implementation complete, but setup steps need to be executed

---

## ✅ Completed by Backend Engineer

1. ✅ **Dependencies Installed** - `npm install` completed successfully
2. ✅ **Code Implementation** - All login/register endpoints implemented
3. ✅ **OpenAPI Spec Updated** - Register endpoint added (v0.2.2)

---

## ⚠️ Manual Setup Steps Required

### 1. **Create .env File** (REQUIRED)

Create `apps/api/.env` file with database connection:

```bash
# Copy example file
cp apps/api/.env.example apps/api/.env

# Then edit .env and set your actual DATABASE_URL:
DATABASE_URL="postgresql://user:password@localhost:5432/visaontrack"
JWT_SECRET="your-secret-key-change-in-production"
```

**Note:** Replace `user`, `password`, and `visaontrack` with your actual PostgreSQL credentials.

### 2. **Run Database Migration** (REQUIRED)

After `.env` is configured:

```bash
cd apps/api
npx prisma migrate dev --name add_password_hash
npx prisma generate
```

This will:
- Create migration for `passwordHash` field
- Apply migration to database
- Regenerate Prisma client with new field

### 3. **Regenerate API Client** (REQUIRED)

After migration is complete:

```bash
cd packages/client
npm run generate
```

This will regenerate the API client with the new `/auth/register` endpoint.

### 4. **Configure Cookie Parser Middleware** (REQUIRED)

✅ **COMPLETE** — PM has created `apps/api/src/main.ts` with cookie-parser middleware configured.

The NestJS bootstrap file has been created with:
- Cookie parser middleware configured
- Server startup configuration
- Port configuration (default: 3001)

**Status:** ✅ **COMPLETE** — Cookie parser middleware configured in `apps/api/src/main.ts`

---

## 📋 Setup Checklist

- [ ] Create `.env` file with `DATABASE_URL` and `JWT_SECRET`
- [ ] Run Prisma migration: `npx prisma migrate dev --name add_password_hash`
- [ ] Regenerate Prisma client: `npx prisma generate`
- [ ] Regenerate API client: `cd packages/client && npm run generate`
- [ ] Configure cookie-parser middleware (if `main.ts` exists)
- [ ] Test login endpoint: `POST /auth/login`
- [ ] Test register endpoint: `POST /auth/register`

---

## 🎯 After Setup

Once all steps are complete:

1. **Test Endpoints** - Verify login/register endpoints work
2. **Verify Cookies** - Check that JWT tokens are set in HttpOnly cookies
3. **Check Audit Logs** - Verify login/register events are logged
4. **Test Rate Limiting** - Verify rate limits are enforced

---

**Status:** ⚠️ **BLOCKED** - Waiting for `.env` configuration and database migration

**Next Action:** Create `.env` file and run migration

