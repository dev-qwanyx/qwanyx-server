@echo off
echo ====================================
echo DEMARRAGE DES SERVICES LOCAUX
echo ====================================

echo.
echo [1/2] Demarrage de l'API QWANYX...
start "API QWANYX" cmd /k "cd qwanyx-api && python app.py"

timeout /t 2 /nobreak > nul

echo [2/2] Demarrage d'Autodin...
start "AUTODIN" cmd /k "cd autodin\frontend && python app_bulma.py"

echo.
echo ====================================
echo Services demarres:
echo - API: http://localhost:5002
echo - Autodin: http://localhost:8090
echo ====================================
echo.
pause