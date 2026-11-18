import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dandeliexpedition.com';
  return ['', '/stays'].map(path => ({
    url: origin + path + '/',
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path ? 0.9 : 1,
  }));
}
