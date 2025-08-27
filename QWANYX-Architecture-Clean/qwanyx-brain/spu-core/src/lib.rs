//! SPU Core - Semantic Processing Unit
//! 
//! Processeur sémantique où tout est fonction.
//! Pas de différence entre ADD(1,1) et COMPRESS(book).

mod coprocessor;
mod ai_integration;
mod openai_client;
mod data_types;
mod executor;

pub use coprocessor::*;
pub use ai_integration::*;
pub use openai_client::*;
pub use data_types::*;
pub use executor::*;

// ================================================================================
// REGISTRES
// ================================================================================

/// Registres du SPU
#[derive(Debug, Clone, Copy, PartialEq)]
#[repr(u8)]
pub enum Register {
    // Registres généraux
    R0 = 0, R1 = 1, R2 = 2, R3 = 3, 
    R4 = 4, R5 = 5, R6 = 6, R7 = 7,
    R8 = 8, R9 = 9, R10 = 10, R11 = 11, 
    R12 = 12, R13 = 13, R14 = 14, R15 = 15,
    
    // Registres spéciaux
    PC = 16,     // Program Counter
    SP = 17,     // Stack Pointer
    FLAGS = 18,  // Status flags
    ACC = 19,    // Accumulator
}

// ================================================================================
// CONCEPT - Unité de base
// ================================================================================

/// Concept sémantique
#[derive(Debug, Clone, PartialEq)]
pub struct Concept {
    /// Identifiant unique (BSON ObjectId)
    pub id: [u8; 12],
    /// Type de concept
    pub concept_type: ConceptType,
    /// Force sémantique
    pub strength: f32,
    /// Données
    pub data: ConceptData,
    /// Liens vers d'autres concepts
    pub links: Vec<[u8; 12]>,
}

/// Types de concepts
#[derive(Debug, Clone, PartialEq)]
pub enum ConceptType {
    Text,
    Email,
    Document,
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

impl Concept {
    /// Concept vide
    pub fn empty() -> Self {
        Self {
            id: [0; 12],
            concept_type: ConceptType::Empty,
            strength: 0.0,
            data: ConceptData::Empty,
            links: Vec::new(),
        }
    }
    
    /// Génère un ID unique
    pub fn generate_id() -> [u8; 12] {
        static mut COUNTER: u32 = 0;
        let mut id = [0u8; 12];
        unsafe {
            COUNTER += 1;
            id[8..12].copy_from_slice(&COUNTER.to_be_bytes());
        }
        id
    }
    
    /// Crée un concept numérique
    pub fn new(x: f32, y: f32, z: f32) -> Self {
        // Pour compatibilité avec l'ancien code
        Self {
            id: Self::generate_id(),
            concept_type: ConceptType::Number,
            strength: 1.0,
            data: ConceptData::Number((x + y + z) as f64),
            links: Vec::new(),
        }
    }
}

// ================================================================================
// INSTRUCTIONS SIMPLIFIÉES
// ================================================================================

#[derive(Debug, Clone, PartialEq)]
pub enum Instruction {
    // Instructions de base
    NOP,
    HALT,
    
    // Transfert de données
    MOVE { dest: Register, src: Register },
    LOADI { dest: Register, concept: Concept },
    LOAD { dest: Register, addr: Address },
    STORE { src: Register, addr: Address },
    SWAP { r1: Register, r2: Register },
    
    // Pile
    PUSH { src: Register },
    POP { dest: Register },
    
    // Appel de fonction (unifié)
    CALL { function: Function, input: Register, output: Register },
    
    // Contrôle de flux
    JMP { offset: i32 },
    JZ { reg: Register, offset: i32 },
    JNZ { reg: Register, offset: i32 },
    
    // Debug
    TRACE { reg: Register },
    ClearFlags,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Address(pub u32);

// ================================================================================
// ÉTAT DU SPU
// ================================================================================

pub struct SPUState {
    /// Registres
    pub registers: [Concept; 16],
    
    /// Program Counter
    pub pc: u32,
    
    /// Stack Pointer
    pub sp: u32,
    
    /// Flags
    pub flags: StatusFlags,
    
    /// Accumulator
    pub accumulator: Concept,
    
    /// Mémoire
    pub memory: Vec<Concept>,
    
    /// Pile
    pub stack: Vec<Concept>,
    
    /// Cycles
    pub cycles: u64,
    
    /// Exécuteur de fonctions
    pub executor: FunctionExecutor,
}

#[derive(Debug, Clone, Default)]
pub struct StatusFlags {
    pub zero: bool,
    pub error: bool,
}

// ================================================================================
// IMPLÉMENTATION
// ================================================================================

impl SPUState {
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
            flags: StatusFlags::default(),
            accumulator: Concept::empty(),
            memory: Vec::with_capacity(65536),
            stack: Vec::with_capacity(1024),
            cycles: 0,
            executor: FunctionExecutor::new(),
        }
    }
    
