@echo off
title AUTODIN - Relance Automatique

:debut
cls
echo ============================================
echo    AUTODIN - SERVEUR ULTRA STABLE
echo ============================================
echo.
echo URL: http://localhost:8090
echo.
echo Le serveur redemarre automatiquement
echo si jamais il crash !
echo.
echo Fermez cette fenetre pour arreter.
echo ============================================
echo.

:: Tuer les anciens processus Python
taskkill /F /IM python.exe 2>nul

:: Attendre un peu
timeout /t 2 /nobreak > nul

:: Lancer le serveur
python app_production.py

:: Si on arrive ici, c'est que le serveur s'est arrete
echo.
echo [!] Serveur arrete - Redemarre dans 3 secondes...
timeout /t 3 /nobreak > nul

:: Retourner au debut
goto debut