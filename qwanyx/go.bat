@echo off
start python backend\api.py
start python frontend\app_bulma.py
timeout /t 2 > nul
start http://localhost:8080/dashboard