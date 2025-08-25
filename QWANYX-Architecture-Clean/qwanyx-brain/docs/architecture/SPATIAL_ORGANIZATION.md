# Spatial Organization - Organisation Concrète de l'Espace 3D

## 🌍 Structure de l'Espace Mental

### Zones Principales (Régions Fixes)

```rust
// L'espace est divisé en régions sémantiques
// Comme les continents sur une planète !

const SPACE_REGIONS: SpaceMap = {
    // ZONE 1 : LANGAGE (-1000 à 0 sur X)
    language: Region {
        bounds: Box3 {
            min: Vec3(-1000.0, -500.0, -500.0),
            max: Vec3(0.0, 500.0, 500.0)
        },
        subzones: {
            chinese: Box3 { min: Vec3(-1000, -500, 0), max: Vec3(-700, 500, 500) },
            english: Box3 { min: Vec3(-700, -500, 0), max: Vec3(-400, 500, 500) },
            french: Box3 { min: Vec3(-400, -500, 0), max: Vec3(-100, 500, 500) },
            emoji: Box3 { min: Vec3(-100, -500, -500), max: Vec3(0, 500, 0) }
        }
    },
    
    // ZONE 2 : PERSONNEL (0 à 1000 sur X)
    personal: Region {
        bounds: Box3 {
            min: Vec3(0.0, -500.0, -500.0),
            max: Vec3(1000.0, 500.0, 500.0)
        },
        subzones: {
            contacts: Box3 { min: Vec3(0, 0, 0), max: Vec3(300, 500, 500) },
            emails: Box3 { min: Vec3(0, -500, 0), max: Vec3(300, 0, 500) },
            calendar: Box3 { min: Vec3(300, 0, 0), max: Vec3(600, 500, 500) },
            tasks: Box3 { min: Vec3(300, -500, 0), max: Vec3(600, 0, 500) },
            notes: Box3 { min: Vec3(600, -500, -500), max: Vec3(1000, 500, 500) }
        }
    },
    
    // ZONE 3 : CONNAISSANCE (sur Y positif > 500)
    knowledge: Region {
        bounds: Box3 {
            min: Vec3(-1000.0, 500.0, -500.0),
            max: Vec3(1000.0, 2000.0, 500.0)
        },
        subzones: {
            science: Box3 { min: Vec3(-1000, 500, 0), max: Vec3(0, 1000, 500) },
            history: Box3 { min: Vec3(0, 500, 0), max: Vec3(1000, 1000, 500) },
            culture: Box3 { min: Vec3(-1000, 1000, 0), max: Vec3(0, 1500, 500) },
            technology: Box3 { min: Vec3(0, 1000, 0), max: Vec3(1000, 1500, 500) }
        }
    },
    
    // ZONE 4 : TEMPOREL (sur Z)
    temporal: Region {
        // Z négatif = Passé
        // Z = 0 = Présent
        // Z positif = Futur
        bounds: Box3 {
            min: Vec3(-1000.0, -500.0, -2000.0),
            max: Vec3(1000.0, 500.0, 2000.0)
        },
        mapping: "Z axis = timeline"
    },
    
    // ZONE 5 : WORKSPACE (Dynamic)
    workspace: Region {
        // Zone de travail temporaire au centre
        bounds: Box3 {
            min: Vec3(-100.0, -100.0, -100.0),
            max: Vec3(100.0, 100.0, 100.0)
        },
        description: "Current focus area"
    }
};
```

## 📍 Placement des Caractères Chinois

```rust
impl ChineseCharacterPlacement {
    fn place_character(c: char) -> Vec3 {
        let unicode = c as u32;
        let radical = get_radical(c);
        let frequency = get_frequency(c);
        
        // Base position dans la zone chinoise
        let base = Vec3::new(
            -1000.0 + (unicode % 300) as f32,  // Distribué sur X
            -500.0 + (radical as f32 * 4.0),   // Radical détermine Y
            0.0                                 // Plan Z=0 pour commencer
        );
        
        // Ajuster selon la fréquence (plus fréquent = plus central)
        let center_pull = Vec3::new(-850.0, 0.0, 250.0);  // Centre de la zone
        let position = base.lerp(center_pull, frequency);
        
        position
    }
    
    fn create_sphere(c: char) -> Sphere {
        Sphere {
            position: place_character(c),
            radius: 1.0 + get_frequency(c) * 5.0,  // Fréquent = plus gros
            id: c as u32,
            properties: CharProperties {
                pinyin: get_pinyin(c),
                meaning: get_meaning(c),
                radical: get_radical(c)
            }
        }
    }
}

// Exemple concret
let sphere_爱 = Sphere {
    position: Vec3(-875.0, 234.0, 180.0),  // Zone chinoise, radical 心
    radius: 4.5,                           // Très fréquent
    id: 0x7231,
    properties: { pinyin: "ai", meaning: "love", radical: '心' }
};
```

## 📧 Ajout Dynamique de Données Personnelles

