//! MongoDB health checks

use mongodb::{Client as MongoClient, bson::doc};

#[actix_rt::test]
async fn test_mongodb_connection() {
    // Try to connect with a timeout
    let uri = "mongodb://localhost:27017/?serverSelectionTimeoutMS=2000";
    
    match MongoClient::with_uri_str(uri).await {
        Ok(client) => {
            // Test ping
            let db = client.database("test_db");
            let result = db.run_command(doc! { "ping": 1 }, None).await;
            assert!(result.is_ok(), "MongoDB ping failed");
        }
        Err(_) => {
            // MongoDB not running - skip test but warn
            println!("WARNING: MongoDB not available for testing");
        }
    }
}

#[actix_rt::test]
async fn test_bson_serialization() {
    use mongodb::bson::{doc, Bson, Document};
    use std::time::SystemTime;
    
    // Create a test document
    let test_doc = doc! {
        "email": "test@example.com",
        "code": "123456",
        "created_at": Bson::DateTime(SystemTime::now().into()),
        "workspace": "test",
        "used": false,
    };
    
    // Check fields
    assert_eq!(test_doc.get_str("email").unwrap(), "test@example.com");
    assert_eq!(test_doc.get_str("code").unwrap(), "123456");
    assert_eq!(test_doc.get_bool("used").unwrap(), false);
    
    // Test BSON round-trip
    let bson = mongodb::bson::to_bson(&test_doc).expect("BSON serialization failed");
    let doc_back: Document = bson.as_document().unwrap().clone();
    assert_eq!(doc_back.get_str("email").unwrap(), "test@example.com");
}

#[actix_rt::test]
async fn test_query_building() {
    use mongodb::bson::doc;
    use std::time::SystemTime;
    
    // Test various query patterns
    let queries = vec![
        // Find by email
        doc! { "email": "user@example.com" },
        
        // Find with multiple conditions
        doc! { 
            "email": "user@example.com",
            "workspace": "autodin",
            "used": false
        },
        
        // Find with operators
        doc! {
            "created_at": {
                "$gte": mongodb::bson::Bson::DateTime(SystemTime::now().into())
            }
        },
        
        // Update document
        doc! {
            "$set": {
                "used": true,
                "used_at": mongodb::bson::Bson::DateTime(SystemTime::now().into())
            }
        },
    ];
    
    for query in queries {
        // Just verify they serialize correctly
        let _bson = mongodb::bson::to_bson(&query)
            .expect("Query serialization failed");
    }
}

#[test]
fn test_objectid_generation() {
    use mongodb::bson::oid::ObjectId;
    
    // Generate multiple ObjectIds
    let id1 = ObjectId::new();
    let id2 = ObjectId::new();
    let id3 = ObjectId::new();
    
    // Should all be unique
    assert_ne!(id1, id2);
    assert_ne!(id2, id3);
    assert_ne!(id1, id3);
    
    // Should be valid hex strings
    assert_eq!(id1.to_hex().len(), 24);
    assert!(id1.to_hex().chars().all(|c| c.is_ascii_hexdigit()));
    
    // Should be parseable
    let id_str = id1.to_hex();
    let parsed = ObjectId::parse_str(&id_str).expect("Failed to parse ObjectId");
    assert_eq!(parsed, id1);
}