/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: 'loose',
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Handle ESM modules
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });
    
    return config;
  },
  // Production settings
  // Standalone mode: Creates a minimal server with all dependencies
  // Note: Run "npm run build" to automatically copy static files via postbuild script
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  generateEtags: false,
};

module.exports = nextConfig; 