"use client";

import React, { useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import type { Metadata } from "next";

// --- ANIMATION VARIANTS ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function ContactPage() {

  useEffect(() => {
    const scriptId = 'paperform-embed-script';
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.src = "https://paperform.co/__embed.min.js";
    script.id = scriptId;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  return (
    <div className="bg-white flex flex-col min-h-screen">
      {/* --- HERO SECTION --- */}
      <section className="relative w-full min-h-[45vh] flex items-center justify-center bg-[#0f172a] overflow-hidden px-4">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#267b9a] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-900 rounded-full mix-blend-screen filter blur-[120px] opacity-20 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent pointer-events-none" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="relative z-10 max-w-4xl mx-auto text-center pt-20 pb-10"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-xl mb-8">
            Get in Touch
          </h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="h-1.5 bg-gradient-to-r from-[#267b9a] to-cyan-400 rounded-full shadow-[0_0_20px_rgba(38,123,154,0.6)] mx-auto mb-10"
          />
          <p className="text-xl text-gray-100/90 leading-relaxed max-w-2xl mx-auto">
            Have a project in mind or just want to say hi? We'd love to hear from you.
          </p>
        </motion.div>
      </section>

      <section className="relative bg-zinc-50 py-16 lg:py-32 overflow-hidden">
        {/* 1. TOP WAVE */}
        <div className="absolute top-0 left-0 w-full h-48 overflow-hidden leading-[0] z-10 pointer-events-none">
          <svg className="relative block w-full h-full transform scale-x-110" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="contact-wave-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#267b9a" stopOpacity="0.15" />
                <stop offset="100%" stopColor="white" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="url(#contact-wave-gradient)"></path>
          </svg>
        </div>

        {/* 2. PARALLAX ACCENT BLOBS */}
        <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-[#267b9a]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] bg-[#40a9cf]/10 blur-[100px] rounded-full pointer-events-none" />

        {/* 3. MAIN CONTENT */}
        <div className="relative z-20 max-w-7xl mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start"
          >
            {/* LEFT COLUMN: Contact Info */}
            <motion.div variants={fadeInUp} className="lg:col-span-2 space-y-10">
              <div className="lg:sticky lg:top-32">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-zinc-900 leading-[1.1] mb-8 tracking-tight">
                  Let's start a <span className="bg-gradient-to-r from-[#267b9a] to-[#40a9cf] bg-clip-text text-transparent italic font-light">conversation.</span>
                </h2>
                <p className="text-zinc-500 text-lg md:text-xl max-w-sm leading-relaxed mb-12">
                  Whether you have a question about features, pricing, or need a demo, our team is ready to scale with you.
                </p>

                <div className="space-y-4">
                  {/* Actionable Email Item */}
                  <a href="mailto:station@confluencelocalmarketing.com" className="flex items-center p-6 bg-white/40 backdrop-blur-xl border border-zinc-200/50 rounded-[2rem] hover:bg-white hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-500 group">
                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-[#267b9a] text-white flex items-center justify-center shadow-lg shadow-[#267b9a]/20 transition-transform group-hover:scale-110">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-6">
                      <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Email Us</h3>
                      <p className="text-normal font-bold text-zinc-900 break-all group-hover:text-[#267b9a] transition-colors">station@confluencelocalmarketing.com</p>
                    </div>
                  </a>

                  {/* Actionable Location Item */}
                  <a href="https://maps.google.com/?q=2020+Calamos+Ct,Naperville,IL+60563" target="_blank" rel="noopener noreferrer" className="flex items-center p-6 bg-white/40 backdrop-blur-xl border border-zinc-200/50 rounded-[2rem] hover:bg-white hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-500 group">
                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="ml-6">
                      <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Our Office</h3>
                      <p className="text-normal font-bold text-zinc-900 group-hover:text-[#267b9a] transition-colors">Naperville, IL 60563, USA</p>
                    </div>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* RIGHT COLUMN: Paperform Embed */}
            <motion.div variants={fadeInUp} className="lg:col-span-3">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#267b9a]/20 to-[#40a9cf]/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative bg-white backdrop-blur-2xl rounded-[3rem] shadow-2xl shadow-zinc-200/50 border border-zinc-200 overflow-hidden p-2">
                  <div className="bg-zinc-50/50 rounded-[2.5rem] min-h-[500px] md:min-h-[600px] flex items-center justify-center">
                    <div className="w-full" data-paperform-id="smg9wu0g">
                      {/* Optional: Add a subtle loading state while script initializes */}
                      <p className="text-center text-zinc-400 font-medium animate-pulse">Initializing Secure Form...</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}