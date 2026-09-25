/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ─── SEGURANÇA DE BUILD ─────────────────────────────────
  productionBrowserSourceMaps: false,
  poweredByHeader: false,

  eslint: {
    ignoreDuringBuilds: true,
  },

  // ─── COMPRESSÃO ─────────────────────────────────────────
  compress: true,

  // ─── SEGURANÇA DE HEADERS (complementa middleware.ts) ───
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(self)',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },

  // ─── IMAGENS OTIMIZADAS ────────────────────────────────
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
