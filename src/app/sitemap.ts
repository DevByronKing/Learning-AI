import { MetadataRoute } from 'next';
import { getAllEditalSlugs } from '@/lib/editaisCatalog';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://aprovalens.ai';
  const now = new Date();

  // Rotas estáticas
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // Rotas dinâmicas de Programmatic SEO para cada edital
  const slugs = getAllEditalSlugs();
  slugs.forEach((slug) => {
    routes.push({
      url: `${baseUrl}/edital/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  });

  return routes;
}
