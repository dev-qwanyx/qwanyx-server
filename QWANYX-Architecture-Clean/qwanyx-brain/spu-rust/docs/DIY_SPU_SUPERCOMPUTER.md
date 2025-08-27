# 🔧 Guide DIY : Construire son Superordinateur SPU

## 💰 L'Économie du DIY

```rust
pub struct DIYSavings {
    // Serveur pré-construit
    prebuilt: Cost {
        dell_or_hp: 25_000_EUR,
        markup: 40_PERCENT, // Marge constructeur!
        support: "Inclus mais cher",
    },
    
    // DIY (Do It Yourself)
    diy: Cost {
        components: 15_000_EUR,  // Mêmes specs!
        your_time: "2 jours",
        savings: 10_000_EUR,      // 40% économisé!
        satisfaction: INFINITE,    // La fierté de l'avoir fait!
    },
}
```

## 🛒 Liste de Courses Optimisée SPU (Budget 15,000€)

### Configuration "BEAST MODE" 2024

```rust
pub struct SPUBeastBuild {
    // 🎮 GPUs - Le Cœur du Système
    gpu_options: GPUChoice {
        option_a: {
            model: "2× RTX 4090",
            vram: "48GB total",
            price: 3_600_EUR,  // 1800€ × 2
            where: "LDLC, Amazon, Materiel.net",
            why: "Meilleur rapport perf/prix",
        },
        option_b: {
            model: "1× RTX 6000 Ada",
            vram: "48GB",
            price: 7_000_EUR,
            why: "Pro, plus de VRAM, mais cher",
        },
        option_budget: {
            model: "2× RTX 4080 Super",
            vram: "32GB total",
            price: 2_400_EUR,
            why: "Économique mais capable",
        },
    },
    
    // 🧠 CPU - Le Cerveau SPU
    cpu: CPU {
        recommended: "AMD Threadripper 7960X",
        cores: 24,
        threads: 48,
        price: 1_500_EUR,
        alternative: "AMD Ryzen 9 7950X (16c/32t, 700€)",
        why: "Plus de threads = plus de SPUs parallèles",
    },
    
    // 🏠 Motherboard
    motherboard: Motherboard {
        for_threadripper: "ASUS Pro WS TRX50-SAGE",
        price: 900_EUR,
        pcie_slots: 7, // Pour multiple GPUs!
        
        for_ryzen: "ASUS ProArt X670E",
        price: 450_EUR,
    },
    
    // 💾 RAM - Critique pour LLMs
    ram: RAM {
        sweet_spot: "128GB DDR5-5600",
        config: "4×32GB",
        price: 800_EUR,
        brand: "G.Skill, Corsair, Kingston",
        
        overkill: "256GB (8×32GB)",
        price_256: 1_600_EUR,
    },
    
    // 💿 Stockage NVMe
    storage: Storage {
        os_drive: "Samsung 990 Pro 2TB",
        price: 150_EUR,
        
        data_drive: "WD Black SN850X 4TB",
        price: 300_EUR,
        
        model_storage: "2× Crucial P3 Plus 4TB",
        price: 400_EUR,
        why: "LLMs prennent beaucoup de place",
    },
    
    // ⚡ Alimentation - NE PAS NÉGLIGER
    psu: PowerSupply {
        recommended: "Corsair HX1500i",
        wattage: 1500W,
        rating: "80+ Platinum",
        price: 350_EUR,
        why: "2×4090 = 900W, besoin de marge",
    },
    
    // ❄️ Refroidissement
    cooling: Cooling {
        cpu_cooler: "Noctua NH-D15 ou AIO 360mm",
        price: 120_EUR,
        
        case_fans: "6× Noctua NF-A14",
        price: 150_EUR,
        
        gpu_note: "Les 4090 ont leur propre cooling",
    },
    
    // 📦 Boîtier
    case: Case {
        recommended: "Fractal Design Define 7 XL",
        price: 200_EUR,
        why: "Spacieux pour 2 GPUs + bon airflow",
        
        alternative: "Lian Li PC-O11 Dynamic XL",
        price: 220_EUR,
    },
}
```

## 🔧 Guide d'Assemblage Étape par Étape

### Phase 1 : Préparation (30 min)
```rust
pub fn preparation() {
    // Outils nécessaires
    let tools = vec![
        "Tournevis cruciforme magnétique",
        "Pâte thermique (si pas incluse)",
        "Serre-câbles",
        "Bracelet antistatique (optionnel)",
        "Table spacieuse",
        "Bonne lumière",
    ];
    
    // Vérifier tous les composants
    unbox_everything();
    check_compatibility();
    read_motherboard_manual(); // IMPORTANT!
}
```

### Phase 2 : Assemblage CPU/RAM (45 min)
```rust
pub fn install_cpu_ram() {
    // 1. Installer l'alimentation dans le boîtier
    install_psu(cables_face_inside);
    
    // 2. Installer les standoffs dans le boîtier
    screw_in_motherboard_standoffs();
    
    // 3. CPU sur la carte mère (HORS du boîtier)
    open_cpu_socket();
    align_cpu_carefully(); // ATTENTION aux pins!
    close_retention_arm();
    
    // 4. RAM (plus facile maintenant qu'après)
    install_ram_in_slots(vec![2, 4, 6, 8]); // Dual/Quad channel
    
    // 5. Cooler CPU
    apply_thermal_paste(); // Grain de riz!
    mount_cpu_cooler();
}
```

