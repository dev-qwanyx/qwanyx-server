@echo off
echo Starting Autodin Website...
echo.

REM Install Flask if not installed
pip show flask >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Flask...
    pip install -r requirements.txt
)

REM Start the app
echo Starting Autodin app on port 8090...
echo Access the site at: http://localhost:8090
echo.
python app.py