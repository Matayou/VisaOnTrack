@echo off
echo Restarting frontend server...

REM Kill existing frontend server
call kill-frontend.bat

REM Wait a moment for process to fully terminate
timeout /t 2 /nobreak >nul

echo Starting frontend server...
start "Frontend Server" cmd /c "cd apps/web && pnpm dev"

echo Frontend server starting... Will be available at http://localhost:3000
echo.
echo Press any key to close this window (server will continue running in background)
pause >nul
