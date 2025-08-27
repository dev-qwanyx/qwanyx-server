mod object_id;
use object_id::ObjectId;

fn main() {
    println!("Test BSON ObjectId pour SPU");
    
    // Test 1: Créer un ObjectId
    let id = ObjectId::new();
    println!("New ObjectId: {}", id);
    
    // Test 2: String conversion (comme MongoDB)
    let id_string = id.to_hex();
    println!("As hex string: {}", id_string);
    
    // Test 3: Parse from string
    let parsed = ObjectId::parse_str(&id_string).unwrap();
    println!("Parsed back: {}", parsed);
    
    // Test 4: Vérifier égalité
    assert_eq!(id, parsed);
    println!("✅ ObjectId roundtrip works!");
    
    // Test 5: Timestamp embedded (comme MongoDB)
    let timestamp = id.timestamp();
    println!("Embedded timestamp: {:?}", timestamp);
    
    println!("\n✅ BSON ObjectId fonctionne parfaitement!");
}

#[cfg(test)]
mod tests {
    use super::*;
    mod object_id;
use object_id::ObjectId;
    
    #[test]
    fn test_objectid_creation() {
        let id = ObjectId::new();
        assert!(!id.to_hex().is_empty());
        assert_eq!(id.to_hex().len(), 24); // ObjectId est toujours 24 chars hex
    }
    
    #[test]
    fn test_objectid_uniqueness() {
        let id1 = ObjectId::new();
        let id2 = ObjectId::new();
        assert_ne!(id1, id2);
    }
    
    #[test]
    fn test_objectid_parsing() {
        let id = ObjectId::new();
        let hex = id.to_hex();
        let parsed = ObjectId::parse_str(&hex).unwrap();
        assert_eq!(id, parsed);
    }
}
