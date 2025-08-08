@echo off
title Belgicomics Server - Auto Restart
echo ========================================
echo BELGICOMICS - SERVEUR AVEC AUTO-RESTART
echo ========================================
echo.

:restart
echo [%date% %time%] Starting Belgicomics server on port 8091...
python run_waitress.py
echo.
echo [%date% %time%] Server stopped. Restarting in 3 seconds...
timeout /t 3 /nobreak >nul
goto restart