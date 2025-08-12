# QWANYX File Storage System

## Structure de base

```
/var/uploads/
  └── YYYY/
      └── MM/
          └── DD/
              └── {ObjectId}/
                  └── fichiers...
```

## Principe

- **1 ObjectId = 1 dossier = tous ses fichiers**
- L'ObjectId contient déjà le timestamp (année/mois/jour)
- Pas de collision : noms uniques PAR dossier
- Suppression simple : rm -rf du dossier complet

## Exemples

### Carte avec médias
```
/var/uploads/2024/11/28/6746f3d4.../
  ├── voice.mp3
  ├── image.jpg
  └── document.pdf
```

### Utilisateur
```
/var/uploads/2024/11/28/{userId}/
  ├── avatar.jpg
  └── avatar_thumb.jpg
```

### Annonce voiture
```
/var/uploads/2024/11/28/{annonceId}/
  ├── photo_01.jpg
  ├── photo_02.jpg
  └── certificat.pdf
```

### Email avec pièces jointes
```
/var/uploads/2024/11/28/{emailId}/
  ├── message.eml
  ├── facture.pdf
  └── devis.xlsx
```

### Production (versions)
```
/var/uploads/2024/11/28/{episodeId}/
  ├── storyboard_v1.pdf
  ├── storyboard_v2.pdf
  ├── storyboard_v3_approved.pdf
  └── frame_001_v1.jpg
```

## Code Python

```python
from bson import ObjectId

def get_file_path(object_id, filename):
    oid = ObjectId(object_id)
    date = oid.generation_time
    return f"/var/uploads/{date.year}/{date.month:02d}/{date.day:02d}/{object_id}/{filename}"
```

## Dans MongoDB

Stocker uniquement :
- Le nom du fichier (pas le chemin complet)
- Les métadonnées (taille, type, etc.)
- PAS les données binaires !

```javascript
{
  _id: ObjectId("..."),
  files: ["photo.jpg", "doc.pdf"],
  // ou
  avatar: "avatar.jpg"
}
```

## Avantages

- ✅ Miroir parfait BDD/Fichiers
- ✅ Pas de collision
- ✅ Suppression atomique
- ✅ Organisation chronologique
- ✅ Scalable (millions de fichiers)
- ✅ Recherche instantanée via ObjectId