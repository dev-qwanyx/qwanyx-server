# QWANYX Startup Script for PowerShell

Write-Host "Starting QWANYX System..." -ForegroundColor Green
Write-Host ""

# Start API Backend
Write-Host "[1/2] Starting API Backend on port 5001..." -ForegroundColor Yellow
$api = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd E:\qwanyxDev\QWANYX-Architecture\qwanyx\backend; python api.py" -PassThru
Start-Sleep -Seconds 2

# Start Frontend
Write-Host "[2/2] Starting Frontend on port 8080..." -ForegroundColor Yellow
$frontend = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd E:\qwanyxDev\QWANYX-Architecture\qwanyx\frontend; python app_bulma.py" -PassThru
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "QWANYX System Started!" -ForegroundColor Green
Write-Host "Dashboard: http://localhost:8080/dashboard" -ForegroundColor Cyan
Write-Host "API: http://localhost:5001/api/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to stop all services..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Stop services
Write-Host "Stopping services..." -ForegroundColor Red
Stop-Process -Id $api.Id -Force -ErrorAction SilentlyContinue
Stop-Process -Id $frontend.Id -Force -ErrorAction SilentlyContinue
Write-Host "Services stopped." -ForegroundColor Yellow