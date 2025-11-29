Write-Host "Starting frontend server..." -ForegroundColor Cyan

Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd apps/web; pnpm dev" -WindowStyle Normal

Write-Host "Frontend server starting..." -ForegroundColor Green
Write-Host "Will be available at http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to exit this script (server will continue running)" -ForegroundColor Yellow
