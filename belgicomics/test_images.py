import requests
import time

# Liste des URLs d'images à tester
image_urls = [
    'https://qwanyx-storage-images.s3.eu-central-1.amazonaws.com/LAUDY/LAUDY/LAUDY-M1.jpg',
    'https://qwanyx-storage-images.s3.eu-central-1.amazonaws.com/IMAGES/upload/null/node_67ebe8db6cb97f494e4aa33a/Abdel-A.jpg',
    'https://qwanyx-storage-images.s3.eu-central-1.amazonaws.com/IMAGES/upload/null/node_67cdb07a0ad953656e0079ec/Mystère A.jpg',
    'https://qwanyx-storage-images.s3.eu-central-1.amazonaws.com/IMAGES/upload/null/node_679b50ec6cb67f03b497c7d3/B.jpeg',
    'https://qwanyx-storage-images.s3.eu-central-1.amazonaws.com/IMAGES/upload/null/node_670e3cdbe77b2a08c3080a21/FranquinA.jpg',
    'https://qwanyx-storage-images.s3.eu-central-1.amazonaws.com/IMAGES/upload/null/node_670e3d58e77b2a08c3080aa5/DavidWautierA.jpg',
    'https://qwanyx-storage-images.s3.eu-central-1.amazonaws.com/IMAGES/upload/64c9164919bd6f8d1f1feb6c/node_6703a3b13dab69e8e25caaeb/ImageMystèreJannin.jpg',
    'https://qwanyx-storage-images.s3.eu-central-1.amazonaws.com/IMAGES/upload/null/node_66fd13c18ef53105a07b1f69/ChrisLamquetImageMistere.jpg',
    'https://qwanyx-storage-images.s3.eu-central-1.amazonaws.com/IMAGES/upload/null/node_66ec298b29ccff97aef34e31/ThumbNail.jpg',
    'https://qwanyx-storage-images.s3.eu-central-1.amazonaws.com/IMAGES/upload/645b5e00c7b61df466430901/node_65fe2a2c6a8b68f837ceb351/ANJO-MIST.png',
    'https://qwanyx-storage-images.s3.eu-central-1.amazonaws.com/IMAGES/upload/64c9164919bd6f8d1f1feb6c/node_65ea0fcccd992518e449392d/(_1) Alma-Mater-case 2.jpeg',
    'https://qwanyx-storage-images.s3.eu-central-1.amazonaws.com/IMAGES/upload/null/node_6652f089619bbe427a719c64/WhatsApp Image 2024-05-26 à 10.06.46_0388554d.jpg',
    'https://qwanyx-storage-images.s3.eu-central-1.amazonaws.com/IMAGES/upload/null/node_665302cd771468deccfe2fd1/Devos mystère NEW1 copie.jpg',
    'https://qwanyx-storage-images.s3.eu-central-1.amazonaws.com/IMAGES/upload/null/node_6653144049a4eb0366458d76/WhatsApp Image 2024-05-26 à 11.59.57_5f8ac13d.jpg',
    'https://qwanyx-storage-images.s3.eu-central-1.amazonaws.com/IMAGES/upload/null/node_665312ccd27bda0be6118d9f/WhatsApp Image 2024-05-26 à 12.03.33_484dc233.jpg',
    'https://qwanyx-storage-images.s3.eu-central-1.amazonaws.com/IMAGES/upload/null/node_665ebcd43974eccb5b75811d/WhatsApp Image 2024-06-02 à 09.47.41_3913926e.jpg',
    'https://qwanyx-storage-images.s3.eu-central-1.amazonaws.com/IMAGES/upload/null/node_6682e3f6ff2ab68d163e0f8c/Greg Shaw Mistère A.jpg',
    'https://qwanyx-storage-images.s3.eu-central-1.amazonaws.com/IMAGES/upload/null/node_66b0e17770083f3e385e283c/Duval-Thumbnail.jpg',
    'https://qwanyx-storage-images.s3.eu-central-1.amazonaws.com/IMAGES/upload/null/node_66ced596e0fec37d8408944a/A.jpg'
]

print("Test des images mysteres Belgicomics")
print("=" * 50)

working_urls = []
broken_urls = []

for i, url in enumerate(image_urls, 1):
    # Extraire le nom du fichier
    filename = url.split('/')[-1]
    print(f"\n{i}. Test de: {filename}")
    
    try:
        # Faire une requête HEAD pour vérifier si l'image existe
        response = requests.head(url, timeout=5)
        
        if response.status_code == 200:
            print(f"   [OK] - Image accessible")
            working_urls.append(url)
        elif response.status_code == 403:
            print(f"   [ERREUR 403] - Acces interdit")
            broken_urls.append((url, filename, "403 Forbidden"))
        elif response.status_code == 404:
            print(f"   [ERREUR 404] - Image introuvable")
            broken_urls.append((url, filename, "404 Not Found"))
        else:
            print(f"   [ERREUR {response.status_code}]")
            broken_urls.append((url, filename, f"Error {response.status_code}"))
            
    except requests.exceptions.Timeout:
        print(f"   [TIMEOUT] - Pas de reponse")
        broken_urls.append((url, filename, "Timeout"))
    except Exception as e:
        print(f"   [ERREUR]: {str(e)}")
        broken_urls.append((url, filename, str(e)))
    
    # Petit délai pour ne pas surcharger le serveur
    time.sleep(0.2)

print("\n" + "=" * 50)
print("RESUME")
print("=" * 50)
print(f"Images fonctionnelles: {len(working_urls)}/{len(image_urls)}")
print(f"Images avec problèmes: {len(broken_urls)}/{len(image_urls)}")

if broken_urls:
    print("\n" + "=" * 50)
    print("IMAGES A SUPPRIMER:")
    print("=" * 50)
    for url, filename, error in broken_urls:
        print(f"- {filename} ({error})")
        print(f"  URL: {url}")

if working_urls:
    print("\n" + "=" * 50)
    print("URLS FONCTIONNELLES (pour copier-coller):")
    print("=" * 50)
    for url in working_urls:
        print(f"                '{url}',")