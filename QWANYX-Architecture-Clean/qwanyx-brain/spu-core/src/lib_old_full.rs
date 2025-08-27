//! SPU Core - Semantic Processing Unit
//! 
//! Un processeur sémantique révolutionnaire qui traite les concepts
//! comme un CPU traite les bits. Architecture RISC élégante et puissante.

mod coprocessor;
pub use coprocessor::*;

// ================================================================================
// ARCHITECTURE DES REGISTRES
// ================================================================================

/// Registres sémantiques du SPU (16 registres généraux + registres spéciaux)
#[derive(Debug, Clone, Copy, PartialEq)]
#[repr(u8)]
pub enum Register {
    // Registres généraux (R0-R15)
    R0 = 0, R1 = 1, R2 = 2, R3 = 3, R4 = 4, R5 = 5, R6 = 6, R7 = 7,
    R8 = 8, R9 = 9, R10 = 10, R11 = 11, R12 = 12, R13 = 13, R14 = 14, R15 = 15,
    
    // Registres spéciaux
    PC,     // Program Counter
    SP,     // Stack Pointer
    BP,     // Base Pointer
    FLAGS,  // Status flags
    ACC,    // Accumulator (pour opérations complexes)
    IDX,    // Index (pour navigation spatiale)
    VEC,    // Vector (position 3D dans l'espace sémantique)
}

// ================================================================================
// TYPES DE BASE
// ================================================================================

/// Concept sémantique (unité de base du SPU)
#[derive(Debug, Clone, PartialEq)]
pub struct Concept {
    /// Identifiant unique (BSON ObjectId format)
    pub id: [u8; 12],
    /// Type de concept
    pub concept_type: ConceptType,
    /// Force sémantique (0.0 = faible, 1.0 = fort)
    pub strength: f32,
    /// Données du concept
    pub data: ConceptData,
    /// Connexions à d'autres concepts
    pub links: Vec<[u8; 12]>,
}

/// Type de concept
#[derive(Debug, Clone, PartialEq)]
pub enum ConceptType {
    Text,
    Email,
    Document,
    Memory,
    Number,
    Boolean,
    Empty,
}

/// Données du concept
#[derive(Debug, Clone, PartialEq)]
pub enum ConceptData {
    Text(String),
    Number(f64),
    Boolean(bool),
    Binary(Vec<u8>),
    Empty,
}

/// Adresse mémoire sémantique
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Address(pub u32);

/// Coordonnées 3D dans l'espace sémantique
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Coordinates {
    pub x: f32,
    pub y: f32,
    pub z: f32,
}

/// Direction de navigation
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Direction {
    Up, Down, Left, Right, Forward, Backward,
    // Directions diagonales
    UpLeft, UpRight, DownLeft, DownRight,
    // Directions composées
    ForwardUp, ForwardDown, BackwardUp, BackwardDown,
}

// ================================================================================
// JEU D'INSTRUCTIONS SPU - ARCHITECTURE RISC SÉMANTIQUE
// ================================================================================

#[derive(Debug, Clone, PartialEq)]
pub enum Instruction {
    // ============================================================================
    // TRANSFERT DE DONNÉES
    // ============================================================================
    
    /// Charge un concept depuis la mémoire vers un registre
    LOAD { dest: Register, addr: Address },
    
    /// Stocke un concept depuis un registre vers la mémoire
    STORE { src: Register, addr: Address },
    
    /// Copie directe registre à registre
    MOVE { dest: Register, src: Register },
    
    /// Charge une constante conceptuelle
    LOADI { dest: Register, concept: Concept },
    
    /// Échange deux registres (atomique)
    SWAP { r1: Register, r2: Register },
    
    // ============================================================================
    // NAVIGATION SPATIALE
    // ============================================================================
    
    /// Navigation relative dans l'espace sémantique
    NAV { direction: Direction, distance: f32 },
    
    /// Saut absolu à des coordonnées
    JUMP { coords: Coordinates },
    
    /// Orbite autour d'un concept (pour exploration)
    ORBIT { center: Register, radius: f32, angle: f32 },
    
    /// Raycasting vers un concept (retourne distance)
    RAY { from: Register, to: Register, result: Register },
    
