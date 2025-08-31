#!/bin/bash
# Script pour migrer tous les packages vers tsup

PACKAGES=(
  "qwanyx-ui"
  "qwanyx-auth"
  "qwanyx-form"
  "qwanyx-dashboard"
  "qwanyx-dashboard-v2"
  "qwanyx-canvas"
  "qwanyx-memory"
  "qwanyx-thot"
  "qwanyx-workspace"
  "qwanyx-user-management"
  "qwanyx-app-core"
)

for pkg in "${PACKAGES[@]}"; do
  echo "=== Migrating $pkg ==="
  
  # Create tsup config
  cat > "packages/$pkg/tsup.config.ts" << 'EOF'
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false, // Temporarily disabled due to TypeScript issues
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  minify: false,
  treeshake: true,
  esbuildOptions(options) {
    options.jsx = 'automatic'
  }
})
EOF

  # Update package.json scripts
  cd "packages/$pkg"
  
  # Install tsup if not already installed
  if ! grep -q '"tsup":' package.json; then
    npm install --save-dev tsup
  fi
  
  cd ../..
  
  echo "✅ $pkg migrated"
done

echo "🎉 All packages migrated to tsup!"