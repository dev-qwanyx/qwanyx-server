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

# Add US-EAST-1 verification TXT record
try:
    # Add US-EAST-1 verification (will coexist with EU-WEST-1)
    # Using different subdomain to avoid conflict
    result = client.post(f'/domain/zone/{domain}/record',
        fieldType='TXT',
        subDomain='_amazonses.us-east-1',
        target='B16t1/INCGI0jrhJt57LsGzbD81QxriItY9Q061BF94='
    )
    print(f"[OK] Added TXT record for US-EAST-1 verification")
    
    # Refresh DNS zone
    client.post(f'/domain/zone/{domain}/refresh')
    print(f"[OK] DNS zone refreshed")
    print("\nDomain will be verified in US-EAST-1 in a few minutes!")
    
except Exception as e:
    print(f"[ERROR] {e}")