import { MetadataRoute } from 'next';
import { getAllServices } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await getAllServices();
  const serviceEntries = services.map((service) => ({
    url: `https://www.confluencelocalmarketing.com/services/${service.slug}`,
    lastModified: new Date(),
  }));

  return [
    { url: 'https://www.confluencelocalmarketing.com/', lastModified: new Date() },
    { url: 'https://www.confluencelocalmarketing.com/meet-the-team', lastModified: new Date() },
    { url: 'https://www.confluencelocalmarketing.com/contact-us', lastModified: new Date() },
    ...serviceEntries,
  ];
}