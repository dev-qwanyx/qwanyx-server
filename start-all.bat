@echo off
echo ====================================
echo DEMARRAGE COMPLET LOCAL
echo ====================================
echo.
echo MongoDB est-il demarre? (Sinon, lancez en admin: net start MongoDB)
pause

echo.
echo Nettoyage des anciens processus...
taskkill /F /IM python.exe 2>nul

echo.
echo [1/2] Demarrage API...
start "API" cmd /k "cd /d E:\qwanyxDev\QWANYX-Architecture\qwanyx-api && python app.py"

timeout /t 3 /nobreak

echo [2/2] Demarrage Autodin...  
start "AUTODIN" cmd /k "cd /d E:\qwanyxDev\QWANYX-Architecture\autodin\frontend && python app_bulma.py"

echo.
echo ====================================
echo TOUT EST LANCE!
echo - API: http://localhost:5002
echo - Autodin: http://localhost:8090
echo ====================================
pause