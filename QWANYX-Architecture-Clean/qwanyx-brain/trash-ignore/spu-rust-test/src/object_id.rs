// Notre propre ObjectId compatible BSON sans dépendances !

use std::fmt;
use std::time::{SystemTime, UNIX_EPOCH};

/// ObjectId compatible avec MongoDB BSON
/// 12 bytes : 4 timestamp + 5 random + 3 counter
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct ObjectId([u8; 12]);

static mut COUNTER: u32 = 0;

impl ObjectId {
    /// Créer un nouvel ObjectId unique
    pub fn new() -> Self {
        let timestamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs() as u32;
        
        let mut bytes = [0u8; 12];
        
        // 4 bytes timestamp
        bytes[0..4].copy_from_slice(&timestamp.to_be_bytes());
        
        // 5 bytes random (simulé avec timestamp + hash)
        let random = timestamp.wrapping_mul(2654435761); // Knuth multiplicative hash
        bytes[4..8].copy_from_slice(&random.to_be_bytes());
        bytes[8] = (random >> 24) as u8;
        
        // 3 bytes counter
        let counter = unsafe {
            COUNTER += 1;
            COUNTER
        };
        bytes[9] = (counter >> 16) as u8;
        bytes[10] = (counter >> 8) as u8;
        bytes[11] = counter as u8;
        
        ObjectId(bytes)
    }
    
    /// Convertir en string hexadécimal (24 caractères)
    pub fn to_hex(&self) -> String {
        self.0.iter()
            .map(|b| format!("{:02x}", b))
            .collect()
    }
    
    /// Parser depuis string hexadécimal
    pub fn parse_str(s: &str) -> Result<Self, String> {
        if s.len() != 24 {
            return Err(format!("ObjectId doit faire 24 chars, pas {}", s.len()));
        }
        
        let mut bytes = [0u8; 12];
        for i in 0..12 {
            bytes[i] = u8::from_str_radix(&s[i*2..i*2+2], 16)
                .map_err(|_| "Invalid hex")?;
        }
        
        Ok(ObjectId(bytes))
    }
    
    /// Récupérer le timestamp embedded
    pub fn timestamp(&self) -> u32 {
        u32::from_be_bytes([self.0[0], self.0[1], self.0[2], self.0[3]])
    }
}

impl fmt::Display for ObjectId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.to_hex())
    }
}

impl Default for ObjectId {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_objectid_unique() {
        let id1 = ObjectId::new();
        let id2 = ObjectId::new();
        assert_ne!(id1, id2);
    }
    
    #[test]
    fn test_hex_conversion() {
        let id = ObjectId::new();
        let hex = id.to_hex();
        assert_eq!(hex.len(), 24);
        
        let parsed = ObjectId::parse_str(&hex).unwrap();
        assert_eq!(id, parsed);
    }
    
    #[test]
    fn test_timestamp() {
        let id = ObjectId::new();
        let ts = id.timestamp();
        assert!(ts > 0);
    }
}