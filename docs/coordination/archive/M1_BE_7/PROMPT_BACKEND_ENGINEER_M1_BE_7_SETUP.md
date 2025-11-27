# Prompt for Backend Engineer: M1-BE-7 Infrastructure Setup

**Copy this prompt and deliver it to the Backend Engineer in a separate chat:**

---

## 🚀 Backend Engineer: Please complete M1-BE-7 Infrastructure Setup

**Task:** Complete infrastructure setup for M1-BE-7 Authentication API Endpoints  
**Status:** ⏳ PENDING - Waiting for database connection details  
**Priority:** 🔴 URGENT

---

## 📋 Context

**Implementation:** ✅ Complete  
**Code Reviews:** ✅ Complete (Tech Lead ✅, Security Guard ✅, Scope Guardian ✅)  
**Blocker:** Infrastructure setup required before tests can be implemented

---

## ⚠️ Required Information

**I need the following information to proceed:**

1. **PostgreSQL Database Connection Details:**
   - Host: `[your_host]` (e.g., `localhost`)
   - Port: `[your_port]` (e.g., `5432`)
   - Database Name: `[your_database]` (e.g., `visaontrack`)
   - Username: `[your_username]` (e.g., `postgres`)
   - Password: `[your_password]` (your actual password)

2. **JWT Secret (Optional):**
   - You can provide a custom JWT secret, or I'll use a default development value

**Please provide the database connection details in this format:**
```
DATABASE_URL="postgresql://username:password@host:port/database_name"
```

---

## 📝 Setup Steps (After You Provide Database Details)

Once you provide the database connection details, I will:

1. ✅ **Create `.env` file** - Create `apps/api/.env` with actual database connection
2. ✅ **Run database migration** - Execute `npx prisma migrate dev --name add_password_hash`
3. ✅ **Regenerate Prisma client** - Run `npx prisma generate`
4. ✅ **Regenerate API client** - Run `cd packages/client && pnpm run generate`
5. ✅ **Verify server startup** - Test that server starts on port 3001
6. ✅ **Basic smoke test** - Verify endpoints respond correctly

---

## 📄 Coordination Document

**Reference:** `docs/coordination/COORDINATION_M1_BE_7_INFRASTRUCTURE_SETUP.md`

This document contains:
- Detailed setup instructions
- Troubleshooting guide
- Verification steps
- Checklist for completion

---

## 🎯 After Setup Complete

Once infrastructure setup is complete, I will:

1. **Implement tests** (following M1-BE-8 pattern)
2. **Notify QA Engineer** when tests are ready
3. **Update coordination documents** with completion status

---

## ❓ Questions?

If you need help with:
- **PostgreSQL installation** - Let me know and I can guide you
- **Database creation** - I can provide SQL commands
- **Connection string format** - I can help format it correctly

**Please provide the database connection details, and I'll handle the rest!**

---

**Status:** ⏳ Waiting for database connection details  
**Created:** 2025-01-11  
**Assigned To:** 🚀 Backend Engineer

