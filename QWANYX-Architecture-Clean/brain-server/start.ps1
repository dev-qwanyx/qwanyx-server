#!/usr/bin/env pwsh

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "      QWANYX BRAIN SERVER STARTER      " -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to kill process on port
function Stop-ProcessOnPort {
    param([int]$Port)
    
    Write-Host "🧹 Cleaning up port $Port..." -ForegroundColor Blue
    
    $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($connections) {
        $connections | ForEach-Object {
            $processId = $_.OwningProcess
            if ($processId -ne 0) {
                try {
                    Stop-Process -Id $processId -Force -ErrorAction Stop
                    Write-Host "✅ Killed process $processId on port $Port" -ForegroundColor Green
                } catch {
                    Write-Host "⚠️  Could not kill process $processId" -ForegroundColor Yellow
                }
            }
        }
    } else {
        Write-Host "✅ Port $Port is already free" -ForegroundColor Green
    }
}

# Clean up port 3003
Stop-ProcessOnPort -Port 3003

Write-Host ""
Write-Host "🚀 Starting Brain Server..." -ForegroundColor Magenta
Write-Host "📧 Phil's brain will auto-start" -ForegroundColor Cyan
Write-Host "🤖 AI responses enabled via GPT-5 Nano" -ForegroundColor Cyan
Write-Host "📨 AWS SES email sending active" -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start with npm run dev (has auto-restart)
Write-Host "🧠 Brain Server starting on http://localhost:3003" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Gray
Write-Host ""

npm run dev