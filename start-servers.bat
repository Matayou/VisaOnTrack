@echo off
echo Starting VisaOnTrack servers...

echo Starting frontend server...
start "Frontend Server" cmd /c "cd apps/web && pnpm dev"

echo Starting backend server...
start "Backend Server" cmd /c "cd apps/api && pnpm dev"

echo Servers starting... Frontend will be available at http://localhost:3000
echo Backend API will be available at http://localhost:3001
echo.
echo Press any key to close this window (servers will continue running in background)
pause >nul
