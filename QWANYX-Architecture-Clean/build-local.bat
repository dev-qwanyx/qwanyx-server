@echo off
echo ========================================
echo    QWANYX LOCAL BUILD SCRIPT
echo    Building for production deployment
echo ========================================
echo.

REM Build packages first
echo [1/4] Building @qwanyx/ui package...
cd packages\qwanyx-ui
call npm run build
if errorlevel 1 goto :error

echo.
echo [2/4] Building @qwanyx/thot package...
cd ..\qwanyx-thot
call npm run build
if errorlevel 1 goto :error

echo.
echo [3/4] Building @qwanyx/dashboard-v2 package...
cd ..\qwanyx-dashboard-v2
call npm run build
if errorlevel 1 goto :error

echo.
echo [4/4] Building Autodin app for production...
cd ..\..\apps\autodin
call npm run build
if errorlevel 1 goto :error

echo.
echo [5/5] Building Brain Server...
cd ..\..\brain-server
call npm run build
if errorlevel 1 goto :error

cd ..\..
echo.
echo ========================================
echo    BUILD COMPLETE!
echo    Ready to deploy with deploy.bat
echo ========================================
goto :end

:error
echo.
echo ❌ BUILD FAILED! Please fix errors above.
exit /b 1

:end