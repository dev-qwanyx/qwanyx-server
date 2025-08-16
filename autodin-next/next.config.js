/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,
  
  // Set port via environment variable
  env: {
    PORT: process.env.PORT || '3001',
    API_URL: process.env.API_URL || 'http://localhost:5002',
    SITE_NAME: 'Autodin',
  },
  
  // Optional: Configure for subdirectory deployment
  // Uncomment if deploying at qwanyx.com/autodin
  // basePath: process.env.BASE_PATH || '',
  
  
  // Output standalone for easier deployment
  output: 'standalone',
  
  // Image optimization
  images: {
    domains: ['localhost', '135.181.72.183'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
}

module.exports = nextConfig