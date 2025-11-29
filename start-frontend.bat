@echo off
echo Starting frontend server...

echo Starting frontend server...
start "Frontend Server" cmd /c "cd apps/web && pnpm dev"

echo Frontend server starting... Will be available at http://localhost:3000
echo.
echo Press any key to close this window (server will continue running in background)
pause >nul
