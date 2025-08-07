@echo off
echo Starting all QWANYX services...
echo.

echo Starting QWANYX API on port 5002...
start "QWANYX API" cmd /k "cd qwanyx-api && python app_v2.py"

timeout /t 3 /nobreak > nul

echo Starting Autodin on port 8080...
start "Autodin" cmd /k "cd autodin\frontend && python app_bulma.py"

timeout /t 3 /nobreak > nul

echo Starting Belgicomics on port 8091...
start "Belgicomics" cmd /k "cd belgicomics\frontend && python app_bulma.py"

echo.
echo All services started!
echo.
echo Services running at:
echo - QWANYX API: http://localhost:5002
echo - Autodin: http://localhost:8080
echo - Belgicomics: http://localhost:8091
echo.
pause