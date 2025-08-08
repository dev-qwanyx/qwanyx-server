@echo off
cd E:\qwanyxDev\QWANYX-Architecture\qwanyx-api
start python app.py
timeout /t 2
cd E:\qwanyxDev\QWANYX-Architecture\autodin\frontend  
start python app_bulma.py
echo API et Autodin lancés!