    /// Téléportation instantanée vers un concept
    WARP { target: Register },
    
    // ============================================================================
    // OPÉRATIONS SÉMANTIQUES
    // ============================================================================
    
    /// Fusion de deux concepts (création d'un nouveau)
    MERGE { dest: Register, src1: Register, src2: Register },
    
    /// Division d'un concept en deux
    SPLIT { src: Register, dest1: Register, dest2: Register },
    
    /// Mutation d'un concept (modification)
    MUTATE { target: Register, factor: f32 },
    
    /// Amplification de la force sémantique
    AMPLIFY { target: Register, gain: f32 },
    
    /// Atténuation de la force sémantique
    DAMPEN { target: Register, loss: f32 },
    
    // ============================================================================
    // COMPARAISONS ET TESTS
    // ============================================================================
    
    /// Compare la similarité de deux concepts (0.0 à 1.0)
    SIMILAR { r1: Register, r2: Register, threshold: f32 },
    
    /// Teste si un concept est dans une sphère
    WITHIN { concept: Register, center: Register, radius: f32 },
    
    /// Vérifie l'alignement de concepts
    ALIGNED { r1: Register, r2: Register, tolerance: f32 },
    
    /// Distance sémantique entre concepts
    DISTANCE { r1: Register, r2: Register, dest: Register },
    
    // ============================================================================
    // OPÉRATIONS LOGIQUES SÉMANTIQUES
    // ============================================================================
    
    /// ET sémantique (intersection de concepts)
    AND { dest: Register, src1: Register, src2: Register },
    
    /// OU sémantique (union de concepts)
    OR { dest: Register, src1: Register, src2: Register },
    
    /// NON sémantique (négation/opposé)
    NOT { dest: Register, src: Register },
    
    /// XOR sémantique (différence symétrique)
    XOR { dest: Register, src1: Register, src2: Register },
    
    // ============================================================================
    // CONTRÔLE DE FLUX
    // ============================================================================
    
    /// Branchement si similarité suffisante
    BranchIfSimilar { r1: Register, r2: Register, threshold: f32, offset: i32 },
    
    /// Branchement si dans la sphère
    BranchIfWithin { concept: Register, center: Register, radius: f32, offset: i32 },
    
    /// Boucle avec compteur
    LOOP { counter: Register, max: u32 },
    
    /// Appel de sous-routine
    CALL { addr: Address },
    
    /// Retour de sous-routine
    RET,
    
    /// Saut inconditionnel
    JMP { offset: i32 },
    
    /// Saut si zéro (force nulle)
    JZ { reg: Register, offset: i32 },
    
    /// Saut si non-zéro
    JNZ { reg: Register, offset: i32 },
    
    // ============================================================================
    // PILE ET MÉMOIRE
    // ============================================================================
    
    /// Empile un concept
    PUSH { src: Register },
    
    /// Dépile un concept
    POP { dest: Register },
    
    /// Réserve de l'espace sur la pile
    ENTER { size: u32 },
    
    /// Libère l'espace de la pile
    LEAVE,
    
    // ============================================================================
    // OPÉRATIONS VECTORIELLES
    // ============================================================================
    
    /// Produit scalaire de positions
    DOT { dest: Register, v1: Register, v2: Register },
    
    /// Produit vectoriel
    CROSS { dest: Register, v1: Register, v2: Register },
    
    /// Normalisation de vecteur
    NORMALIZE { target: Register },
    
    /// Projection d'un concept sur un axe
    PROJECT { concept: Register, axis: Register, dest: Register },
    
    // ============================================================================
    // SYNCHRONISATION ET ATOMICITÉ
    // ============================================================================
    
    /// Verrouille un concept (exclusion mutuelle)
    LOCK { target: Register },
    
    /// Déverrouille un concept
    UNLOCK { target: Register },
    
    /// Compare et échange (atomique)
    CAS { target: Register, expected: Register, new: Register },
    
    // ============================================================================
    // INTERFACE COPROCESSEUR (pour plus tard)
    // ============================================================================
    
    /// Appel à un coprocesseur externe
    COPRO { id: u8, operation: u16, data: Register },
    
    /// Attente de réponse coprocesseur
    WAIT { timeout: u32 },
    
