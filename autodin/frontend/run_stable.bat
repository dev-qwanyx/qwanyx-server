@echo off
echo Starting Autodin in STABLE mode (no auto-restart)
echo Access at: http://localhost:8090
echo.
set FLASK_ENV=production
python -c "from app import app; app.run(host='0.0.0.0', port=8090, debug=False)"