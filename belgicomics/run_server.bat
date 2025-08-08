@echo off
echo Starting Belgicomics Server...
echo ================================

:start
echo.
echo [%TIME%] Starting server...
python frontend\app_bulma.py

echo.
echo [%TIME%] Server stopped or crashed!
echo Restarting in 2 seconds...
timeout /t 2 /nobreak > nul
goto start