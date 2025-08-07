import requests
import json
import time

BASE_URL = "http://localhost:5001"

def test_code_auth():
    print("Testing code-based authentication...")
    
    # 1. Request code
    print("\n1. Requesting auth code...")
    r = requests.post(f"{BASE_URL}/auth/request-code", json={
        "email": "demo@autodin.be",
        "site": "autodin"
    })
    print(f"Status: {r.status_code}")
    print(f"Response: {r.json()}")
    
    # 2. Simulate getting code (in production, check email)
    code = input("\nEnter the 6-digit code (check console output): ")
    
    # 3. Verify code
    print("\n3. Verifying code...")
    r = requests.post(f"{BASE_URL}/auth/verify-code", json={
        "email": "demo@autodin.be",
        "code": code,
        "site": "autodin"
    })
    
    if r.status_code == 200:
        data = r.json()
        print(f"Success! Token: {data['access_token'][:20]}...")
        
        # 4. Test authenticated request
        headers = {"Authorization": f"Bearer {data['access_token']}"}
        r = requests.get(f"{BASE_URL}/auth/me", headers=headers)
        print(f"\nUser info: {r.json()}")
    else:
        print(f"Error: {r.json()}")

if __name__ == "__main__":
    test_code_auth()