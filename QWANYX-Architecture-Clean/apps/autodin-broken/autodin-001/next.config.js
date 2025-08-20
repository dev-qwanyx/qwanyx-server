/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@qwanyx/ui'],
  
  // Optimisations pour production
  images: {
    domains: ['localhost', 'autodin.be'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Lazy loading et code splitting automatiques
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig