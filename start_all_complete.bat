@echo off
echo ============================================================
echo QWANYX Multi-Workspace Architecture - Complete Startup
echo ============================================================
echo.

:: Check if MongoDB is already running
echo Checking MongoDB status...
netstat -an | findstr :27017 | findstr LISTENING >nul
if %errorlevel% == 0 (
    echo MongoDB is already running on port 27017
) else (
    echo Starting MongoDB...
    
    :: Try common MongoDB paths
    if exist "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" (
        start "MongoDB" cmd /k ""C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "C:\data\db""
    ) else if exist "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" (
        start "MongoDB" cmd /k ""C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath "C:\data\db""
    ) else if exist "C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe" (
        start "MongoDB" cmd /k ""C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe" --dbpath "C:\data\db""
    ) else (
        echo.
        echo WARNING: MongoDB not found in standard locations!
        echo Please start MongoDB manually before continuing.
        echo Expected locations:
        echo - C:\Program Files\MongoDB\Server\X.X\bin\mongod.exe
        echo.
        pause
    )
    
    echo Waiting for MongoDB to start...
    timeout /t 5 /nobreak > nul
)

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
echo ============================================================
echo All services started successfully!
echo ============================================================
echo.
echo Services running at:
echo.
echo DATABASE:
echo - MongoDB: mongodb://localhost:27017
echo   - System DB: qwanyx_system
echo   - Autodin DB: qwanyx_workspace_autodin-be  
echo   - Belgicomics DB: qwanyx_workspace_belgicomics
echo.
echo API:
echo - QWANYX API: http://localhost:5002
echo   - Health check: http://localhost:5002/health
echo.
echo FRONTENDS:
echo - Autodin: http://localhost:8080
echo   - Auto parts marketplace
echo   - Workspace: autodin-be
echo.
echo - Belgicomics: http://localhost:8091
echo   - Comic book store
echo   - Workspace: belgicomics
echo.
echo ============================================================
echo.
echo Press any key to open all sites in your browser...
pause >nul

:: Open all sites in default browser
start http://localhost:5002/health
start http://localhost:8080
start http://localhost:8091

echo.
echo Sites opened in browser. This window can be closed.
echo To stop all services, close their respective windows.
echo.
pause