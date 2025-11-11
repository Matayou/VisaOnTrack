# Team Setup Instructions — M1-BE-7: Authentication API

**Date:** 2025-01-11  
**Status:** ⚠️ **SETUP REQUIRED** — 2 steps remaining  
**Priority:** HIGH — Blocks testing and QA review

---

## 🎯 Quick Summary

**What's Needed:**
1. Create `.env` file with database credentials (User/DevOps)
2. Run database migration (Backend Engineer)

**Status:** 
- ✅ Code implementation: 100% complete
- ✅ Code reviews: 3/4 complete (Tech Lead ✅, Security Guard ✅, Scope Guardian ✅)
- ⚠️ Setup: 2 steps remaining
- ⏳ QA review: Waiting for setup + tests

---

## 📋 Setup Steps (2 Remaining)

### Step 1: Create .env File (User/DevOps)

**Who:** User or DevOps team  
**Time:** 2 minutes  
**Location:** `apps/api/.env`

**Action:**
1. Navigate to `apps/api/` directory
2. Create a new file named `.env`
3. Add the following content:

```bash
# Database Connection (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/visaontrack"

# JWT Secret (change this in production!)
JWT_SECRET="your-secret-key-change-in-production"
```

**Replace with your actual values:**
- `user` → Your PostgreSQL username
- `password` → Your PostgreSQL password
- `localhost:5432` → Your PostgreSQL host and port
- `visaontrack` → Your database name
- `your-secret-key-change-in-production` → A secure random string (at least 32 characters)

**Example:**
```bash
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/visaontrack"
JWT_SECRET="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
```

**Verification:**
- ✅ File exists at `apps/api/.env`
- ✅ File contains `DATABASE_URL` and `JWT_SECRET`
- ✅ No syntax errors (proper quotes around values)

**Next:** Once complete, notify Backend Engineer to proceed with Step 2.

---

### Step 2: Run Database Migration (Backend Engineer)

**Who:** Backend Engineer  
**Time:** 1-2 minutes  
**Prerequisite:** Step 1 complete (.env file exists)

**Action:**
```bash
# Navigate to API directory
cd apps/api

# Run Prisma migration
npx prisma migrate dev --name add_password_hash

# Regenerate Prisma client
npx prisma generate
```

**What this does:**
- Creates migration file for `passwordHash` field
- Applies migration to database
- Regenerates Prisma client with new field

**Expected Output:**
```
✔ Generated Prisma Client (X.X ms)
✔ Applied migration `add_password_hash`
```

**Verification:**
- ✅ Migration applied successfully
- ✅ Prisma client regenerated
- ✅ No errors in console

**Next:** Setup complete! Ready for testing and QA review.

---

## ✅ Setup Checklist

### Completed ✅
- [x] Dependencies installed (`npm install`)
- [x] API client regenerated (`npm run generate`)
- [x] Cookie parser middleware configured (`apps/api/src/main.ts` created by PM)

### Remaining ⚠️
- [ ] **Step 1:** Create `.env` file with `DATABASE_URL` and `JWT_SECRET` (User/DevOps)
- [ ] **Step 2:** Run Prisma migration (Backend Engineer, after Step 1)

---

## 🚀 After Setup Complete

Once both steps are complete:

1. **Backend Engineer:** Verify endpoints work
   ```bash
   # Start the API server
   cd apps/api
   npm run dev
   ```

2. **Backend Engineer:** Test login/register endpoints
   - Test `POST /auth/login` with valid credentials
   - Test `POST /auth/register` with new user
   - Verify JWT tokens are set in HttpOnly cookies

3. **Backend Engineer:** Implement tests (following M1-BE-8 pattern)
   - Unit tests
   - Integration tests
   - Security tests
   - Contract tests

4. **QA Engineer:** Review tests and implementation
   - Verify all tests pass
   - Verify test coverage meets requirements

5. **PM:** Final approval after QA review

---

## 📞 Coordination

**Current Status:**
- ✅ Implementation: 100% complete
- ✅ Reviews: 3/4 complete (Tech Lead ✅, Security Guard ✅, Scope Guardian ✅)
- ⚠️ Setup: 2 steps remaining
- ⏳ QA: Waiting for setup + tests

**Blockers:**
- ⚠️ Step 1 (`.env` file) blocks Step 2 (migration)
- ⚠️ Setup blocks testing and QA review

**Next Actions:**
1. User/DevOps: Create `.env` file → Notify Backend Engineer
2. Backend Engineer: Run migration → Notify PM
3. Backend Engineer: Implement tests → Notify QA Engineer
4. QA Engineer: Review tests → Notify PM
5. PM: Final approval → Task complete

---

## 📝 Notes

- **Database Connection:** If you don't have PostgreSQL running locally, you may need to:
  - Install PostgreSQL
  - Start PostgreSQL service
  - Create database: `CREATE DATABASE visaontrack;`
  - Or use a cloud database service (AWS RDS, etc.)

- **JWT Secret:** For production, use a cryptographically secure random string generator. For development, any 32+ character string is acceptable.

- **Security:** Never commit `.env` file to Git! It should be in `.gitignore`.

---

**Created:** 2025-01-11  
**Status:** ⚠️ **SETUP IN PROGRESS** — Waiting for .env file creation

