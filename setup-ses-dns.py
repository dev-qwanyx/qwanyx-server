import ovh
import time

# OVH API credentials
application_key = 'ebdafcebb8f0651a'  # This is the short one
application_secret = 'c878ec0750818ae26aae27d080d54455'  # 32 chars
consumer_key = 'dcfd4a716cbd8dbbb63af9682c2b4a2c'  # 32 chars

# Create OVH client
client = ovh.Client(
    endpoint='ovh-eu',
    application_key=application_key,
    application_secret=application_secret,
    consumer_key=consumer_key
)

domain = 'qwanyx.com'

# DNS records to add for AWS SES
records = [
    # Domain verification
    {'subdomain': '_amazonses', 'fieldType': 'TXT', 'target': '63kfRiO/DJtI5TE03Idvf2vG+5HlEYKMPXkBfQAzekk='},
    
    # SES DKIM records
    {'subdomain': 'nh4ptdinjam6in4a3ugre35f4vzs5p27._domainkey', 'fieldType': 'CNAME', 'target': 'nh4ptdinjam6in4a3ugre35f4vzs5p27.dkim.amazonses.com.'},
    {'subdomain': 'jqb5af5ybcbn3unkn4j2xzed5qa7e27h._domainkey', 'fieldType': 'CNAME', 'target': 'jqb5af5ybcbn3unkn4j2xzed5qa7e27h.dkim.amazonses.com.'},
    {'subdomain': 'fqr5gk7td3puuuhy7kp42ptruxrx4gcj._domainkey', 'fieldType': 'CNAME', 'target': 'fqr5gk7td3puuuhy7kp42ptruxrx4gcj.dkim.amazonses.com.'},
]

print(f"Adding DNS records for {domain}...")

for record in records:
    try:
        result = client.post(f'/domain/zone/{domain}/record',
            fieldType=record['fieldType'],
            subDomain=record['subdomain'],
            target=record['target']
        )
        print(f"[OK] Added {record['fieldType']} record: {record['subdomain']}")
    except Exception as e:
        print(f"[ERROR] Error adding {record['subdomain']}: {e}")

# Refresh the DNS zone
try:
    client.post(f'/domain/zone/{domain}/refresh')
    print(f"\n[OK] DNS zone refreshed for {domain}")
    print("DNS records will propagate in 5-10 minutes")
except Exception as e:
    print(f"[ERROR] Error refreshing zone: {e}")