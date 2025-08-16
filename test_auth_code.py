import requests
import json

# Test registration
print("Testing registration...")
response = requests.post('http://localhost:5002/auth/register', 
    headers={'Content-Type': 'application/json'},
    data=json.dumps({
        'email': 'testcode@test.com',
        'workspace': 'autodin-be',
        'firstName': 'Test',
        'lastName': 'Code'
    })
)

print(f"Registration response: {response.json()}")

# Test login
print("\nTesting login to get code...")
response = requests.post('http://localhost:5002/auth/login', 
    headers={'Content-Type': 'application/json'},
    data=json.dumps({
        'email': 'testcode@test.com',
        'workspace': 'autodin-be'
    })
)

print(f"Login response: {response.json()}")
print("\nCheck the API console output for the AUTH CODE printed there!")
print("The code should be visible in the Python console where app_v2.py is running.")