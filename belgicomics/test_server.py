#!/usr/bin/env python3
import requests
import time

print("Testing Belgicomics server...")

# Wait a bit for server to start
time.sleep(2)

try:
    response = requests.get("http://localhost:8091/", timeout=5)
    print(f"Status: {response.status_code}")
    
    # Check for key indicators
    content = response.text
    
    if "Belgicomics" in content:
        print("✓ Found 'Belgicomics' in content")
    else:
        print("✗ 'Belgicomics' NOT found in content")
        
    if "Autodin" in content:
        print("✗ WARNING: Found 'Autodin' in content - template not updated!")
        # Find first occurrence
        idx = content.find("Autodin")
        snippet = content[max(0, idx-50):idx+50]
        print(f"Context: ...{snippet}...")
    else:
        print("✓ No 'Autodin' found - good!")
        
    # Check title specifically
    import re
    title_match = re.search(r'<title>(.*?)</title>', content)
    if title_match:
        print(f"Page title: {title_match.group(1)}")
        
except Exception as e:
    print(f"Error: {e}")
    print("Make sure Belgicomics server is running on port 8091")