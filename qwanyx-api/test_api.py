import requests
import json

BASE_URL = "http://localhost:5001"

def test_api():
    print("Testing QWANYX API...")
    
    # Test health
    print("\n1. Testing health endpoint...")
    r = requests.get(f"{BASE_URL}/health")
    print(f"Status: {r.status_code}")
    print(f"Response: {r.json()}")
    
    # Test registration
    print("\n2. Testing registration...")
    user_data = {
        "email": "test@autodin.be",
        "password": "test123",
        "name": "Test User"
    }
    r = requests.post(f"{BASE_URL}/auth/register", json=user_data)
    print(f"Status: {r.status_code}")
    if r.status_code == 201:
        data = r.json()
        token = data['access_token']
        print(f"Token received: {token[:20]}...")
        
        # Test authenticated endpoint
        print("\n3. Testing authenticated endpoint...")
        headers = {"Authorization": f"Bearer {token}"}
        r = requests.get(f"{BASE_URL}/auth/me", headers=headers)
        print(f"Status: {r.status_code}")
        print(f"User data: {r.json()}")
        
        # Test app registration
        print("\n4. Testing app registration...")
        r = requests.post(f"{BASE_URL}/apps/register", 
                         json={"app_name": "autodin"}, 
                         headers=headers)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.json()}")

if __name__ == "__main__":
    test_api()