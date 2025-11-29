@echo off
echo Starting backend server...

echo Starting backend server...
start "Backend Server" cmd /c "cd apps/api && pnpm dev"

echo Backend server starting... Will be available at http://localhost:3001
echo.
echo Press any key to close this window (server will continue running in background)
pause >nul
