@echo off
echo ==========================================
echo DEMARRAGE COMPLET ENVIRONNEMENT QWANYX
echo ==========================================

:: Lance MongoDB
echo [1/5] Demarrage MongoDB...
start "MongoDB" cmd /k "mongod"
timeout /t 3 >nul

:: Lance l'API Digital Human Cash (pour sites Vercel)
echo [2/5] Demarrage API Digital Human Cash...
start "API DHC" cmd /k "cd digital-human-cash\database-api && python app.py"

:: Lance l'API QWANYX centrale (quand elle sera créée)
:: echo [3/5] Demarrage API QWANYX...
:: start "API QWANYX" cmd /k "cd qwanyx-api && python app.py"

:: Lance Autodin
echo [3/5] Demarrage Autodin...
start "Autodin" cmd /k "cd autodin\frontend && python app_bulma.py"

:: Lance Personal CASH
echo [4/5] Demarrage Personal CASH...
start "Personal CASH" cmd /k "cd Personal-CASH && python app.py"

:: Lance localtunnel pour l'API (pour sites Vercel)
echo [5/5] Creation tunnel pour API...
timeout /t 3 >nul
start "LocalTunnel API" cmd /k "lt --port 5000"

echo.
echo ==========================================
echo TOUT EST LANCE!
echo ==========================================
echo.
echo MongoDB: localhost:27017
echo API DHC: http://localhost:5000 (+ tunnel public)
echo Autodin: http://localhost:8090
echo Personal CASH: http://localhost:8091
echo.
echo Le tunnel public pour l'API permettra aux sites 
echo Vercel de se connecter à votre API locale
echo.
pause