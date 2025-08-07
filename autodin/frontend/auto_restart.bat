@echo off
title AUTODIN - Auto Restart
color 0A

:loop
cls
echo ==================================================
echo     AUTODIN - SERVEUR AVEC AUTO-RESTART
echo ==================================================
echo.
echo Le serveur redemarre automatiquement apres
echo chaque modification de fichier!
echo.
echo URL: http://localhost:8090
echo.
echo Fermez cette fenetre pour arreter.
echo ==================================================
echo.

python app_auto_reload.py

echo.
echo [!] Redemarrage en cours...
timeout /t 1 /nobreak > nul

goto loop