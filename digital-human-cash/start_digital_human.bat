@echo off
echo Starting Digital Human with Personal Cash Management...
echo.

REM Check if MongoDB is running
echo Checking MongoDB on port 27017...
netstat -an | findstr :27017 > nul
if %errorlevel% neq 0 (
    echo ERROR: MongoDB is not running on port 27017
    echo Please start MongoDB first
    pause
    exit /b 1
)

echo MongoDB detected on port 27017
echo.

REM Start the database API in a new window
echo Starting Database API on port 5011...
start "Database API" cmd /k "cd database-api && python app.py"

REM Wait a bit for the API to start
timeout /t 5 /nobreak > nul

REM Start the Digital Human in a new window
echo Starting Digital Human on port 8000...
start "Digital Human" cmd /k "python digital_human.py"

echo.
echo Digital Human system is starting...
echo.
echo Database API: http://localhost:5011
echo Digital Human Interface: http://localhost:8000
echo.
echo Press any key to open the web interface...
pause > nul

REM Open the web interface
start http://localhost:8000

echo.
echo System is running. Close this window to continue...
pause