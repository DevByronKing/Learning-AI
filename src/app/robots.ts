import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/*',
        '/admin/*',
        '/_next/*',
        '/.well-known/*',
        '/wp-admin',
        '/wp-login.php',
        '/xmlrpc.php',
        '/*.sql',
        '/*.bak',
        '/*.zip',
      ],
    },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL || 'https://argus.app.br'}/sitemap.xml`,
  };
}
