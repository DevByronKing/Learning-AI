import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/checkout', '/api/webhooks'],
    },
    sitemap: 'https://learningai.app/sitemap.xml',
  };
}
