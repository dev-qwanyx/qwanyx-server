@echo off
echo ========================================
echo       QWANYX BRAIN SERVER STARTER      
echo ========================================
echo.

REM Kill any existing process on port 3003
echo Cleaning up port 3003...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3003') do (
    taskkill /F /PID %%a 2>nul
)

echo Starting Brain Server...
echo.

REM Use npm run dev which has nodemon for auto-restart
npm run dev

pause