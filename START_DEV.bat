@echo off
echo ==========================================
echo DEMARRAGE ENVIRONNEMENT DEV QWANYX
echo ==========================================

:: Lance MongoDB
echo [1/3] Demarrage MongoDB...
start "MongoDB" cmd /k "mongod"

:: Lance l'API QWANYX (quand elle sera créée)
:: echo [2/3] Demarrage API QWANYX...
:: start "API QWANYX" cmd /k "cd qwanyx-api && python app.py"

:: Lance Autodin
echo [2/3] Demarrage Autodin...
start "Autodin" cmd /k "cd autodin\frontend && python app_bulma.py"

:: Lance localtunnel
echo [3/3] Creation tunnel public...
timeout /t 3 >nul
start "LocalTunnel" cmd /k "lt --port 8090"

echo.
echo ==========================================
echo TOUT EST LANCE!
echo ==========================================
echo.
echo Autodin local: http://localhost:8090
echo Tunnel public: Voir fenetre LocalTunnel
echo.
pause