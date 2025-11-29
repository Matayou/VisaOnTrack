@echo off
echo Stopping servers on ports 3000 and 3001...

REM Kill process on port 3000 (frontend)
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do (
    echo Killing process %%a on port 3000
    taskkill /f /pid %%a >nul 2>&1
)

REM Kill process on port 3001 (backend)
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3001" ^| find "LISTENING"') do (
    echo Killing process %%a on port 3001
    taskkill /f /pid %%a >nul 2>&1
)

echo Servers stopped.
pause
