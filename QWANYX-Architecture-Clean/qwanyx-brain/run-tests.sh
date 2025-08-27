#!/bin/bash
# Test complet silencieux du système SPU avec MongoDB

# Couleurs pour le résultat final seulement
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour exécuter un test silencieusement
run_test() {
    local name=$1
    local cmd=$2
    
    if $cmd > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} $name"
        return 0
    else
        echo -e "${RED}✗${NC} $name"
        return 1
    fi
}

# Tests
echo "SPU MongoDB Integration Tests"
echo "=============================="

# Test 1: Compilation spu-core
run_test "spu-core compilation" "cd spu-core && cargo build --quiet"

# Test 2: Tests unitaires spu-core
run_test "spu-core unit tests" "cd spu-core && cargo test --quiet"

# Test 3: Compilation spu-rust
run_test "spu-rust compilation" "cd spu-rust && cargo build --quiet"

# Test 4: MongoDB ping (si disponible)
if command -v mongosh &> /dev/null; then
    run_test "MongoDB connection" "mongosh --quiet --eval 'db.runCommand({ping: 1})'"
else
    echo "⚠ MongoDB test skipped (mongosh not found)"
fi

# Test 5: Test d'intégration SPU
run_test "SPU integration test" "cd spu-core && cargo test --test simple_test --quiet"

echo "=============================="

# Résultat global
if [ $? -eq 0 ]; then
    echo -e "${GREEN}All tests passed!${NC}"
else
    echo -e "${RED}Some tests failed${NC}"
    exit 1
fi