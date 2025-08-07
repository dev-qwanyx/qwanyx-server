import requests

# Test simple d'envoi d'email
print("Test d'envoi de code par email...")

response = requests.post('http://localhost:5002/auth/request-code', json={
    'email': 'phil@qwanyx.com',  # Ton email
    'site': 'autodin'
})

print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")

if response.status_code == 200:
    print("\nVérifie ton email pour le code!")
else:
    print("\nErreur lors de l'envoi")