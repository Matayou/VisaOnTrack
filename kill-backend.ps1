Write-Host "Stopping backend server on port 3001..." -ForegroundColor Yellow

# Kill process on port 3001 (backend)
$process3001 = Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue
if ($process3001) {
    $pid3001 = $process3001.OwningProcess
    Write-Host "Killing process $pid3001 on port 3001" -ForegroundColor Red
    Stop-Process -Id $pid3001 -Force -ErrorAction SilentlyContinue
} else {
    Write-Host "No process found on port 3001" -ForegroundColor Green
}

Write-Host "Backend server stopped." -ForegroundColor Green
