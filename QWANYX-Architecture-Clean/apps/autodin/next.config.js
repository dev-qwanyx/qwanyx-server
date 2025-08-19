/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@qwanyx/ui', '@qwanyx/auth', '@qwanyx/dashboard', '@qwanyx/dashboard-v2', '@qwanyx/user-management'],
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  
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