#!/bin/bash
# Test complètement silencieux - n'affiche que le code de retour

cd qwanyx-brain/spu-core && \
RUST_LOG=error cargo run --example silent_test --quiet 2>/dev/null

exit $?