# M1-BE-7: Infrastructure Setup Coordination

**Task:** M1-BE-7 Infrastructure Setup  
**Assigned To:** 🚀 Backend Engineer  
**Status:** ✅ **COMPLETE**  
**Completed By:** Tech Lead (with user assistance)  
**Date:** 2025-01-11  
**Priority:** 🔴 URGENT → ✅ COMPLETE

---

## 📋 Overview

**Purpose:** Complete infrastructure setup for M1-BE-7 Authentication API Endpoints  
**Context:** Implementation is complete, code reviews are done (Tech Lead, Security Guard, Scope Guardian all approved).  
**Blocker:** Infrastructure setup required before tests can be implemented and server can run.

---

## ✅ Prerequisites (Already Complete)

1. ✅ **Code Implementation** - All login/register endpoints implemented
2. ✅ **Dependencies Installed** - `pnpm install` completed
3. ✅ **OpenAPI Spec Updated** - Register endpoint added (v0.2.2)
4. ✅ **Code Reviews Complete** - Tech Lead ✅, Security Guard ✅, Scope Guardian ✅
5. ✅ **Cookie Parser Configured** - `apps/api/src/main.ts` created with cookie-parser middleware

---

## ⚠️ Required Information from User

**Backend Engineer needs the following information to proceed:**

### 1. Database Connection Details

User needs to provide:
- **PostgreSQL host** (e.g., `localhost` or server IP)
- **PostgreSQL port** (default: `5432`)
- **Database name** (e.g., `visaontrack`)
- **Database username** (e.g., `postgres`)
- **Database password** (user's actual password)

**Format:** `postgresql://username:password@host:port/database_name`

### 2. JWT Secret (Optional)

User can provide a custom JWT secret, or Backend Engineer can use a default development value.

---

## 📝 Setup Steps (Backend Engineer)

### Step 1: Create `.env` File

**Location:** `apps/api/.env`

**Content Template:**
```bash
DATABASE_URL="postgresql://[USERNAME]:[PASSWORD]@[HOST]:[PORT]/[DATABASE_NAME]"
JWT_SECRET="your-secret-key-change-in-production"
NODE_ENV="development"
PORT=3001
```

**Action:**
1. Wait for user to provide database connection details
2. Create `apps/api/.env` file with actual connection string
3. Set `JWT_SECRET` (use development value if user doesn't provide one)
4. Verify file is created and not committed to git (should be in `.gitignore`)

**Note:** The `.env` file was temporarily created with placeholder values. Replace with actual values.

---

### Step 2: Run Database Migration

**Command:**
```bash
cd apps/api
npx prisma migrate dev --name add_password_hash
npx prisma generate
```

**Expected Result:**
- Migration file created in `apps/api/prisma/migrations/`
- Migration applied to database
- Prisma client regenerated with `passwordHash` field

**Verification:**
- Check that `User` model in database has `passwordHash` field
- Verify Prisma client types are updated

---

### Step 3: Regenerate API Client

**Command:**
```bash
cd packages/client
pnpm run generate
```

**Expected Result:**
- API client regenerated with `/auth/register` endpoint
- TypeScript types updated

**Verification:**
- Check that `packages/client` has updated types
- Verify `POST /auth/register` is available in generated client

---

### Step 4: Verify Server Startup

**Command:**
```bash
cd apps/api
pnpm dev
```

**Expected Result:**
- Server starts on port 3001 (or PORT from .env)
- No database connection errors
- Console message: `🚀 API server running on http://localhost:3001`

**Verification:**
- Check server logs for errors
- Verify server responds to health check (if available)
- Test that database connection is working

---

### Step 5: Basic Smoke Test

**Test Login Endpoint:**
```bash
# Test with curl or Postman
POST http://localhost:3001/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!@#"
}
```

**Expected Result:**
- Server responds (may be 401 if user doesn't exist, which is expected)
- No server errors
- Cookie is set (check response headers)

---

## 📋 Checklist

- [x] ✅ Step 1: `.env` file created with actual database connection
- [x] ✅ Step 2: Database migration completed successfully
- [x] ✅ Step 3: Prisma client regenerated
- [x] ✅ Step 4: API client regenerated
- [x] ✅ Step 5: Server starts without errors
- [x] ✅ Step 6: Both servers running (Frontend: 3000, Backend: 3001)

---

## 🚨 Troubleshooting

### Issue: Database Connection Error

**Symptoms:** Server fails to start with database connection error  
**Solutions:**
1. Verify PostgreSQL is running
2. Check database credentials in `.env`
3. Verify database exists: `psql -U username -d database_name`
4. Check firewall/network settings

### Issue: Migration Fails

**Symptoms:** `npx prisma migrate dev` fails  
**Solutions:**
1. Verify database connection works
2. Check if database is empty (fresh start) or has existing schema
3. If existing schema, may need to run `npx prisma migrate reset` (⚠️ WARNING: This deletes all data)
4. Check Prisma schema for syntax errors

### Issue: Server Starts but Endpoints Fail

**Symptoms:** Server runs but API calls fail  
**Solutions:**
1. Check CORS configuration in `apps/api/src/main.ts`
2. Verify cookie-parser middleware is configured
3. Check server logs for specific errors
4. Verify JWT_SECRET is set

---

## 📊 Status Tracking

**Current Status:** ✅ **COMPLETE** - Infrastructure setup completed successfully

**Completed Steps:**
1. ✅ PostgreSQL 16 installed via winget
2. ✅ Database `visaontrack` created
3. ✅ `.env` file created with database connection
4. ✅ Prisma migrations applied (`init_schema`)
5. ✅ Prisma client regenerated
6. ✅ API client regenerated
7. ✅ TypeScript configuration fixed (decorators enabled)
8. ✅ Both servers running (Frontend: port 3000, Backend: port 3001)

**Next Steps:**
1. Backend Engineer: Implement tests for M1-BE-7 (can now proceed)
2. QA Engineer: Review tests after implementation

---

## 📝 Notes

- **User Assistance:** User can help by copying database connection details from their existing setup or PostgreSQL configuration
- **Development Environment:** This setup is for development. Production setup will be different
- **Security:** Never commit `.env` file to git. Verify `.gitignore` includes `.env`
- **Database:** Ensure PostgreSQL is installed and running before starting setup

---

## 🎯 After Setup Complete

Once infrastructure setup is complete:

1. **Backend Engineer:** Implement tests (following M1-BE-8 pattern)
2. **QA Engineer:** Review tests when Backend Engineer completes
3. **PM:** Provide final approval after all reviews complete

---

**Created:** 2025-01-11  
**Completed:** 2025-01-11  
**Assigned To:** 🚀 Backend Engineer  
**Completed By:** Tech Lead (with user assistance)  
**Status:** ✅ **COMPLETE** - Infrastructure setup complete, both servers running