    /// Exécute une instruction
    pub fn execute(&mut self, instruction: &Instruction) -> Result<(), SPUError> {
        self.cycles += 1;
        
        match instruction {
            Instruction::NOP => {},
            
            Instruction::HALT => return Err(SPUError::Halted),
            
            Instruction::MOVE { dest, src } => {
                let value = self.get_register(*src)?;
                self.set_register(*dest, value)?;
            },
            
            Instruction::LOADI { dest, concept } => {
                self.set_register(*dest, concept.clone())?;
            },
            
            Instruction::LOAD { dest, addr } => {
                let idx = addr.0 as usize;
                if idx >= self.memory.len() {
                    return Err(SPUError::MemoryAccessViolation);
                }
                self.set_register(*dest, self.memory[idx].clone())?;
            },
            
            Instruction::STORE { src, addr } => {
                let concept = self.get_register(*src)?;
                let idx = addr.0 as usize;
                while self.memory.len() <= idx {
                    self.memory.push(Concept::empty());
                }
                self.memory[idx] = concept;
            },
            
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
            
            Instruction::CALL { function, input, output } => {
                let input_concept = self.get_register(*input)?;
                let result = self.executor.execute(*function, &[input_concept])
                    .map_err(|_| SPUError::CoprocessorError)?;
                self.set_register(*output, result)?;
            },
            
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
            
            Instruction::TRACE { reg } => {
                let concept = self.get_register(*reg)?;
                println!("[TRACE] {:?}: {:?}", reg, concept);
            },
            
            Instruction::ClearFlags => {
                self.flags = StatusFlags::default();
            },
            
            _ => return Err(SPUError::NotImplemented),
        }
        
        // Incrément PC sauf si saut
        if !matches!(instruction, 
            Instruction::JMP{..} | 
            Instruction::JZ{..} | 
            Instruction::JNZ{..}
        ) {
            self.pc += 1;
        }
        
        Ok(())
    }
    
    fn get_register(&self, reg: Register) -> Result<Concept, SPUError> {
        let reg_idx = reg as u8;
        match reg {
            _ if reg_idx <= 15 => {
                Ok(self.registers[reg_idx as usize].clone())
            },
            Register::ACC => Ok(self.accumulator.clone()),
            _ => Err(SPUError::InvalidRegister),
        }
    }
    
    fn set_register(&mut self, reg: Register, value: Concept) -> Result<(), SPUError> {
        let reg_idx = reg as u8;
        match reg {
            _ if reg_idx <= 15 => {
                self.registers[reg_idx as usize] = value;
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
// ERREURS
// ================================================================================

#[derive(Debug, Clone, PartialEq)]
pub enum SPUError {
    InvalidRegister,
    MemoryAccessViolation,
    StackOverflow,
    StackUnderflow,
    NotImplemented,
    Halted,
    CoprocessorError,
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
    }
    
    #[test]
    fn test_nop_instruction() {
        let mut spu = SPUState::new();
        let result = spu.execute(&Instruction::NOP);
        assert!(result.is_ok());
        assert_eq!(spu.cycles, 1);
    }
    
    #[test]
    fn test_halt_instruction() {
        let mut spu = SPUState::new();
        let result = spu.execute(&Instruction::HALT);
        assert_eq!(result, Err(SPUError::Halted));
    }
    
    #[test]
    fn test_move_instruction() {
        let mut spu = SPUState::new();
        let concept = Concept::from_number(42.0);
        spu.registers[0] = concept.clone();
        
        spu.execute(&Instruction::MOVE {
            dest: Register::R1,
            src: Register::R0,
        }).unwrap();
        
        assert_eq!(spu.registers[1], concept);
    }
    
    #[test]
    #[ignore] // Ignore car nécessite une clé API
    fn test_call_compress_function() {
        let mut spu = SPUState::new();
        spu.registers[0] = Concept::from_text("Hello World, this is a test".to_string());
        
        // Test compression - nécessite une vraie clé API
        let result = spu.execute(&Instruction::CALL {
            function: Function::CompressNano,
            input: Register::R0,
            output: Register::R1,
        });
        
        // Sans clé API, on doit avoir une erreur
        if std::env::var("OPENAI_API_KEY").is_err() {
            assert!(result.is_err());
        }
    }
    
    #[test]
    fn test_push_pop() {
        let mut spu = SPUState::new();
        let c1 = Concept::from_number(1.0);
        let c2 = Concept::from_number(2.0);
        
        spu.registers[0] = c1.clone();
        spu.registers[1] = c2.clone();
        
        spu.execute(&Instruction::PUSH { src: Register::R0 }).unwrap();
        spu.execute(&Instruction::PUSH { src: Register::R1 }).unwrap();
        assert_eq!(spu.sp, 2);
        
        spu.execute(&Instruction::POP { dest: Register::R10 }).unwrap();
        spu.execute(&Instruction::POP { dest: Register::R11 }).unwrap();
        
        assert_eq!(spu.registers[10].data, c2.data);
        assert_eq!(spu.registers[11].data, c1.data);
        assert_eq!(spu.sp, 0);
    }
    
    #[test]
    fn test_memory_operations() {
        let mut spu = SPUState::new();
        let concept = Concept::from_text("Hello SPU".to_string());
        
        spu.registers[0] = concept.clone();
        spu.execute(&Instruction::STORE {
            src: Register::R0,
            addr: Address(100),
        }).unwrap();
        
        spu.execute(&Instruction::LOAD {
            dest: Register::R5,
            addr: Address(100),
        }).unwrap();
        
        assert_eq!(spu.registers[5], concept);
    }
}