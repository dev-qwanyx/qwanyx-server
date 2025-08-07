@echo off
:restart
cls
echo Starting Autodin on http://localhost:8090
echo Press Ctrl+C to stop, then Y to restart
echo.
python app.py
echo.
echo Restarting...
timeout /t 2 /nobreak > nul
goto restart