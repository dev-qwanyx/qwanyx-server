import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'frontend'))

from waitress import serve
from frontend.app_bulma import app

print("\n" + "="*50)
print("BELGICOMICS - PRODUCTION SERVER (Waitress)")
print("="*50)
print("URL: http://localhost:8091")
print("Much more stable than Flask dev server!")
print("="*50 + "\n")

serve(app, host='0.0.0.0', port=8091)