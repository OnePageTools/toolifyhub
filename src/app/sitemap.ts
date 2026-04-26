import { MetadataRoute } from 'next'
import { tools } from '@/lib/tools';

const articles = [
    { href: '/blog/how-to-build-a-free-resume-online' },
    { href: '/blog/best-free-grammar-checker-tools-2026' },
    { href: '/blog/how-to-generate-qr-code-free' },
    { href: '/blog/free-weather-checker-online' },
    { href: '/blog/best-free-pdf-compressor-tools' },
    { href: '/blog/how-to-compress-pdf-online-free' },
    { href: '/blog/how-to-remove-background-from-image-free' },
    { href: '/blog/best-free-online-tools-for-students-2026' },
];
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://toolifyhub.com';

  const staticPages: MetadataRoute.Sitemap = [
    {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
    },
    {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
    },
    {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
    },
    {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
    },
    {
        url: `${baseUrl}/privacy-policy`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.5,
    },
    {
        url: `${baseUrl}/terms-of-service`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.5,
    },
  ];

  const toolPages: MetadataRoute.Sitemap = tools
    .filter(tool => tool.implemented)
    .map((tool) => ({
      url: `${baseUrl}${tool.href}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  const blogPages: MetadataRoute.Sitemap = articles.map(article => ({
      url: `${baseUrl}${article.href}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
  }));

  return [...staticPages, ...toolPages, ...blogPages];
}
