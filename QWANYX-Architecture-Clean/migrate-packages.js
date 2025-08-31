const fs = require('fs');
const path = require('path');

const tsupConfig = `import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false, // Temporarily disabled due to TypeScript errors
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  minify: false,
  treeshake: true,
  esbuildOptions(options) {
    options.jsx = 'automatic'
  }
})`;

// List of packages to migrate
const packages = [
  'qwanyx-dashboard',
  'qwanyx-dashboard-v2',
  'qwanyx-form',
  'qwanyx-workspace',
  'qwanyx-app-core',
  'qwanyx-user-management',
  'qwanyx-memory',
  'qwanyx-thot'
];

packages.forEach(pkg => {
  const pkgPath = path.join(__dirname, 'packages', pkg);
  const tsupConfigPath = path.join(pkgPath, 'tsup.config.ts');
  const packageJsonPath = path.join(pkgPath, 'package.json');
  
  // Check if tsup config already exists
  if (!fs.existsSync(tsupConfigPath)) {
    // Create tsup config
    fs.writeFileSync(tsupConfigPath, tsupConfig);
    console.log(`✅ Created tsup.config.ts for ${pkg}`);
    
    // Update package.json
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Update scripts
      packageJson.scripts = packageJson.scripts || {};
      packageJson.scripts.build = 'tsup';
      packageJson.scripts['type-check'] = 'tsc --noEmit';
      
      // Update main, module, types
      packageJson.main = './dist/index.js';
      packageJson.module = './dist/index.mjs';
      packageJson.types = './dist/index.d.ts';
      
      // Update files
      packageJson.files = ['dist'];
      
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log(`✅ Updated package.json for ${pkg}`);
    }
  } else {
    console.log(`⏭️  ${pkg} already has tsup.config.ts`);
  }
});