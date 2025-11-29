@echo off
echo Stopping frontend server on port 3000...

REM Kill process on port 3000 (frontend)
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do (
    echo Killing process %%a on port 3000
    taskkill /f /pid %%a >nul 2>&1
)

echo Frontend server stopped.
pause
