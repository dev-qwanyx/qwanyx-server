@echo off
cls
echo ==================================================
echo     AUTODIN - AVEC NODEMON (AUTO-RELOAD)
echo ==================================================
echo.
echo Installation de nodemon si necessaire...
where nodemon >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Nodemon non trouve. Installation...
    npm install -g nodemon
)
echo.
echo Demarrage du serveur avec auto-reload...
echo URL: http://localhost:8090
echo.
echo Les modifications sont detectees automatiquement!
echo ==================================================
echo.

cd /d E:\qwanyxDev\QWANYX-Architecture\autodin\frontend
nodemon

pause