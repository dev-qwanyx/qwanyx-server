import ovh

# OVH API credentials
application_key = 'ebdafcebb8f0651a'
application_secret = 'c878ec0750818ae26aae27d080d54455'
consumer_key = 'dcfd4a716cbd8dbbb63af9682c2b4a2c'

# Create OVH client
client = ovh.Client(
    endpoint='ovh-eu',
    application_key=application_key,
    application_secret=application_secret,
    consumer_key=consumer_key
)

domain = 'qwanyx.com'

try:
    # First, get existing _amazonses records
    print("Checking existing _amazonses records...")
    records = client.get(f'/domain/zone/{domain}/record', 
                        fieldType='TXT', 
                        subDomain='_amazonses')
    
    if records:
        print(f"Found {len(records)} existing _amazonses record(s)")
        for record_id in records:
            record_info = client.get(f'/domain/zone/{domain}/record/{record_id}')
            print(f"  - Current value: {record_info['target']}")
    
    # Add the US-EAST-1 verification (it will replace the old one)
    print("\nAdding US-EAST-1 verification record...")
    result = client.post(f'/domain/zone/{domain}/record',
        fieldType='TXT',
        subDomain='_amazonses',
        target='B16t1/INCGI0jrhJt57LsGzbD81QxriItY9Q061BF94='
    )
    print(f"[OK] Added TXT record for US-EAST-1: _amazonses.{domain}")
    
    # Refresh DNS zone
    client.post(f'/domain/zone/{domain}/refresh')
    print("[OK] DNS zone refreshed")
    print("\n✅ Domain verification for US-EAST-1 will complete in 5-10 minutes")
    
except Exception as e:
    print(f"[ERROR] {e}")
    if "granted" in str(e):
        print("\nNeed DELETE permissions in OVH API token to remove old records")
        print("You can manually delete the old _amazonses record in OVH panel")