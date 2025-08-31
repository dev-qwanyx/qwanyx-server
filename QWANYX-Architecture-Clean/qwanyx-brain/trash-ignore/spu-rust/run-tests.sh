#!/bin/bash

# SPU Test Runner Script

echo "🧪 QWANYX SPU Test Suite"
echo "========================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to run tests with nice formatting
run_test_suite() {
    local name=$1
    local cmd=$2
    
    echo -e "${YELLOW}Running $name...${NC}"
    if eval $cmd; then
        echo -e "${GREEN}✅ $name passed!${NC}"
        return 0
    else
        echo -e "${RED}❌ $name failed!${NC}"
        return 1
    fi
    echo ""
}

# Track overall success
all_passed=true

# 1. Run unit tests
echo "📦 Unit Tests"
echo "-------------"
if ! run_test_suite "Compression tests" "cargo test compression::tests 2>&1 | grep -E 'test result|running'"; then
    all_passed=false
fi

if ! run_test_suite "Space tests" "cargo test space::tests 2>&1 | grep -E 'test result|running'"; then
    all_passed=false
fi

if ! run_test_suite "Instruction tests" "cargo test instruction::tests 2>&1 | grep -E 'test result|running'"; then
    all_passed=false
fi

if ! run_test_suite "Cache tests" "cargo test cache::tests 2>&1 | grep -E 'test result|running'"; then
    all_passed=false
fi

echo ""
echo "🔗 Integration Tests"
echo "-------------------"
if ! run_test_suite "Processor integration" "cargo test --test processor_test 2>&1 | grep -E 'test result|running'"; then
    all_passed=false
fi

echo ""
echo "📊 Summary"
echo "---------"
if [ "$all_passed" = true ]; then
    echo -e "${GREEN}✅ All tests passed successfully!${NC}"
    
    # Quick stats
    echo ""
    echo "Quick Stats:"
    cargo test 2>&1 | grep "test result:" | tail -1
else
    echo -e "${RED}❌ Some tests failed. Please review the output above.${NC}"
    exit 1
fi

echo ""
echo "💡 Tip: Run 'cargo test -- --nocapture' to see all test output"
echo "📈 Tip: Run 'cargo bench' to run performance benchmarks"