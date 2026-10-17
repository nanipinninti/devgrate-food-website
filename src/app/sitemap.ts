import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/siteConfig';
import { menu } from '@/data/menu';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: '/', changeFrequency: 'weekly' as const, priority: 1 },
    { url: '/menu', changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: '/our-story', changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: '/contact', changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: '/cart', changeFrequency: 'monthly' as const, priority: 0.3 },
  ];

  const dishRoutes = menu.map((dish) => ({
    url: `/menu/${dish.id}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...dishRoutes].map((route) => ({
    url: `${siteConfig.url}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