    // ============================================================================
    // SYSTÈME ET DEBUG
    // ============================================================================
    
    /// Arrêt du processeur
    HALT,
    
    /// Pas d'opération
    NOP,
    
    /// Point d'arrêt pour debug
    BREAK,
    
    /// Trace l'état d'un registre
    TRACE { reg: Register },
    
    /// Reset des flags
    ClearFlags,
}

// ================================================================================
// ÉTAT DU PROCESSEUR
// ================================================================================

/// État complet du SPU
pub struct SPUState {
    /// Registres généraux (16)
    pub registers: [Concept; 16],
    
    /// Program Counter
    pub pc: u32,
    
    /// Stack Pointer
    pub sp: u32,
    
    /// Base Pointer
    pub bp: u32,
    
    /// Flags d'état
    pub flags: StatusFlags,
    
    /// Accumulator pour opérations complexes
    pub accumulator: Concept,
    
    /// Position actuelle dans l'espace 3D
    pub position: Coordinates,
    
    /// Mémoire sémantique (sera implémentée plus tard)
    /// Pour l'instant on simule avec un Vec
    pub memory: Vec<Concept>,
    
    /// Pile d'exécution
    pub stack: Vec<Concept>,
    
    /// Compteur de cycles
    pub cycles: u64,
}

/// Flags d'état du processeur
#[derive(Debug, Clone, Default)]
pub struct StatusFlags {
    /// Zero flag (force sémantique nulle)
    pub zero: bool,
    
    /// Similarité élevée détectée
    pub similar: bool,
    
    /// Overflow sémantique (trop de connexions)
    pub overflow: bool,
    
    /// Alignement parfait
    pub aligned: bool,
    
    /// Dans la sphère cible
    pub within: bool,
    
    /// Erreur détectée
    pub error: bool,
    
    /// Mode trace actif
    pub trace: bool,
    
    /// Interruption en attente
    pub interrupt: bool,
}

// ================================================================================
// IMPLÉMENTATION DU PROCESSEUR
// ================================================================================

impl SPUState {
    /// Crée un nouveau SPU initialisé
    pub fn new() -> Self {
        let mut registers = Vec::with_capacity(16);
        for _ in 0..16 {
            registers.push(Concept::empty());
        }
        let registers_array: [Concept; 16] = registers.try_into().unwrap();
        
        Self {
            registers: registers_array,
            pc: 0,
            sp: 0,
            bp: 0,
            flags: StatusFlags::default(),
            accumulator: Concept::empty(),
            position: Coordinates { x: 0.0, y: 0.0, z: 0.0 },
            memory: Vec::with_capacity(65536), // 64K concepts
            stack: Vec::with_capacity(1024),
            cycles: 0,
        }
    }
    
