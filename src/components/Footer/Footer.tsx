import React from "react";
import { FaFacebook, FaLinkedin, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt, FaMapMarkedAlt, FaClock } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { getAllServices, getGlobalData } from "@/lib/api";

const STRAPI_BASE_URL = "https://ancient-crown-9dfaf5bb18.strapiapp.com";

const Footer = async () => {
  const currentYear = new Date().getFullYear();

  // Fetch services and global data (for logo) in parallel
  const [services, globalData] = await Promise.all([
    getAllServices(),
    getGlobalData(),
  ]);

  const quickLinks = [
    { name: "About Confluence", href: "/meet-the-team" },
    // { name: "Meet the Team", href: "/meet-the-team#meetOurTeam" },
    { name: "Technical SEO", href: "/technical-seo" },
    { name: "Confluence AI", href: "/confluence-ai" },
    // { name: "Capabilities", href: "#" },
    // { name: "SEO Case Studies", href: "#" },
  ];

  const socialLinks = [
    { name: "YouTube", href: "https://www.youtube.com/c/Confluencelocalmarketing", icon: <FaYoutube size={16} /> },
    { name: "Facebook", href: "https://www.facebook.com/Confluencelocalmarketing/", icon: <FaFacebook size={16} /> },
    { name: "LinkedIn", href: "https://www.linkedin.com/company/confluence-local-marketing", icon: <FaLinkedin size={16} /> },
    { name: "Maps", href: "https://www.google.com/maps/place/Confluence+Local+Marketing/@41.8052949,-88.2044818,17z/data=!3m1!4b1!4m6!3m5!1s0x880e57eff5fc1b93:0x67296514c59f316d!8m2!3d41.8052949!4d-88.2019069!16s%2Fg%2F11gxx60q18?entry=ttu&g_ep=EgoyMDI2MDIwMS4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D", icon: <FaMapMarkedAlt size={16} /> },
  ];

  const linkHighlightClass = "text-sm text-slate-400 hover:text-white hover:bg-[#267b9a]/20 px-3 py-1.5 -ml-3 rounded-md hover:translate-x-1 transition-all duration-300 inline-block font-medium";

  const formatServiceName = (name: string) => {
    if (!name) return "";
    return name.replace(/Services?|Agency|Consultant/gi, '').trim();
  };

  // Logic to determine the correct logo URL
  const logoUrl = globalData?.mainLogo?.url;
  const fullLogoUrl = logoUrl
    ? (logoUrl.startsWith('http') ? logoUrl : `${STRAPI_BASE_URL}${logoUrl}`)
    : "/ConfluenceLogo.webp"; // Fallback if Strapi data fails

  const siteName = globalData?.siteName || "Confluence Marketing Logo";

  return (
    <footer className="bg-[#0f172a] text-slate-300 border-t border-slate-800/50 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 py-16 lg:py-20 lg:px-10">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 text-left">

          <div className="flex flex-col items-start space-y-8 lg:col-span-1">
            <Link href="/" className="inline-block transition-transform hover:scale-105 duration-300 -ml-2">
              <Image
                src={fullLogoUrl}
                alt={siteName}
                width={200}
                height={54}
                className="h-12 w-auto object-contain"
              />
            </Link>

            <div className="space-y-4 text-sm text-slate-400">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-[#267b9a] mt-1 shrink-0" size={14} />
                <p>2020 Calamos Ct,<br />Naperville, IL 60563</p>
              </div>
              <div className="flex items-center gap-3">
                <FaClock className="text-[#267b9a] shrink-0" size={14} />
                <p>Mon-Fri: 9:00 AM – 5:00 PM</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-white hover:bg-[#267b9a] hover:border-[#267b9a] hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(38,123,154,0.4)] transition-all duration-300"
                >
                  <span className="sr-only">{social.name}</span>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 & 3: Services (Spans 2 columns, labels dynamically shortened) */}
          <div className="space-y-6 lg:col-span-2">
            <h3 className="text-white font-bold text-lg">Services</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1">
              {services.map((service) => {
                const rawName = service.metaTitle || service.slug;
                const shortName = formatServiceName(rawName);

                return (
                  <li key={service.id}>
                    <Link href={`/services/${service.slug}`} className={linkHighlightClass}>
                      {shortName}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 4: Quick Links (Combined Resources & Learn More) */}
          <div className="space-y-6 lg:col-span-1">
            <h3 className="text-white font-bold text-lg">Quick Links</h3>
            <ul className="space-y-1">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className={linkHighlightClass}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Contact Us */}
          <div className="space-y-6 lg:col-span-1">
            <h3 className="text-white font-bold text-lg">Contact Us</h3>
            <div className="space-y-5 text-sm text-slate-400">

              {/* Phone */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-white font-medium">
                  <FaPhone className="text-[#267b9a]" size={14} />
                  Phone:
                </div>
                <ul className="pl-6">
                  <li>
                    <a href="tel:6304478434" className={linkHighlightClass}>
                      🇺🇸 +1 630 447 8434
                    </a>
                  </li>
                </ul>
              </div>

              {/* Email */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-white font-medium">
                  <FaEnvelope className="text-[#267b9a]" size={14} />
                  Email:
                </div>
                <ul className="pl-6">
                  <li>
                    <Link href="/contact-us" className={linkHighlightClass}>
                      Contact Us Today
                    </Link>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Bar (Only ONE Privacy Policy exists here now) */}
        <div className="mt-20 pt-8 border-t border-slate-800/80 text-center">
          <p className="text-sm text-slate-500 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
            <span>© Copyright {currentYear} www.confluencelocalmarketing.com</span>
            <span className="hidden sm:inline">|</span>
            <span>All Rights Reserved</span>
            <span className="hidden sm:inline">|</span>
            <Link href="/privacy-policy" className="hover:text-white hover:underline transition-colors">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;