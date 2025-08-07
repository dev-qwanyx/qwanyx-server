@echo off
echo Starting all QWANYX services with MongoDB...
echo.

echo Starting MongoDB...
start "MongoDB" cmd /k "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "C:\data\db"

echo Waiting for MongoDB to start...
timeout /t 5 /nobreak > nul

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
echo - MongoDB: localhost:27017
echo - QWANYX API: http://localhost:5002
echo - Autodin: http://localhost:8080
echo - Belgicomics: http://localhost:8091
echo.
echo MongoDB databases:
echo - System: qwanyx_system (workspaces, apps)
echo - Autodin: qwanyx_workspace_autodin-be
echo - Belgicomics: qwanyx_workspace_belgicomics
echo.
pause