### Phase 3 : Installation Carte Mère (30 min)
```rust
pub fn install_motherboard() {
    // 1. I/O Shield
    snap_io_shield_into_case(); // Appuyer fort!
    
    // 2. Carte mère délicatement
    align_with_io_shield();
    screw_into_standoffs(); // 9 vis généralement
    
    // 3. Connecter alimentation
    connect_24pin_atx(); // Le gros connecteur
    connect_cpu_power(); // 8+4 pins en haut à gauche
}
```

### Phase 4 : GPUs et Stockage (45 min)
```rust
pub fn install_gpus() {
    // 1. NVMe d'abord (sous les GPUs)
    install_nvme_drives(); // Dans les slots M.2
    
    // 2. Première GPU
    remove_pcie_covers(vec![slot_1, slot_2]); // 2 slots par 4090
    insert_gpu_firmly(pcie_x16_slot_1);
    screw_to_case();
    connect_pcie_power(vec!["3×8pin or 16pin"]);
    
    // 3. Deuxième GPU (si applicable)
    leave_space_between_gpus(); // Airflow!
    repeat_process(slot_4); // Pas slot 2!
}
```

### Phase 5 : Câblage et Finition (1h)
```rust
pub fn cable_management() {
    // Connexions essentielles
    connect_sata_drives_if_any();
    connect_front_panel_headers(); // Power, LED, USB
    connect_usb3_headers();
    connect_fans_to_headers();
    
    // Cable management
    route_cables_behind_motherboard_tray();
    use_zip_ties_or_velcro();
    ensure_no_cables_touch_gpu_fans(); // CRITIQUE!
}
```

### Phase 6 : Premier Démarrage 🚀
```rust
pub fn first_boot() -> Result<Success> {
    // Vérifications pré-boot
    double_check_all_connections();
    ensure_ram_clicked_in_fully();
    check_gpu_power_connected();
    
    // Le moment de vérité
    plug_power_cable();
    turn_psu_switch_on();
    press_power_button();
    
    if bios_appears() {
        celebrate(); // 🎉
        
        // Configuration BIOS
        enable_xmp_for_ram();
        check_all_drives_detected();
        set_pcie_to_gen4();
        
        return Ok(Success);
    } else {
        // Pas de panique!
        check_ram_seating();
        try_one_ram_stick();
        clear_cmos();
        retry();
    }
}
```

## 💻 Installation Logicielle pour SPU

### OS et Base
```bash
# Ubuntu Server 22.04 LTS (pas d'interface graphique)
sudo apt update && sudo apt upgrade

# Drivers NVIDIA
sudo apt install nvidia-driver-545
nvidia-smi # Vérifier les GPUs

# Docker pour isolation
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Rust pour le SPU
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Stack SPU
```bash
# Clone le SPU
git clone https://github.com/qwanyx/spu-rust
cd spu-rust

# Build optimisé
cargo build --release

# Lancer le SPU
./target/release/qwanyx-spu

# Votre superordinateur est prêt! 🚀
```

## 📊 Configurations Exemples par Budget

### Config "Étudiant Ambitieux" (5,000€)
```rust
StudentBuild {
    gpu: "1× RTX 4070 Ti Super 16GB" => 900€,
    cpu: "AMD Ryzen 7 7700 (8c/16t)" => 300€,
    ram: "64GB DDR5" => 350€,
    mobo: "B650 board" => 200€,
    storage: "2TB NVMe" => 150€,
    psu: "850W Gold" => 120€,
    case_cooling: 200€,
    
    capability: "Peut faire tourner Llama 13B, parfait pour débuter",
}
```

### Config "Pro Sérieux" (10,000€)
```rust
ProBuild {
    gpu: "1× RTX 4090 24GB" => 1800€,
    cpu: "AMD Ryzen 9 7950X" => 700€,
    ram: "128GB DDR5" => 800€,
    mobo: "X670E board" => 400€,
    storage: "2TB + 4TB NVMe" => 450€,
    psu: "1200W Platinum" => 250€,
    case_cooling: 400€,
    
    capability: "Llama 70B, production-ready",
}
```

### Config "No Limits" (20,000€)
```rust
UltimateBuild {
    gpu: "2× RTX 4090 48GB" => 3600€,
    cpu: "Threadripper 7980X 64-core" => 5000€,
    ram: "256GB DDR5 ECC" => 2000€,
    mobo: "TRX50 workstation" => 1000€,
    storage: "4× 4TB NVMe RAID" => 1600€,
    psu: "1600W Titanium" => 500€,
    cooling: "Custom loop" => 1000€,
    case: "Server chassis" => 500€,
    
    capability: "Multiple LLMs simultanés, training custom",
}
```

## 🚨 Erreurs à Éviter

```rust
pub fn common_mistakes() {
    NEVER {
        forget_motherboard_standoffs; // Court-circuit!
        force_components; // Si ça force, c'est mal aligné
        forget_thermal_paste; // CPU grillé
        cheap_out_on_psu; // JAMAIS économiser sur l'alim
        block_gpu_airflow; // Thermal throttling
        mix_pcie_cables; // Utiliser les câbles fournis!
    }
}
```

## 💡 Tips de Pro

1. **Commander pendant Black Friday** : -30% facile
2. **Acheter GPU d'occasion** : 4090 mining à -40%
3. **Commencer petit** : 1 GPU, ajouter plus tard
4. **Prévoir l'évolution** : Mobo avec 4+ slots PCIe
5. **Surveiller les deals** : r/buildapcsales, Dealabs

## 🎯 Conclusion

**Pour 10-15k€ DIY, vous avez l'équivalent d'un serveur à 30k€ pré-construit !**

- Économie : 40-50%
- Évolutivité : Totale
- Apprentissage : Inestimable
- Satisfaction : Maximale

**En 2 jours, vous passez de zéro à votre propre superordinateur IA. Le futur est entre VOS mains !** 🔧🚀