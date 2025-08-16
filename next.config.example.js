// next.config.js for subdirectory deployment
module.exports = {
  // Only needed if serving from subdirectory like qwanyx.com/autodin
  basePath: process.env.BASE_PATH || '', // Set BASE_PATH=/autodin for subdirectory
  
  // Asset prefix for CDN
  assetPrefix: process.env.ASSET_PREFIX || '',
  
  // Your other config...
  reactStrictMode: true,
}

// Usage:
// Domain access (autodin.be): BASE_PATH="" (empty)
// Subdirectory (qwanyx.com/autodin): BASE_PATH="/autodin"