"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { LandingPageData, getStrapiMedia } from "@/lib/api";

interface VideoHeroProps {
  data: LandingPageData | null;
}

/* ======================
    MOTION VARIANTS
====================== */

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const buttonVariant: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

const VideoHero: React.FC<VideoHeroProps> = ({ data }) => {
  if (!data) return null;

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      {/* Video Background */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        <video autoPlay loop muted playsInline className="h-full w-full object-cover opacity-50 scale-105">
          {/* 2. Wrap the url with the helper */}
          <source src={getStrapiMedia(data.heroBackgound.url) || ""} type={data.heroBackgound.mime} />
        </video>
      </div>

      {/* Modern Gradient Overlays */}
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/70 via-transparent to-black" />
      <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-black/10 to-black/90" />

      {/* Content Container */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-30 flex max-w-6xl flex-col items-center px-6 text-center sm:px-8"
      >
        {/* Eyebrow */}
        <motion.div variants={fadeUp} className="mb-6">
          <span className="inline-block rounded-full border border-[#c65957]/30 bg-[#c65957]/10 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-[#c65957] backdrop-blur-md">
            {data.eyebrow}
          </span>
        </motion.div>

        {/* Headline - Fixed Line Breaks */}
        <motion.h1
          variants={fadeUp}
          className="text-balance text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          <span className="block leading-[1.1]">
            The <span className="bg-gradient-to-r from-[#267b9a] to-[#40a9cf] bg-clip-text text-transparent">AI-First SEO Platform</span>
          </span>
          <span className="mt-2 block leading-[1.1]">
            Built for Real Business Growth
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={fadeUp}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400 md:text-xl"
        >
          {data.description}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={container}
          className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row"
        >
          {data.button.map((btn, index) => {
            const isPrimary = index === 0;
            const label = isPrimary ? btn.label : "Speak to an Expert";
            const href = btn?.href?.trim() ? btn.href : "tel:630-447-8434";

            return (
              <motion.a
                key={btn.id}
                href={href}
                target={btn.isExternal ? "_blank" : "_self"}
                rel={btn.isExternal ? "noopener noreferrer" : undefined}
                variants={buttonVariant}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                className={`
          group relative flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-bold transition-all duration-300
          ${isPrimary
                    ? "bg-[#267b9a] text-white shadow-[0_10px_40px_-10px_rgba(38,123,154,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(38,123,154,0.6)]"
                    : "border-2 border-[#267b9a]/40 bg-zinc-900 text-white hover:bg-[#267b9a] hover:border-[#267b9a] hover:shadow-[0_20px_40px_-10px_rgba(38,123,154,0.4)]"
                  }
        `}
              >
                {label}
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </motion.a>
            );
          })}
        </motion.div>
      </motion.div>


      <div className="absolute -bottom-48 left-1/2 z-20 h-100 w-[100%] -translate-x-1/2 bg-[#267b9a]/50 blur-[250px] opacity-70" />    </section>
  );
};

export default VideoHero;