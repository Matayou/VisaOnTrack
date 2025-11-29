Write-Host "Restarting VisaOnTrack servers..." -ForegroundColor Yellow

# Run the kill script
& ".\kill-servers.ps1"

# Wait a moment for processes to fully terminate
Start-Sleep -Seconds 2

Write-Host "Starting frontend server..." -ForegroundColor Cyan
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd apps/web; pnpm dev" -WindowStyle Normal

Write-Host "Starting backend server..." -ForegroundColor Cyan
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd apps/api; pnpm dev" -WindowStyle Normal

Write-Host "Servers starting..." -ForegroundColor Green
Write-Host "Frontend will be available at http://localhost:3000" -ForegroundColor Green
Write-Host "Backend API will be available at http://localhost:3001" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to exit this script (servers will continue running)" -ForegroundColor Yellow