    /// Exécute une instruction
    pub fn execute(&mut self, instruction: &Instruction) -> Result<(), SPUError> {
        self.cycles += 1;
        
        match instruction {
            // ============================================================================
            // TRANSFERT DE DONNÉES
            // ============================================================================
            
            Instruction::NOP => {},
            
            Instruction::MOVE { dest, src } => {
                let value = self.get_register(*src)?;
                self.set_register(*dest, value)?;
            },
            
            Instruction::LOAD { dest, addr } => {
                let idx = addr.0 as usize;
                if idx >= self.memory.len() {
                    return Err(SPUError::MemoryAccessViolation);
                }
                let concept = self.memory[idx].clone();
                self.set_register(*dest, concept)?;
            },
            
            Instruction::STORE { src, addr } => {
                let concept = self.get_register(*src)?;
                let idx = addr.0 as usize;
                
                // Étendre la mémoire si nécessaire
                while self.memory.len() <= idx {
                    self.memory.push(Concept::empty());
                }
                self.memory[idx] = concept;
            },
            
            Instruction::LOADI { dest, concept } => {
                self.set_register(*dest, concept.clone())?;
            },
            
            Instruction::SWAP { r1, r2 } => {
                let v1 = self.get_register(*r1)?;
                let v2 = self.get_register(*r2)?;
                self.set_register(*r1, v2)?;
                self.set_register(*r2, v1)?;
            },
            
            // ============================================================================
            // PILE
            // ============================================================================
            
            Instruction::PUSH { src } => {
                if self.stack.len() >= 1024 {
                    return Err(SPUError::StackOverflow);
                }
                let value = self.get_register(*src)?;
                self.stack.push(value);
                self.sp = self.stack.len() as u32;
            },
            
            Instruction::POP { dest } => {
                let value = self.stack.pop().ok_or(SPUError::StackUnderflow)?;
                self.set_register(*dest, value)?;
                self.sp = self.stack.len() as u32;
            },
            
            // ============================================================================
            // OPÉRATIONS SÉMANTIQUES
            // ============================================================================
            
            Instruction::MERGE { dest, src1, src2 } => {
                let c1 = self.get_register(*src1)?;
                let c2 = self.get_register(*src2)?;
                
                // Fusion : moyenne des positions, combinaison des forces
                let merged = Concept {
                    id: Concept::generate_id(),
                    position: [
                        (c1.position[0] + c2.position[0]) / 2.0,
                        (c1.position[1] + c2.position[1]) / 2.0,
                        (c1.position[2] + c2.position[2]) / 2.0,
                    ],
                    strength: (c1.strength + c2.strength) / 2.0,
                    links: {
                        let mut links = c1.links.clone();
                        links.extend(c2.links.iter());
                        links.push(c1.id);
                        links.push(c2.id);
                        links
                    },
                };
                
                self.set_register(*dest, merged)?;
            },
            
            Instruction::SPLIT { src, dest1, dest2 } => {
                let concept = self.get_register(*src)?;
                
                // Division : création de deux concepts avec force réduite
                let split1 = Concept {
                    id: Concept::generate_id(),
                    position: [
                        concept.position[0] - 0.1,
                        concept.position[1],
                        concept.position[2],
                    ],
                    strength: concept.strength * 0.5,
                    links: vec![concept.id],
                };
                
                let split2 = Concept {
                    id: Concept::generate_id(),
                    position: [
                        concept.position[0] + 0.1,
                        concept.position[1],
                        concept.position[2],
                    ],
                    strength: concept.strength * 0.5,
                    links: vec![concept.id],
                };
                
                self.set_register(*dest1, split1)?;
                self.set_register(*dest2, split2)?;
            },
            
            Instruction::AMPLIFY { target, gain } => {
                let mut concept = self.get_register(*target)?;
                concept.strength = (concept.strength * gain).min(1.0);
                self.set_register(*target, concept)?;
                
                // Met à jour le flag zero si force nulle
                self.flags.zero = concept.strength == 0.0;
            },
            
            Instruction::DAMPEN { target, loss } => {
                let mut concept = self.get_register(*target)?;
                concept.strength = (concept.strength * (1.0 - loss)).max(0.0);
                self.set_register(*target, concept)?;
                
                // Met à jour le flag zero si force nulle
                self.flags.zero = concept.strength == 0.0;
            },
            
            // ============================================================================
            // COMPARAISONS
            // ============================================================================
            
            Instruction::SIMILAR { r1, r2, threshold } => {
                let c1 = self.get_register(*r1)?;
                let c2 = self.get_register(*r2)?;
                
                // Calcul de similarité basé sur la distance euclidienne
                let dist = self.calculate_distance(&c1, &c2);
                let similarity = 1.0 / (1.0 + dist);  // Plus proche = plus similaire
                
                self.flags.similar = similarity >= *threshold;
            },
            
            Instruction::DISTANCE { r1, r2, dest } => {
                let c1 = self.get_register(*r1)?;
                let c2 = self.get_register(*r2)?;
                
                let dist = self.calculate_distance(&c1, &c2);
                
                // Crée un concept représentant la distance
                let distance_concept = Concept {
                    id: Concept::generate_id(),
                    position: [dist, 0.0, 0.0],  // Distance stockée dans X
                    strength: 1.0,
                    links: vec![c1.id, c2.id],
                };
                
                self.set_register(*dest, distance_concept)?;
            },
            
            Instruction::WITHIN { concept, center, radius } => {
                let c = self.get_register(*concept)?;
                let center_c = self.get_register(*center)?;
                
                let dist = self.calculate_distance(&c, &center_c);
                self.flags.within = dist <= *radius;
            },
            
            // ============================================================================
            // NAVIGATION SPATIALE
            // ============================================================================
            
            Instruction::NAV { direction, distance } => {
                let (dx, dy, dz) = match direction {
                    Direction::Up => (0.0, *distance, 0.0),
                    Direction::Down => (0.0, -*distance, 0.0),
                    Direction::Left => (-*distance, 0.0, 0.0),
                    Direction::Right => (*distance, 0.0, 0.0),
                    Direction::Forward => (0.0, 0.0, *distance),
                    Direction::Backward => (0.0, 0.0, -*distance),
                    Direction::UpLeft => (-*distance * 0.707, *distance * 0.707, 0.0),
                    Direction::UpRight => (*distance * 0.707, *distance * 0.707, 0.0),
                    Direction::DownLeft => (-*distance * 0.707, -*distance * 0.707, 0.0),
                    Direction::DownRight => (*distance * 0.707, -*distance * 0.707, 0.0),
                    Direction::ForwardUp => (0.0, *distance * 0.707, *distance * 0.707),
                    Direction::ForwardDown => (0.0, -*distance * 0.707, *distance * 0.707),
                    Direction::BackwardUp => (0.0, *distance * 0.707, -*distance * 0.707),
                    Direction::BackwardDown => (0.0, -*distance * 0.707, -*distance * 0.707),
                };
                
                self.position.x += dx;
                self.position.y += dy;
                self.position.z += dz;
            },
            
            Instruction::JUMP { coords } => {
                self.position = *coords;
            },
            
            Instruction::WARP { target } => {
                let concept = self.get_register(*target)?;
                self.position.x = concept.position[0];
                self.position.y = concept.position[1];
                self.position.z = concept.position[2];
            },
            
            // ============================================================================
            // OPÉRATIONS LOGIQUES
            // ============================================================================
            
            Instruction::AND { dest, src1, src2 } => {
                let c1 = self.get_register(*src1)?;
                let c2 = self.get_register(*src2)?;
                
                // Intersection sémantique : liens communs, force minimum
                let common_links: Vec<[u8; 12]> = c1.links.iter()
                    .filter(|l| c2.links.contains(l))
                    .cloned()
                    .collect();
                
                let result = Concept {
                    id: Concept::generate_id(),
                    position: [
                        (c1.position[0] + c2.position[0]) / 2.0,
                        (c1.position[1] + c2.position[1]) / 2.0,
                        (c1.position[2] + c2.position[2]) / 2.0,
                    ],
                    strength: c1.strength.min(c2.strength),
                    links: common_links,
                };
                
                self.set_register(*dest, result)?;
            },
            
            Instruction::OR { dest, src1, src2 } => {
                let c1 = self.get_register(*src1)?;
                let c2 = self.get_register(*src2)?;
                
                // Union sémantique : tous les liens, force maximum
                let mut all_links = c1.links.clone();
                for link in &c2.links {
                    if !all_links.contains(link) {
                        all_links.push(*link);
                    }
                }
                
                let result = Concept {
                    id: Concept::generate_id(),
                    position: [
                        (c1.position[0] + c2.position[0]) / 2.0,
                        (c1.position[1] + c2.position[1]) / 2.0,
                        (c1.position[2] + c2.position[2]) / 2.0,
                    ],
                    strength: c1.strength.max(c2.strength),
                    links: all_links,
                };
                
                self.set_register(*dest, result)?;
            },
            
            Instruction::NOT { dest, src } => {
                let concept = self.get_register(*src)?;
                
                // Négation sémantique : inverse la position, inverse la force
                let result = Concept {
                    id: Concept::generate_id(),
                    position: [
                        -concept.position[0],
                        -concept.position[1],
                        -concept.position[2],
                    ],
                    strength: 1.0 - concept.strength,
                    links: vec![concept.id],  // Lien vers l'original
                };
                
                self.set_register(*dest, result)?;
            },
            
            // ============================================================================
            // CONTRÔLE DE FLUX
            // ============================================================================
            
            Instruction::JMP { offset } => {
                self.pc = ((self.pc as i32) + offset) as u32;
            },
            
            Instruction::JZ { reg, offset } => {
                let concept = self.get_register(*reg)?;
                if concept.strength == 0.0 {
                    self.pc = ((self.pc as i32) + offset) as u32;
                }
            },
            
            Instruction::JNZ { reg, offset } => {
                let concept = self.get_register(*reg)?;
                if concept.strength != 0.0 {
                    self.pc = ((self.pc as i32) + offset) as u32;
                }
            },
            
            Instruction::BranchIfSimilar { r1, r2, threshold, offset } => {
                let c1 = self.get_register(*r1)?;
                let c2 = self.get_register(*r2)?;
                
                let dist = self.calculate_distance(&c1, &c2);
                let similarity = 1.0 / (1.0 + dist);
                
                if similarity >= *threshold {
                    self.pc = ((self.pc as i32) + offset) as u32;
                }
            },
            
            // ============================================================================
            // SYSTÈME
            // ============================================================================
            
            Instruction::HALT => {
                return Err(SPUError::Halted);
            },
            
            Instruction::ClearFlags => {
                self.flags = StatusFlags::default();
            },
            
            Instruction::TRACE { reg } => {
                let concept = self.get_register(*reg)?;
                println!("[TRACE] {:?}: {:?}", reg, concept);
            },
            
            // ... autres instructions à implémenter
            _ => return Err(SPUError::NotImplemented),
        }
        
        // Incrément du PC sauf si modifié par un saut
        if !matches!(instruction, 
            Instruction::JMP{..} | 
            Instruction::JZ{..} | 
            Instruction::JNZ{..} | 
            Instruction::BranchIfSimilar{..}
        ) {
            self.pc += 1;
        }
        
        Ok(())
    }
    
