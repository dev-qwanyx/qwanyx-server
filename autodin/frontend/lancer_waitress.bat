@echo off
cls
echo ==================================================
echo     AUTODIN - SERVEUR PRODUCTION (WAITRESS)
echo ==================================================
echo.
echo Cette version utilise Waitress (serveur WSGI)
echo Elle ne devrait PAS planter lors des rafraichissements
echo.
echo URL: http://localhost:8090
echo ==================================================
echo.

cd /d E:\qwanyxDev\QWANYX-Architecture\autodin\frontend
python app_waitress.py

pause