```rust
impl PersonalDataPlacement {
    // Un nouveau contact
    fn add_contact(contact: Contact) -> Sphere {
        // Trouve une position libre dans la zone contacts
        let base_pos = Vec3::new(
            rand_range(0.0, 300.0),      // Zone contacts X
            rand_range(0.0, 500.0),      // Zone contacts Y  
            0.0                           // Présent
        );
        
        // Si c'est un contact important, le rapprocher du centre
        let importance = contact.interaction_count as f32 / 100.0;
        let center = Vec3::new(150.0, 250.0, 0.0);
        let position = base_pos.lerp(center, importance.min(1.0));
        
        Sphere {
            position,
            radius: 2.0 + importance * 3.0,
            id: hash(contact.email),
            properties: ContactProperties {
                name: contact.name,
                email: contact.email,
                phone: contact.phone,
                last_interaction: contact.last_interaction
            }
        }
    }
    
    // Un nouveau mail
    fn add_email(email: Email) -> Sphere {
        // Position basée sur le temps
        let days_ago = (now() - email.date).days();
        
        let position = Vec3::new(
            rand_range(0.0, 300.0),       // Zone emails X
            rand_range(-500.0, 0.0),      // Zone emails Y (négatif)
            -days_ago as f32 * 10.0       // Z = temps (passé)
        );
        
        // Créer des liens vers l'expéditeur
        let sender_sphere = find_contact(email.from);
        
        Sphere {
            position,
            radius: 1.5,
            id: hash(email.id),
            properties: EmailProperties {
                from: email.from,
                to: email.to,
                subject: email.subject,
                date: email.date
            },
            edges: vec![
                Edge { to: sender_sphere.id, weight: 1.0, type: "from" }
            ]
        }
    }
}
```

## 🔍 Navigation et Recherche

```rust
impl SpatialSearch {
    // Recherche par proximité
    fn search_nearby(position: Vec3, radius: f32) -> Vec<Sphere> {
        octree.query_sphere(position, radius)
    }
    
    // Recherche sémantique dans une zone
    fn search_in_region(query: &str, region: Region) -> Vec<Sphere> {
        // Convertir la query en position approximative
        let target = query_to_position(query);
        
        // Chercher dans la région spécifiée
        octree.query_box(region.bounds)
            .filter(|s| s.distance_to(target) < 100.0)
            .sorted_by_distance(target)
            .take(50)
    }
    
    // Navigation guidée
    fn navigate_to_concept(from: Vec3, concept: &str) -> Path {
        // Trouver la zone du concept
        let target_region = concept_to_region(concept);
        let target_pos = region_center(target_region);
        
        // Calculer le chemin
        Path {
            start: from,
            end: target_pos,
            waypoints: calculate_waypoints(from, target_pos),
            duration: distance(from, target_pos) / CAMERA_SPEED
        }
    }
}
```

## 🎮 Interface Utilisateur Concrète

```rust
struct BrainNavigator {
    camera: Camera,
    current_region: Region,
    selected: Option<Sphere>,
    
    fn update(&mut self, input: Input) {
        // WASD pour bouger
        if input.key_w { self.camera.move_forward(10.0); }
        if input.key_s { self.camera.move_backward(10.0); }
        if input.key_a { self.camera.move_left(10.0); }
        if input.key_d { self.camera.move_right(10.0); }
        
        // Molette pour zoom
        self.camera.fov += input.mouse_wheel * 5.0;
        
        // Clic pour sélectionner
        if input.mouse_click {
            let ray = self.camera.get_ray(input.mouse_x, input.mouse_y);
            self.selected = raycast_spheres(ray);
        }
        
        // Double-clic pour zoomer sur une sphère
        if input.double_click {
            if let Some(sphere) = self.selected {
                self.fly_to_sphere(sphere);
            }
        }
    }
    
    fn render(&self) {
        // Rendre les sphères visibles
        let visible = frustum_cull(self.camera, all_spheres);
        
        for sphere in visible {
            // Couleur selon la région
            let color = match get_region(sphere.position) {
                Region::Language => Color::BLUE,
                Region::Personal => Color::GREEN,
                Region::Knowledge => Color::YELLOW,
                Region::Temporal => Color::PURPLE,
                _ => Color::WHITE
            };
            
            draw_sphere(sphere, color);
        }
        
        // Afficher les infos de la sphère sélectionnée
        if let Some(sphere) = self.selected {
            draw_info_panel(sphere);
        }
    }
}
```

## 💾 Structure de Stockage

```rust
// Fichier binaire simple et efficace
struct BrainFile {
    header: Header {
        version: u32,
        sphere_count: u32,
        edge_count: u32,
        timestamp: u64
    },
    
    // Toutes les sphères (compact)
    spheres: Vec<CompactSphere> {
        position: [f32; 3],  // 12 bytes
        radius: f32,         // 4 bytes
        id: u32,            // 4 bytes
        type: u8,           // 1 byte
        padding: [u8; 3]    // 3 bytes
        // Total: 24 bytes par sphère
    },
    
    // Tous les edges
    edges: Vec<Edge> {
        from: u32,          // 4 bytes
        to: u32,            // 4 bytes
        weight: f32,        // 4 bytes
        type: u32           // 4 bytes
        // Total: 16 bytes par edge
    },
    
    // Métadonnées (JSON compressé)
    metadata: CompressedJson
}

// Pour 1 million de sphères + 10 millions d'edges :
// Sphères: 1M × 24 bytes = 24 MB
// Edges: 10M × 16 bytes = 160 MB
// Total: ~200 MB (sans compression)
// Avec compression LZ4: ~50 MB
```

## 🚀 Prochaines Étapes Concrètes

1. **Implémenter l'octree spatial** en Rust
2. **Charger les caractères chinois** depuis Unihan
3. **Créer le renderer WebGPU** basique
4. **Ajouter la navigation caméra** (WASD + souris)
5. **Implémenter l'ajout de contacts/emails**
6. **Tester avec 100k sphères**

C'est parti pour coder ! 🎯