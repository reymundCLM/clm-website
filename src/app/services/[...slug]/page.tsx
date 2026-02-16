import { notFound, redirect } from "next/navigation";
import { getServicePageBySlug, getNavigation, flattenNavTree } from "../../../lib/api";
import BlockRenderer from "../../../components/Renderer/ServiceBlockRenderer";

export default async function ServiceDynamicPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const currentPath = `/services/${resolvedParams.slug.join('/')}`;
  const slugString = resolvedParams.slug[resolvedParams.slug.length - 1];

  const [data, navItems] = await Promise.all([
    getServicePageBySlug(slugString),
    getNavigation()
  ]);

  if (!data) notFound();

  const flatNav = flattenNavTree(navItems);
  const canonicalMatch = flatNav.find(n => n.path && n.path.endsWith(`/${slugString}`));

  if (canonicalMatch && canonicalMatch.path !== currentPath) {
    redirect(canonicalMatch.path);
  }
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.confluencelocalmarketing.com" },
      { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://www.confluencelocalmarketing.com/services" },
      { "@type": "ListItem", "position": 3, "name": data.metaTitle, "item": `https://www.confluencelocalmarketing.com${currentPath}` }
    ]
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <BlockRenderer blocks={data.servicePage} />
    </main>
  );
}