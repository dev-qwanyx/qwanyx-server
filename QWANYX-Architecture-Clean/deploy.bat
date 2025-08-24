@echo off
echo ========================================
echo    QWANYX DEPLOYMENT SCRIPT
echo    Deploying to 135.181.72.183
echo ========================================
echo.

set SERVER=135.181.72.183
set DEPLOY_PATH=/opt/qwanyx/QWANYX-Architecture-Clean

echo [1/5] Uploading Autodin Next.js build...
scp -r apps/autodin/.next root@%SERVER%:%DEPLOY_PATH%/apps/autodin/
scp -r apps/autodin/public root@%SERVER%:%DEPLOY_PATH%/apps/autodin/
scp apps/autodin/.env.production root@%SERVER%:%DEPLOY_PATH%/apps/autodin/.env.local

echo.
echo [2/5] Uploading Brain Server build...
scp -r brain-server/dist root@%SERVER%:%DEPLOY_PATH%/brain-server/
scp brain-server/.env root@%SERVER%:%DEPLOY_PATH%/brain-server/
scp -r brain-server/src/prompts root@%SERVER%:%DEPLOY_PATH%/brain-server/src/
scp brain-server/src/mail-config.json root@%SERVER%:%DEPLOY_PATH%/brain-server/src/

echo.
echo [3/5] Uploading Python API files...
scp -r api/qwanyx-api/*.py root@%SERVER%:%DEPLOY_PATH%/api/qwanyx-api/

echo.
echo [4/5] Uploading restart script...
scp restart-services.sh root@%SERVER%:%DEPLOY_PATH%/

echo.
echo [5/5] Restarting services on server...
ssh root@%SERVER% "cd %DEPLOY_PATH% && chmod +x restart-services.sh && ./restart-services.sh"

echo.
echo ========================================
echo    DEPLOYMENT COMPLETE!
echo    Check services:
echo    - Autodin: http://135.181.72.183:3002
echo    - API: http://135.181.72.183:5002
echo    - Brain: http://135.181.72.183:3003
echo ========================================