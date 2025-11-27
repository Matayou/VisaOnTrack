# PostgreSQL Setup Guide for Development

**Date:** 2025-01-11  
**Purpose:** Set up PostgreSQL database for VisaOnTrack v2 development  
**Platform:** Windows

---

## 🎯 Quick Setup Options

### Option 1: Install PostgreSQL (Recommended for Development)

**Best for:** Long-term development, full PostgreSQL features

### Option 2: Use SQLite (Quick Start, Limited Features)

**Best for:** Quick testing, but **NOT recommended** as schema uses PostgreSQL-specific features

---

## ✅ Option 1: Install PostgreSQL (Recommended)

### Step 1: Download PostgreSQL

1. **Download PostgreSQL for Windows:**
   - Visit: https://www.postgresql.org/download/windows/
   - Or use direct link: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
   - Download PostgreSQL 15 or 16 (latest stable version)

2. **Run Installer:**
   - Run the downloaded `.exe` file
   - Follow the installation wizard

### Step 2: Installation Settings

**Important settings during installation:**

1. **Installation Directory:**
   - Default: `C:\Program Files\PostgreSQL\16` (or version number)
   - Accept default or choose custom location

2. **Data Directory:**
   - Default: `C:\Program Files\PostgreSQL\16\data`
   - Accept default

3. **Password:**
   - **SET A PASSWORD FOR THE `postgres` USER**
   - **Remember this password!** You'll need it for the connection string
   - Example: `postgres123` (use a strong password in production)

4. **Port:**
   - Default: `5432`
   - Accept default

5. **Advanced Options:**
   - Default locale: `[Default locale]`
   - Accept default

6. **Pre Installation Summary:**
   - Review settings
   - Click "Next" to install

7. **Post Installation:**
   - Check "Stack Builder" if you want additional tools (optional)
   - Uncheck if you don't need it
   - Finish installation

### Step 3: Verify Installation

**Open Command Prompt or PowerShell and run:**

```powershell
# Check if PostgreSQL is installed
psql --version

# If not in PATH, add PostgreSQL bin to PATH:
# C:\Program Files\PostgreSQL\16\bin
```

**Or check services:**

```powershell
Get-Service -Name "*postgresql*"
```

### Step 4: Start PostgreSQL Service

**If not running, start the service:**

```powershell
# Start PostgreSQL service
Start-Service postgresql-x64-16
# Or check service name first:
Get-Service -Name "*postgresql*"
```

**Or use Services GUI:**
1. Press `Win + R`
2. Type `services.msc` and press Enter
3. Find "postgresql-x64-16" (or your version)
4. Right-click → Start (if not running)

### Step 5: Create Database

**Option A: Using psql (Command Line)**

1. **Open Command Prompt or PowerShell**
2. **Navigate to PostgreSQL bin directory:**
   ```powershell
   cd "C:\Program Files\PostgreSQL\16\bin"
   ```
3. **Connect to PostgreSQL:**
   ```powershell
   .\psql.exe -U postgres
   ```
4. **Enter password when prompted** (password you set during installation)
5. **Create database:**
   ```sql
   CREATE DATABASE visaontrack;
   ```
6. **Verify database created:**
   ```sql
   \l
   ```
   (You should see `visaontrack` in the list)
7. **Exit:**
   ```sql
   \q
   ```

**Option B: Using pgAdmin (GUI Tool)**

1. **Open pgAdmin** (installed with PostgreSQL)
2. **Connect to server:**
   - Right-click "Servers" → "Register" → "Server"
   - Name: `localhost`
   - Host: `localhost`
   - Port: `5432`
   - Username: `postgres`
   - Password: (password you set during installation)
3. **Create database:**
   - Right-click "Databases" → "Create" → "Database"
   - Name: `visaontrack`
   - Click "Save"

### Step 6: Test Connection

**Test connection string:**

```powershell
# Format: postgresql://username:password@host:port/database
# Example: postgresql://postgres:your_password@localhost:5432/visaontrack
```

**Test with psql:**

```powershell
cd "C:\Program Files\PostgreSQL\16\bin"
.\psql.exe -U postgres -d visaontrack
```

If it connects, you're ready!

---

## ✅ Option 2: Use SQLite (Quick Start - NOT RECOMMENDED)

**⚠️ WARNING:** This requires changing the Prisma schema. The current schema uses PostgreSQL-specific features.

**If you want to use SQLite for quick testing:**

1. **Change Prisma schema:**
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. **Update DATABASE_URL:**
   ```
   DATABASE_URL="file:./dev.db"
   ```

3. **Run migrations:**
   ```bash
   cd apps/api
   npx prisma migrate dev
   ```

**⚠️ This may cause issues with PostgreSQL-specific features. Use only for quick testing.**

---

## 📋 After PostgreSQL is Installed

Once PostgreSQL is installed and the database is created, you'll have:

**Connection Details:**
- **Host:** `localhost`
- **Port:** `5432`
- **Database:** `visaontrack`
- **Username:** `postgres`
- **Password:** (password you set during installation)

**Connection String Format:**
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/visaontrack"
```

**Next Steps:**
1. Provide connection string to Backend Engineer
2. Backend Engineer will create `.env` file
3. Backend Engineer will run migrations
4. Server will start on port 3001

---

## 🚨 Troubleshooting

### Issue: PostgreSQL service won't start

**Solution:**
1. Check if port 5432 is in use:
   ```powershell
   netstat -ano | findstr :5432
   ```
2. If port is in use, either:
   - Stop the conflicting service
   - Change PostgreSQL port (requires config change)

### Issue: psql command not found

**Solution:**
1. Add PostgreSQL bin to PATH:
   - `C:\Program Files\PostgreSQL\16\bin`
2. Or use full path:
   - `"C:\Program Files\PostgreSQL\16\bin\psql.exe"`

### Issue: Authentication failed

**Solution:**
1. Verify password is correct
2. Check `pg_hba.conf` file (usually in `C:\Program Files\PostgreSQL\16\data\`)
3. Ensure local connections are allowed

### Issue: Database connection refused

**Solution:**
1. Verify PostgreSQL service is running:
   ```powershell
   Get-Service -Name "*postgresql*"
   ```
2. Check firewall settings
3. Verify connection string format

---

## 📚 Additional Resources

- **PostgreSQL Documentation:** https://www.postgresql.org/docs/
- **Windows Installation Guide:** https://www.postgresql.org/docs/current/install-windows.html
- **pgAdmin Documentation:** https://www.pgadmin.org/docs/

---

**Created:** 2025-01-11  
**Status:** Ready for user to install PostgreSQL  
**Next Step:** User installs PostgreSQL → User creates database → User provides connection details

