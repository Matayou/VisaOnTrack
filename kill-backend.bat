@echo off
echo Stopping backend server on port 3001...

REM Kill process on port 3001 (backend)
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3001" ^| find "LISTENING"') do (
    echo Killing process %%a on port 3001
    taskkill /f /pid %%a >nul 2>&1
)

echo Backend server stopped.
pause
