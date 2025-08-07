import requests

# Test de vérification du code
print("Test de vérification du code...")

# Vérifie le code reçu
response = requests.post('http://localhost:5002/auth/verify-code', json={
    'email': 'phil@qwanyx.com',
    'code': '518678',
    'site': 'autodin'
})

print(f"Status: {response.status_code}")

if response.status_code == 200:
    data = response.json()
    print(f"\nConnexion réussie!")
    print(f"Token: {data['access_token'][:50]}...")
    print(f"User ID: {data['user']['id']}")
    print(f"Email: {data['user']['email']}")
else:
    print(f"Erreur: {response.json()}")