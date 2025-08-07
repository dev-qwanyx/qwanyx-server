@echo off
echo Starting Personal-Cash with MongoDB...
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

echo MongoDB detected!
echo.

REM Install pymongo if not installed
pip show pymongo >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing pymongo...
    pip install pymongo
)

REM Start the app
echo Starting Personal-Cash app on port 5000...
python app.py