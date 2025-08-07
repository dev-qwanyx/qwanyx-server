@echo off
echo Installing Waitress server if needed...
pip show waitress >nul 2>&1
if %errorlevel% neq 0 (
    pip install waitress
)

echo.
echo Starting Autodin with Waitress (Production Server)
echo Access at: http://localhost:8090
echo This server won't crash on template changes!
echo.
waitress-serve --port=8090 app:app