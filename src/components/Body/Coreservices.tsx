import { getAllServices, getNavigation, flattenNavTree } from "@/lib/api";
import ServicesClientWrapper from "./ServicesClientWrapper";

export default async function CoreServices() {
  const [servicesData, navItems] = await Promise.all([
    getAllServices(),
    getNavigation()
  ]);

  const flatNav = flattenNavTree(navItems);

  // Pair each service with its official nested path from navigation
  const servicesWithPaths = servicesData.map((service) => {
    const navMatch = flatNav.find((nav) => nav.path && nav.path.endsWith(`/${service.slug}`));
    return {
      ...service,
      fullPath: navMatch ? navMatch.path : `/services/${service.slug}`
    };
  });

  return (
    <section className="relative bg-[#050505] py-24 lg:py-40 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-40 z-40 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-50/40 via-transparent to-transparent opacity-30" />
        <div className="absolute inset-0 backdrop-blur-3xl [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      </div>
      
      <div className="relative z-30 max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter">
            Our <span className="bg-gradient-to-r from-[#267b9a] to-[#40a9cf] bg-clip-text text-transparent italic font-light">Core Services</span>
          </h2>
        </div>

        {/* Note: Update ServicesClientWrapper to use 'fullPath' for the <Link> href */}
        <ServicesClientWrapper initialServices={servicesWithPaths} />
      </div>
    </section>
  );
}