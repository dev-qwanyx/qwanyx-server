@echo off
echo ==========================================
echo DEMARRAGE DES APIS EXISTANTES
echo ==========================================

:: Lance MongoDB
echo [1/3] Demarrage MongoDB...
start "MongoDB" cmd /k "mongod"

:: Attendre que MongoDB démarre
timeout /t 3 >nul

:: Lance l'API Digital Human Cash
echo [2/3] Demarrage API Digital Human Cash...
start "API DHC" cmd /k "cd digital-human-cash\database-api && python app.py"

:: Lance l'API Personal CASH si elle existe
:: echo [3/3] Demarrage API Personal CASH...
:: start "API Personal CASH" cmd /k "cd Personal-CASH && python app.py"

echo.
echo ==========================================
echo APIS LANCEES!
echo ==========================================
echo.
echo MongoDB: localhost:27017
echo API Digital Human Cash: http://localhost:5000
echo.
echo Pour les sites Vercel, assurez-vous que les URLs d'API
echo pointent vers votre IP locale ou utilisez ngrok/localtunnel
echo.
pause