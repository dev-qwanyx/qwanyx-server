import requests

# Test de base pour vérifier que l'API répond
print("Test de l'API QWANYX...")

# Test 1: Health check
response = requests.get('http://localhost:5001/health')
print(f"\nHealth check - Status: {response.status_code}")
if response.status_code == 200:
    print(f"Response: {response.json()}")
else:
    print(f"Response text: {response.text[:200]}")

# Test 2: Auth endpoint existe
response = requests.post('http://localhost:5001/auth/request-code', 
                        json={'email': 'test@example.com', 'site': 'autodin'})
print(f"\nAuth endpoint - Status: {response.status_code}")
if response.status_code != 404:
    try:
        print(f"Response: {response.json()}")
    except:
        print(f"Response text: {response.text[:200]}")