"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { CaseStudyData } from "@/lib/api";

// --- ANIMATION VARIANTS ---
const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
    }
};

const staggerContainer: Variants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
};

interface CaseStudiesGridProps {
    caseStudies: CaseStudyData[];
}

export default function CaseStudiesGrid({ caseStudies }: CaseStudiesGridProps) {
    return (
        <>
            {/* --- HERO SECTION --- */}
            <section className="relative w-full min-h-[60vh] flex items-center justify-center bg-[#0f172a] overflow-hidden px-4">
                {/* Animated Tech Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-30%] right-[-10%] w-[800px] h-[800px] bg-[#267b9a] rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-pulse" style={{ animationDuration: '4s' }} />
                    <div className="absolute bottom-[-30%] left-[-10%] w-[600px] h-[600px] bg-purple-900 rounded-full mix-blend-screen filter blur-[150px] opacity-25" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] contrast-150 brightness-100" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />
                </div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="relative z-10 max-w-4xl mx-auto text-center py-24"
                >
                    <span className="inline-block px-4 py-2 mb-6 text-xs font-bold tracking-[0.2em] text-cyan-300 uppercase bg-cyan-900/30 border border-cyan-500/30 rounded-full backdrop-blur-md">
                        Proven Results
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight drop-shadow-2xl mb-8">
                        Case Studies
                    </h1>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: 96 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="h-1.5 bg-gradient-to-r from-[#267b9a] to-cyan-400 rounded-full shadow-[0_0_20px_rgba(38,123,154,0.6)] mx-auto mb-10"
                    />
                    <p className="text-xl text-slate-300/90 leading-relaxed max-w-2xl mx-auto">
                        See how we leverage AI-First SEO and technical mastery to drive explosive growth for businesses across competitive industries.
                    </p>
                </motion.div>
            </section>

            {/* --- MAIN GRID SECTION --- */}
            <section className="relative w-full py-24 overflow-hidden">
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#267b9a]/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    {caseStudies.length === 0 ? (
                        <div className="text-center text-slate-500 py-12 font-medium">Check back soon for our latest case studies.</div>
                    ) : (
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            className="grid lg:grid-cols-2 gap-10"
                        >
                            {caseStudies.map((study) => (
                                <motion.div
                                    key={study.id}
                                    variants={fadeInUp}
                                    className="group relative bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm hover:shadow-[0_20px_50px_rgba(38,123,154,0.1)] transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col justify-between"
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#267b9a] to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                                    <div>
                                        <div className="flex items-center justify-between mb-8">
                                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-[#267b9a] text-xs font-bold uppercase tracking-widest">
                                                {study.category}
                                            </span>
                                            {study.icon?.iconData && (
                                                <div className="w-12 h-12 flex items-center justify-center bg-[#f0f9fb] text-[#267b9a] text-xl rounded-2xl group-hover:bg-[#267b9a] group-hover:text-white transition-colors duration-300">
                                                    <svg
                                                        className="w-6 h-6"
                                                        fill="currentColor"
                                                        viewBox={`0 0 ${(study.icon.iconData as any).width || study.icon.width || 24} ${(study.icon.iconData as any).height || study.icon.height || 24}`}
                                                        dangerouslySetInnerHTML={{
                                                            __html: typeof study.icon.iconData === 'string'
                                                                ? study.icon.iconData
                                                                : (study.icon.iconData as any).iconData
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">
                                            {study.client}
                                        </h3>
                                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 tracking-tight leading-snug group-hover:text-[#267b9a] transition-colors">
                                            {study.title}
                                        </h2>
                                        <p className="text-slate-600 text-base leading-relaxed mb-8">
                                            {study.description}
                                        </p>
                                    </div>

                                    <div>
                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            {study.metrics?.map((metric) => (
                                                <div key={metric.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                                    <div className="text-2xl md:text-3xl font-black text-[#267b9a] mb-1">
                                                        {metric.value}
                                                    </div>
                                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                                        {metric.label}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <Link
                                            href={study.slug ? `/case-studies/${study.slug}` : "#"}
                                            className="inline-flex items-center gap-2 text-[#267b9a] font-bold text-sm uppercase tracking-widest group-hover:gap-4 transition-all"
                                        >
                                            Read Full Study <FaArrowRight />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* --- FOOTER CTA SECTION --- */}
            <section className="px-6 pb-24 relative overflow-hidden bg-zinc-50">
                <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-6xl mx-auto relative group">
                    <div className="relative overflow-hidden rounded-[3rem] bg-[#0f172a] shadow-[0_40px_80px_rgba(0,0,0,0.4)]">
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#267b9a] rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-pulse" />
                            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-900 rounded-full mix-blend-screen filter blur-[100px] opacity-30" />
                        </div>

                        <div className="relative z-10 px-10 py-24 md:px-24 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
                            <div className="flex-1">
                                <span className="inline-block px-4 py-2 mb-6 text-xs font-bold tracking-[0.2em] text-cyan-300 uppercase bg-cyan-900/30 border border-cyan-500/30 rounded-full backdrop-blur-md">
                                    Ready to scale?
                                </span>
                                <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
                                    Transform your marketing <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-[#267b9a]">into an AI powerhouse.</span>
                                </h2>
                                <p className="text-slate-400 text-lg max-w-xl">
                                    Join forward-thinking brands leveraging our proprietary frameworks. Let's make you our next case study.
                                </p>
                            </div>
                            <div className="shrink-0">
                                <Link href="/contact-us" className="group/btn relative inline-flex items-center justify-center">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-[#267b9a] to-cyan-400 rounded-xl blur opacity-40 group-hover/btn:opacity-75 transition duration-500" />
                                    <button className="relative px-12 py-6 bg-white text-[#0f172a] text-sm font-bold uppercase tracking-widest rounded-xl transition-all duration-300 transform group-hover/btn:-translate-y-1 group-active/btn:translate-y-0 flex items-center gap-3">
                                        Let's Talk Strategy
                                        <FaArrowRight className="w-4 h-4 text-[#267b9a] transition-transform group-hover/btn:translate-x-1" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>
        </>
    );
}