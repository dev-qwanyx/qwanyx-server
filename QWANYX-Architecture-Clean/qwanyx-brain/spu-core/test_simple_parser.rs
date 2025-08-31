fn main() {
    let script = r#"
# Test
SET data {
    "key": "value"
}
    "#;
    
    // Simple test of the problematic part
    let lines: Vec<&str> = script.lines().collect();
    println!("Lines: {:?}", lines);
    
    // Test the brace counting
    let line = r#"{"key": "value"}"#;
    let open = line.chars().filter(|&c| c == '{').count();
    let close = line.chars().filter(|&c| c == '}').count();
    println!("Open: {}, Close: {}", open, close);
}