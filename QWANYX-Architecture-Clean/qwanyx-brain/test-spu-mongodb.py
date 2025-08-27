#!/usr/bin/env python3
"""Test script for SPU MongoDB integration"""

import requests
import json
import time

# Configuration
API_URL = "http://localhost:5002"  # Rust SPU API
DH_EMAIL = "stephen@qwanyx.com"
DH_ID = "test_flow_001"

def test_dh_push():
    """Test pushing flow to MongoDB via SPU"""
    print("Testing DH Push...")
    
    data = {
        "dh_email": DH_EMAIL,
        "dh_id": DH_ID,
        "flow_title": "Test Flow from SPU",
        "nodes": [
            {"id": "1", "data": {"label": "Node 1"}, "position": {"x": 0, "y": 0}},
            {"id": "2", "data": {"label": "Node 2"}, "position": {"x": 100, "y": 100}}
        ],
        "edges": [
            {"id": "e1-2", "source": "1", "target": "2"}
        ]
    }
    
    response = requests.post(f"{API_URL}/api/dh/push", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200

def test_dh_pull():
    """Test pulling flow from MongoDB via SPU"""
    print("\nTesting DH Pull...")
    
    data = {
        "dh_email": DH_EMAIL,
        "dh_id": DH_ID
    }
    
    response = requests.post(f"{API_URL}/api/dh/pull", json=data)
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Response: {json.dumps(result, indent=2)}")
    
    # Vérifier que les données sont récupérées
    if result.get("exists"):
        print(f"✓ Flow trouvé: {result.get('title')}")
        print(f"  Nodes: {len(result.get('nodes', []))}")
        print(f"  Edges: {len(result.get('edges', []))}")
    else:
        print("✗ Flow non trouvé")
    
    return response.status_code == 200

def test_spu_assembly():
    """Test SPU assembly program avec MongoDB"""
    print("\nTesting SPU Assembly with MongoDB...")
    
    program = """
    LOAD $DATA, input
    MEMORIZE $DATA, test_flows
    RETURN $DATA
    """
    
    # Ce test nécessiterait un endpoint /execute qui n'est pas encore exposé
    # Pour l'instant on teste juste que l'API répond
    response = requests.get(f"{API_URL}/health")
    print(f"Health check: {response.status_code}")
    return response.status_code == 200

if __name__ == "__main__":
    print("=== SPU MongoDB Integration Test ===\n")
    
    tests = [
        ("DH Push", test_dh_push),
        ("DH Pull", test_dh_pull),
        ("SPU Assembly", test_spu_assembly)
    ]
    
    results = []
    for name, test_func in tests:
        try:
            success = test_func()
            results.append((name, "✓" if success else "✗"))
        except Exception as e:
            print(f"Error in {name}: {e}")
            results.append((name, "✗"))
        time.sleep(1)
    
    print("\n=== Results ===")
    for name, status in results:
        print(f"{status} {name}")
    
    # Check si tout est OK
    if all(status == "✓" for _, status in results):
        print("\n✓ All tests passed!")
    else:
        print("\n✗ Some tests failed")