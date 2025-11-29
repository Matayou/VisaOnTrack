# VisaOnTrack Server Scripts

Quick scripts to manage the frontend (port 3000) and backend (port 3001) servers individually or together.

## Available Scripts

### Both Servers (Windows Batch)

**`start-servers.bat`** - Start both frontend and backend servers
- Opens separate command windows for each server
- Frontend: http://localhost:3000, Backend: http://localhost:3001

**`kill-servers.bat`** - Stop both servers (ports 3000 and 3001)
- Kills any processes listening on these ports
- Safe to run even if servers aren't running

**`restart-servers.bat`** - Kill both servers and restart them fresh
- Combines kill and start functionality for both servers

### Individual Server Control (Windows Batch)

#### Frontend (Port 3000)
- **`kill-frontend.bat`** - Stop only the frontend server
- **`start-frontend.bat`** - Start only the frontend server
- **`restart-frontend.bat`** - Kill and restart only the frontend server

#### Backend (Port 3001)
- **`kill-backend.bat`** - Stop only the backend server
- **`start-backend.bat`** - Start only the backend server
- **`restart-backend.bat`** - Kill and restart only the backend server

### PowerShell Scripts (.ps1)

#### Both Servers
- **`kill-servers.ps1`** - Stop both servers (more reliable process detection)
- **`restart-servers.ps1`** - Kill and restart both servers with colored output

#### Individual Servers
- **`kill-frontend.ps1`** / **`kill-backend.ps1`** - Stop individual servers
- **`start-frontend.ps1`** / **`start-backend.ps1`** - Start individual servers
- **`restart-frontend.ps1`** / **`restart-backend.ps1`** - Restart individual servers

## Usage Examples

### Quick Start (Both Servers)
Double-click `restart-servers.bat` to kill any running servers and start fresh ones.

### Individual Server Control
```batch
# Restart only frontend
restart-frontend.bat

# Kill only backend
kill-backend.bat

# Start only frontend
start-frontend.bat
```

### PowerShell Usage
```powershell
# Restart only backend
.\restart-backend.ps1

# Kill only frontend
.\kill-frontend.ps1

# Start only backend
.\start-backend.ps1
```

## Server Details

- **Frontend (Next.js)**: `apps/web` → http://localhost:3000
- **Backend (NestJS)**: `apps/api` → http://localhost:3001

## Troubleshooting

If servers don't start:
1. Check that pnpm is installed: `pnpm --version`
2. Install dependencies: `pnpm install`
3. Try running individually:
   - Frontend: `cd apps/web && pnpm dev`
   - Backend: `cd apps/api && pnpm dev`

If ports are still in use after killing:
- Wait a few seconds and try again
- Or run the kill script twice
- Check Task Manager for any remaining node processes

## Common Scenarios

- **Working on frontend only**: Use `restart-frontend.bat` to restart just the UI
- **API changes**: Use `restart-backend.bat` to restart just the backend
- **Fresh start**: Use `restart-servers.bat` to restart everything
- **Clean shutdown**: Use `kill-servers.bat` to stop all servers
