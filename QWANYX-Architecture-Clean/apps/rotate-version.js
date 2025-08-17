#!/usr/bin/env node

/**
 * Version Rotation Script for App Development
 * Usage: node rotate-version.js [app-name]
 * 
 * This will:
 * 1. Find the highest version number for the app
 * 2. Rename current app to app-XXX (next version)
 * 3. Copy the latest version to app (working directory)
 */

const fs = require('fs');
const path = require('path');

const appName = process.argv[2] || 'autodin';
const appsDir = __dirname;

// Find all versions of the app
const versions = fs.readdirSync(appsDir)
  .filter(dir => dir.startsWith(`${appName}-`) && /\d{3}$/.test(dir))
  .map(dir => parseInt(dir.split('-').pop()))
  .sort((a, b) => b - a);

const latestVersion = versions[0] || 0;
const nextVersion = String(latestVersion + 1).padStart(3, '0');

const currentAppPath = path.join(appsDir, appName);
const nextVersionPath = path.join(appsDir, `${appName}-${nextVersion}`);

// Check if current app exists
if (fs.existsSync(currentAppPath)) {
  console.log(`📦 Rotating ${appName} to ${appName}-${nextVersion}`);
  
  // Rename current to next version
  fs.renameSync(currentAppPath, nextVersionPath);
  console.log(`✅ Saved current work as ${appName}-${nextVersion}`);
  
  // Copy the latest version back to working directory
  const copyRecursive = (src, dest) => {
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
      fs.mkdirSync(dest, { recursive: true });
      fs.readdirSync(src).forEach(child => {
        copyRecursive(path.join(src, child), path.join(dest, child));
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  };
  
  copyRecursive(nextVersionPath, currentAppPath);
  console.log(`✅ Created fresh ${appName} from ${appName}-${nextVersion}`);
  console.log(`\n🚀 You can now work on ${appName}/`);
  console.log(`💾 Your previous work is saved in ${appName}-${nextVersion}/`);
} else {
  // No current app, create from latest version or from scratch
  if (latestVersion > 0) {
    const latestVersionPath = path.join(appsDir, `${appName}-${String(latestVersion).padStart(3, '0')}`);
    console.log(`📦 Creating ${appName} from ${appName}-${String(latestVersion).padStart(3, '0')}`);
    
    const copyRecursive = (src, dest) => {
      const stats = fs.statSync(src);
      if (stats.isDirectory()) {
        fs.mkdirSync(dest, { recursive: true });
        fs.readdirSync(src).forEach(child => {
          // Skip node_modules to make it faster
          if (child === 'node_modules') return;
          copyRecursive(path.join(src, child), path.join(dest, child));
        });
      } else {
        fs.copyFileSync(src, dest);
      }
    };
    
    copyRecursive(latestVersionPath, currentAppPath);
    console.log(`✅ Created ${appName} from latest version`);
  } else {
    console.log(`❌ No ${appName} directory found and no versions to restore from`);
    console.log(`💡 Create ${appName}/ first, then use this script to manage versions`);
  }
}

// List all versions
console.log('\n📚 Available versions:');
fs.readdirSync(appsDir)
  .filter(dir => dir.startsWith(`${appName}-`) && /\d{3}$/.test(dir))
  .sort()
  .forEach(version => {
    const stats = fs.statSync(path.join(appsDir, version));
    const date = stats.mtime.toLocaleDateString();
    console.log(`   - ${version} (modified: ${date})`);
  });