    /// Calcule la distance euclidienne entre deux concepts
    fn calculate_distance(&self, c1: &Concept, c2: &Concept) -> f32 {
        let dx = c1.position[0] - c2.position[0];
        let dy = c1.position[1] - c2.position[1];
        let dz = c1.position[2] - c2.position[2];
        (dx * dx + dy * dy + dz * dz).sqrt()
    }
    
    fn get_register(&self, reg: Register) -> Result<Concept, SPUError> {
        let reg_idx = reg as u8;
        match reg {
            _ if reg_idx <= 15 => {
                let idx = reg_idx as usize;
                Ok(self.registers[idx].clone())
            },
            Register::ACC => Ok(self.accumulator.clone()),
            _ => Err(SPUError::InvalidRegister),
        }
    }
    
    fn set_register(&mut self, reg: Register, value: Concept) -> Result<(), SPUError> {
        let reg_idx = reg as u8;
        match reg {
            _ if reg_idx <= 15 => {
                let idx = reg_idx as usize;
                self.registers[idx] = value;
                Ok(())
            },
            Register::ACC => {
                self.accumulator = value;
                Ok(())
            },
            _ => Err(SPUError::InvalidRegister),
        }
    }
}

// ================================================================================
// GESTION DES ERREURS
// ================================================================================

