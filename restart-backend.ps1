Write-Host "Restarting backend server..." -ForegroundColor Yellow

# Run the kill script
& ".\kill-backend.ps1"

# Wait a moment for process to fully terminate
Start-Sleep -Seconds 2

Write-Host "Starting backend server..." -ForegroundColor Cyan
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd apps/api; pnpm dev" -WindowStyle Normal

Write-Host "Backend server starting..." -ForegroundColor Green
Write-Host "Will be available at http://localhost:3001" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to exit this script (server will continue running)" -ForegroundColor Yellow
