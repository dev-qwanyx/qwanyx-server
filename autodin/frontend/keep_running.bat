@echo off
echo ========================================
echo AUTODIN SERVER - Auto-restart on crash
echo ========================================
echo.

:loop
echo [%date% %time%] Starting Autodin server...
echo Access at: http://localhost:8090
echo.

python app.py

echo.
echo [%date% %time%] Server stopped/crashed!
echo Restarting in 3 seconds...
echo Press Ctrl+C twice to stop completely
echo.

timeout /t 3 /nobreak > nul
goto loop