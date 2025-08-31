use spu_core::parser::AssemblyParser;

fn main() {
    let script = r#"
        # Simple test
        SET user_data {
            "email": "test@example.com",
            "firstName": "Test"
        }
    "#;
    
    println!("Parsing script...");
    match AssemblyParser::parse(script) {
        Ok(instructions) => {
            println!("Parsed {} instructions", instructions.len());
            for inst in instructions {
                println!("  {:?}", inst);
            }
        }
        Err(e) => {
            println!("Parse error: {}", e);
        }
    }
}