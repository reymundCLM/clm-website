import { MetadataRoute } from 'next';
import { getAllServices, getCaseStudies } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic data
  const services = await getAllServices();
  const caseStudies = await getCaseStudies();

  // Map dynamic services
  const serviceEntries = services.map((service) => ({
    url: `https://www.confluencelocalmarketing.com/services/${service.slug}`,
    lastModified: new Date(),
  }));

  // Map dynamic case studies
  const caseStudyEntries = caseStudies.map((study) => ({
    url: `https://www.confluencelocalmarketing.com/case-studies/${study.slug}`,
    lastModified: new Date(),
  }));

  // Define all static routes
  const staticRoutes = [
    '',
    '/meet-the-team',
    '/contact-us',
    '/technical-seo',
    '/confluence-ai',
    '/confluence-ai/confluence-ai-platform',
    '/case-studies',
    '/privacy-policy'
  ].map((route) => ({
    url: `https://www.confluencelocalmarketing.com${route}`,
    lastModified: new Date(),
  }));

  // Combine everything
  return [
    ...staticRoutes,
    ...serviceEntries,
    ...caseStudyEntries,
  ];
}