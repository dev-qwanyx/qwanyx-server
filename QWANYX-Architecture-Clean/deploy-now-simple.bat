@echo off
echo ========================================
echo    SIMPLE DEPLOYMENT - NO BUILD
echo    Just copy source and run dev mode
echo ========================================
echo.

set SERVER=135.181.72.183
set REMOTE_PATH=/opt/qwanyx/QWANYX-Architecture-Clean

echo [1/4] Uploading source code...
echo Uploading apps...
scp -r apps root@%SERVER%:%REMOTE_PATH%/

echo Uploading packages...
scp -r packages root@%SERVER%:%REMOTE_PATH%/

echo Uploading brain-server...
scp -r brain-server root@%SERVER%:%REMOTE_PATH%/

echo Uploading API...
scp -r api root@%SERVER%:%REMOTE_PATH%/

echo.
echo [2/4] Uploading environment files...
scp apps/autodin/.env.production root@%SERVER%:%REMOTE_PATH%/apps/autodin/.env.local

echo.
echo [3/4] Creating startup script on server...
echo Creating restart script...
scp restart-dev-mode.sh root@%SERVER%:%REMOTE_PATH%/

echo.
echo [4/4] Restarting services in dev mode...
ssh root@%SERVER% "cd %REMOTE_PATH% && chmod +x restart-dev-mode.sh && ./restart-dev-mode.sh"

echo.
echo ========================================
echo    DEPLOYMENT COMPLETE!
echo    Running in dev mode on server
echo ========================================