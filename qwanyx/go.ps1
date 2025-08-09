Start-Process python -ArgumentList "E:\qwanyxDev\QWANYX-Architecture\qwanyx\backend\api.py"
Start-Process python -ArgumentList "E:\qwanyxDev\QWANYX-Architecture\qwanyx\frontend\app_bulma.py"
Start-Sleep 2
Start-Process "http://localhost:8080/dashboard"