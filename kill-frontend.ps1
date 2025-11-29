Write-Host "Stopping frontend server on port 3000..." -ForegroundColor Yellow

# Kill process on port 3000 (frontend)
$process3000 = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if ($process3000) {
    $pid3000 = $process3000.OwningProcess
    Write-Host "Killing process $pid3000 on port 3000" -ForegroundColor Red
    Stop-Process -Id $pid3000 -Force -ErrorAction SilentlyContinue
} else {
    Write-Host "No process found on port 3000" -ForegroundColor Green
}

Write-Host "Frontend server stopped." -ForegroundColor Green