#[derive(Debug, Clone, PartialEq)]
pub enum SPUError {
    InvalidRegister,
    MemoryAccessViolation,
    StackOverflow,
    StackUnderflow,
    DivisionByZero,
    InvalidInstruction,
    NotImplemented,
    Halted,
    CoprocessorTimeout,
}

// ================================================================================
// HELPERS
// ================================================================================

impl Concept {
    /// Concept vide
    pub fn empty() -> Self {
        Self {
            id: [0; 12],
            position: [0.0, 0.0, 0.0],
            strength: 0.0,
            links: Vec::new(),
        }
    }
    
    /// Crée un nouveau concept avec ID unique
    pub fn new(x: f32, y: f32, z: f32) -> Self {
        Self {
            id: Self::generate_id(),
            position: [x, y, z],
            strength: 1.0,
            links: Vec::new(),
        }
    }
    
    /// Génère un ID unique (simulation BSON ObjectId)
    fn generate_id() -> [u8; 12] {
        // Pour l'instant on simule, plus tard on utilisera le vrai ObjectId
        static mut COUNTER: u32 = 0;
        let mut id = [0u8; 12];
        unsafe {
            COUNTER += 1;
            id[8..12].copy_from_slice(&COUNTER.to_be_bytes());
        }
        id
    }
}

