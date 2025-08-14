/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Environment variables
  env: {
    PORT: process.env.PORT || '4000',
    API_URL: process.env.API_URL || 'http://localhost:5002',
  },
  
  // Output as standalone for easier deployment
  output: 'standalone',
  
  // Image optimization
  images: {
    domains: ['localhost', '135.181.72.183'],
    unoptimized: true,
  },
  
  // Optional: Configure for subdirectory deployment
  // basePath: process.env.BASE_PATH || '',
}

module.exports = nextConfig