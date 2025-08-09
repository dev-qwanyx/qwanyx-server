@echo off
echo Starting QWANYX System...
echo.

echo [1/3] Starting MongoDB (ensure MongoDB is running)...
echo Please make sure MongoDB is running on localhost:27017
echo.

echo [2/3] Starting QWANYX API Backend...
start "QWANYX API" cmd /k "cd backend && python api.py"
timeout /t 3 /nobreak > nul

echo [3/3] Starting QWANYX Frontend...
cd frontend
python app_bulma.py

echo.
echo QWANYX System is running!
echo API: http://localhost:5001
echo Dashboard: http://localhost:8080
pause