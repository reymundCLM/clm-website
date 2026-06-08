"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import DesktopNavbar from "./DesktopNavBar";
import MobileNavbar from "./MobileNavBar";
import { NavigationItem } from "@/lib/api";
import Image from "next/image";

const STRAPI_BASE_URL = "https://strapi.confluencelocalmarketing.com";

interface HeaderLayoutProps {
  navItems: NavigationItem[];
  logoUrl?: string | null;
  siteName?: string;
}

const HeaderLayout: React.FC<HeaderLayoutProps> = ({ navItems, logoUrl, siteName }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fullLogoUrl = logoUrl 
    ? (logoUrl.startsWith('http') ? logoUrl : `${STRAPI_BASE_URL}${logoUrl}`)
    : "/ConfluenceLogo.webp"; 

  return (
    <>
      <header 
        className={`sticky top-0 z-[60] w-full transition-all duration-500 bg-[#0f172a] ${
          scrolled 
            ? "bg-opacity-80 backdrop-blur-xl border-b border-white/5 py-2 shadow-2xl shadow-black/20" 
            : "bg-opacity-100 py-4"
        }`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 md:px-10">
          
          {/* Logo Section */}
          <Link href="/" className="relative z-[70] flex items-center transition-transform hover:scale-105 active:scale-95">
            <Image
              width={282}
              height={64}
              src={fullLogoUrl}
              alt={siteName || "Confluence Logo"}
              className="h-12 w-auto object-contain md:h-14" 
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden xl:block">
            <DesktopNavbar navItems={navItems} />
          </div>

          {/* Action Button & Mobile Toggle */}
          <div className="flex items-center gap-6">
            <Link 
              href="tel:630-447-8434"
              className="hidden sm:block rounded-full bg-[#267b9a] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-[#267b9a]/20 transition-all hover:bg-[#358ba1] hover:shadow-[#267b9a]/40 hover:-translate-y-0.5"
            >
              Get Started
            </Link>

            {/* Custom Hamburger Menu */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="xl:hidden relative z-[70] flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus:outline-none group"
              aria-label="Toggle Menu"
            >
              <span className={`h-0.5 w-6 transition-all duration-300 bg-white ${isMobileOpen ? "rotate-45 translate-y-2" : "opacity-90"}`}></span>
              <span className={`h-0.5 w-6 transition-all duration-300 bg-white ${isMobileOpen ? "opacity-0" : "opacity-90"}`}></span>
              <span className={`h-0.5 w-6 transition-all duration-300 bg-white ${isMobileOpen ? "-rotate-45 -translate-y-2" : "opacity-90"}`}></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Moved outside the header tag */}
      {isMobileOpen && (
        <MobileNavbar 
          navItems={navItems} 
          onClose={() => setIsMobileOpen(false)} 
        />
      )}
    </>
  );
};

export default HeaderLayout;