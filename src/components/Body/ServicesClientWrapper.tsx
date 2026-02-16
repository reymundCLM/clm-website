"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    FaRobot, FaYoutube, FaSearch, FaChevronDown, FaCode,
    FaGlobe, FaLink, FaBrain, FaChartLine, FaMapMarkedAlt,
    FaStar, FaPenFancy, FaDesktop, FaUsers
} from "react-icons/fa";
import { ServicePageData } from "@/lib/api";

const getIconForSlug = (slug: string) => {
    const s = slug.toLowerCase();
    if (s.includes("youtube")) return <FaYoutube />;
    if (s.includes("generative") || s.includes("robot")) return <FaRobot />;
    if (s.includes("programmatic") || s.includes("globe")) return <FaGlobe />;
    if (s.includes("link")) return <FaLink />;
    if (s.includes("optimization") || s.includes("brain")) return <FaBrain />;
    if (s.includes("track") || s.includes("chart")) return <FaChartLine />;
    if (s.includes("local") || s.includes("map")) return <FaMapMarkedAlt />;
    if (s.includes("reputation") || s.includes("star")) return <FaStar />;
    if (s.includes("schema") || s.includes("code")) return <FaCode />;
    if (s.includes("content") || s.includes("pen")) return <FaPenFancy />;
    if (s.includes("dev") || s.includes("desktop")) return <FaDesktop />;
    if (s.includes("social") || s.includes("users")) return <FaUsers />;
    if (s.includes("technical")) return <FaCode />;
    if (s.includes("audit") || s.includes("scan")) return <FaSearch />;
    if (s.includes("strategy")) return <FaChartLine />;
    return <FaSearch />;
};

export default function ServicesClientWrapper({ initialServices }: { initialServices: ServicePageData[] }) {
    const [showAll, setShowAll] = useState(false);
    const displayedServices = showAll ? initialServices : initialServices.slice(0, 6);

    return (
        // motion.div layout on the wrapper ensures the whole container expands smoothly
        <motion.div layout className="relative">
            {/* Dynamic Background Blurs */}
            <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-[#267b9a]/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 -left-20 w-[600px] h-[600px] bg-[#40a9cf]/10 blur-[150px] rounded-full pointer-events-none" />

            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
            >
                <AnimatePresence mode="popLayout">
                    {displayedServices.map((service, index) => (
                        <motion.div
                            layout
                            key={service.documentId}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{
                                duration: 0.5,
                                delay: showAll ? (index - 6) * 0.05 : 0, // Only delay new items when expanding
                                ease: [0.23, 1, 0.32, 1]
                            }}
                        >
                            <Link href={`/services/${service.slug}`} className="block h-full">
                                <motion.div
                                    whileHover={{ y: -10 }}
                                    className="group relative h-full bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 hover:border-[#267b9a]/50 rounded-[2.5rem] p-8 transition-all duration-500 overflow-hidden"
                                >
                                    <div className="absolute -inset-px bg-gradient-to-br from-[#267b9a]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="relative z-10">
                                        <div className="w-14 h-14 flex items-center justify-center bg-zinc-800/50 border border-zinc-700/50 text-[#267b9a] text-2xl rounded-2xl mb-6 group-hover:bg-[#267b9a] group-hover:text-white group-hover:shadow-[0_0_20px_rgba(38,123,154,0.4)] transition-all duration-500">
                                            {getIconForSlug(service.slug)}
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-[#267b9a] transition-colors duration-300">
                                            {service.metaTitle}
                                        </h3>

                                        <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3 group-hover:text-zinc-400 transition-colors duration-300">
                                            {service.metaDescription}
                                        </p>

                                        <div className="mt-8 flex items-center gap-2 text-[#267b9a] text-xs font-bold uppercase tracking-widest opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                            Explore Service <span className="text-lg">→</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {initialServices.length > 6 && (
                <motion.div layout className="mt-20 text-center relative z-10">
                    <motion.button
                        layout
                        onClick={() => setShowAll(!showAll)}
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative flex items-center justify-center gap-3 bg-[#267b9a] text-white px-10 py-5 rounded-2xl font-bold transition-all duration-300 shadow-[0_15px_40px_-10px_rgba(38,123,154,0.5)] hover:shadow-[0_25px_50px_-12px_rgba(38,123,154,0.6)] mx-auto"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            {showAll ? "Show Less" : `View All ${initialServices.length} Services`}
                            <FaChevronDown
                                className={`transition-transform duration-500 text-xl ${showAll ? "rotate-180" : "group-hover:translate-y-1"}`}
                            />
                        </span>
                    </motion.button>
                </motion.div>
            )}
        </motion.div>
    );
}