use mongodb::Client;

#[tokio::main]
async fn main() {
    println!("Testing MongoDB connection...");
    
    let uri = "mongodb://localhost:27017";
    println!("Connecting to: {}", uri);
    
    match Client::with_uri_str(uri).await {
        Ok(_client) => {
            println!("✅ Successfully connected to MongoDB!");
        }
        Err(e) => {
            println!("❌ Failed to connect: {}", e);
        }
    }
}