// ================================================================================
// TESTS
// ================================================================================

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_spu_creation() {
        let spu = SPUState::new();
        assert_eq!(spu.pc, 0);
        assert_eq!(spu.cycles, 0);
        assert_eq!(spu.position.x, 0.0);
    }
    
    #[test]
    fn test_nop_instruction() {
        let mut spu = SPUState::new();
        let result = spu.execute(&Instruction::NOP);
        assert!(result.is_ok());
        assert_eq!(spu.cycles, 1);
    }
    
    #[test]
    fn test_move_instruction() {
        let mut spu = SPUState::new();
        let concept = Concept::new(1.0, 2.0, 3.0);
        spu.registers[0] = concept.clone();
        
        let result = spu.execute(&Instruction::MOVE { 
            dest: Register::R1, 
            src: Register::R0 
        });
        
        assert!(result.is_ok());
        assert_eq!(spu.registers[1], concept);
    }
    
    #[test]
    fn test_halt_instruction() {
        let mut spu = SPUState::new();
        let result = spu.execute(&Instruction::HALT);
        assert_eq!(result, Err(SPUError::Halted));
    }
    
    #[test]
    fn test_load_store_instructions() {
        let mut spu = SPUState::new();
        let concept = Concept::new(5.0, 10.0, 15.0);
        
        // Store concept in memory at address 42
        spu.registers[0] = concept.clone();
        spu.execute(&Instruction::STORE { 
            src: Register::R0, 
            addr: Address(42) 
        }).unwrap();
        
        // Load from memory to different register
        spu.execute(&Instruction::LOAD { 
            dest: Register::R5, 
            addr: Address(42) 
        }).unwrap();
        
        assert_eq!(spu.registers[5].position, concept.position);
        assert_eq!(spu.registers[5].strength, concept.strength);
    }
    
    #[test]
    fn test_push_pop_stack() {
        let mut spu = SPUState::new();
        let c1 = Concept::new(1.0, 2.0, 3.0);
        let c2 = Concept::new(4.0, 5.0, 6.0);
        
        spu.registers[0] = c1.clone();
        spu.registers[1] = c2.clone();
        
        // Push two concepts
        spu.execute(&Instruction::PUSH { src: Register::R0 }).unwrap();
        spu.execute(&Instruction::PUSH { src: Register::R1 }).unwrap();
        assert_eq!(spu.sp, 2);
        
        // Pop in reverse order
        spu.execute(&Instruction::POP { dest: Register::R10 }).unwrap();
        spu.execute(&Instruction::POP { dest: Register::R11 }).unwrap();
        
        assert_eq!(spu.registers[10].position, c2.position);
        assert_eq!(spu.registers[11].position, c1.position);
        assert_eq!(spu.sp, 0);
    }
    
    #[test]
    fn test_merge_instruction() {
        let mut spu = SPUState::new();
        let c1 = Concept::new(0.0, 0.0, 0.0);
        let c2 = Concept::new(10.0, 10.0, 10.0);
        
        spu.registers[0] = c1;
        spu.registers[1] = c2;
        
        spu.execute(&Instruction::MERGE {
            dest: Register::R2,
            src1: Register::R0,
            src2: Register::R1,
        }).unwrap();
        
        // Check merged position is average
        assert_eq!(spu.registers[2].position[0], 5.0);
        assert_eq!(spu.registers[2].position[1], 5.0);
        assert_eq!(spu.registers[2].position[2], 5.0);
    }
    
    #[test]
    fn test_split_instruction() {
        let mut spu = SPUState::new();
        let concept = Concept::new(5.0, 5.0, 5.0);
        spu.registers[0] = concept;
        
        spu.execute(&Instruction::SPLIT {
            src: Register::R0,
            dest1: Register::R1,
            dest2: Register::R2,
        }).unwrap();
        
        // Check split concepts have reduced strength
        assert_eq!(spu.registers[1].strength, 0.5);
        assert_eq!(spu.registers[2].strength, 0.5);
        
        // Check positions are offset
        assert!(spu.registers[1].position[0] < spu.registers[2].position[0]);
    }
    
    #[test]
    fn test_similar_instruction() {
        let mut spu = SPUState::new();
        let c1 = Concept::new(0.0, 0.0, 0.0);
        let c2 = Concept::new(0.1, 0.1, 0.1);
        let c3 = Concept::new(100.0, 100.0, 100.0);
        
        spu.registers[0] = c1;
        spu.registers[1] = c2;
        spu.registers[2] = c3;
        
        // Test high similarity
        spu.execute(&Instruction::SIMILAR {
            r1: Register::R0,
            r2: Register::R1,
            threshold: 0.5,
        }).unwrap();
        assert!(spu.flags.similar);
        
        // Test low similarity
        spu.execute(&Instruction::SIMILAR {
            r1: Register::R0,
            r2: Register::R2,
            threshold: 0.5,
        }).unwrap();
        assert!(!spu.flags.similar);
    }
    
    #[test]
    fn test_navigation() {
        let mut spu = SPUState::new();
        assert_eq!(spu.position.x, 0.0);
        assert_eq!(spu.position.y, 0.0);
        assert_eq!(spu.position.z, 0.0);
        
        // Move up
        spu.execute(&Instruction::NAV {
            direction: Direction::Up,
            distance: 5.0,
        }).unwrap();
        assert_eq!(spu.position.y, 5.0);
        
        // Move right
        spu.execute(&Instruction::NAV {
            direction: Direction::Right,
            distance: 3.0,
        }).unwrap();
        assert_eq!(spu.position.x, 3.0);
        
        // Jump to specific coords
        spu.execute(&Instruction::JUMP {
            coords: Coordinates { x: 10.0, y: 20.0, z: 30.0 },
        }).unwrap();
        assert_eq!(spu.position.x, 10.0);
        assert_eq!(spu.position.y, 20.0);
        assert_eq!(spu.position.z, 30.0);
    }
    
    #[test]
    fn test_logical_operations() {
        let mut spu = SPUState::new();
        
        let mut c1 = Concept::new(1.0, 1.0, 1.0);
        c1.links = vec![[1; 12], [2; 12], [3; 12]];
        c1.strength = 0.8;
        
        let mut c2 = Concept::new(2.0, 2.0, 2.0);
        c2.links = vec![[2; 12], [3; 12], [4; 12]];
        c2.strength = 0.6;
        
        spu.registers[0] = c1;
        spu.registers[1] = c2;
        
        // Test AND (intersection)
        spu.execute(&Instruction::AND {
            dest: Register::R2,
            src1: Register::R0,
            src2: Register::R1,
        }).unwrap();
        assert_eq!(spu.registers[2].links.len(), 2); // Common links: [2] and [3]
        assert_eq!(spu.registers[2].strength, 0.6); // Min strength
        
        // Test OR (union)
        spu.execute(&Instruction::OR {
            dest: Register::R3,
            src1: Register::R0,
            src2: Register::R1,
        }).unwrap();
        assert_eq!(spu.registers[3].links.len(), 4); // All unique links
        assert_eq!(spu.registers[3].strength, 0.8); // Max strength
        
        // Test NOT (negation)
        spu.execute(&Instruction::NOT {
            dest: Register::R4,
            src: Register::R0,
        }).unwrap();
        assert_eq!(spu.registers[4].position[0], -1.0);
        assert_eq!(spu.registers[4].strength, 0.2); // 1.0 - 0.8
    }
    
    #[test]
    fn test_control_flow() {
        let mut spu = SPUState::new();
        
        // Test JMP
        spu.pc = 10;
        spu.execute(&Instruction::JMP { offset: 5 }).unwrap();
        assert_eq!(spu.pc, 15);
        
        spu.execute(&Instruction::JMP { offset: -3 }).unwrap();
        assert_eq!(spu.pc, 12);
        
        // Test JZ (jump if zero)
        let mut concept = Concept::new(1.0, 1.0, 1.0);
        concept.strength = 0.0;
        spu.registers[0] = concept;
        spu.pc = 20;
        
        spu.execute(&Instruction::JZ {
            reg: Register::R0,
            offset: 10,
        }).unwrap();
        assert_eq!(spu.pc, 30);
        
        // Test JNZ (jump if not zero)
        concept.strength = 0.5;
        spu.registers[1] = concept;
        spu.pc = 40;
        
        spu.execute(&Instruction::JNZ {
            reg: Register::R1,
            offset: -5,
        }).unwrap();
        assert_eq!(spu.pc, 35);
    }
}