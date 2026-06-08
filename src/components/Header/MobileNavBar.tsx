"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { NavigationItem } from "@/lib/api";

interface MobileNavbarProps {
  navItems: NavigationItem[];
  onClose: () => void;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ navItems, onClose }) => {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] flex flex-col bg-[#0f172a] h-screen"
    >
      <div className="flex flex-col px-6 py-28 space-y-2 overflow-y-auto flex-1 custom-scrollbar">
        {navItems.map((item) => (
          <MobileNavItem key={item.id} item={item} onClose={onClose} depth={0} />
        ))}
      </div>

      <div className="p-6 bg-[#0f172a] border-t border-white/5">
        <Link
          href="tel:630-447-8434"
          onClick={onClose}
          className="flex items-center justify-center gap-3 w-full py-4 bg-[#267b9a] text-white font-bold rounded-2xl shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Speak to an Expert
        </Link>
      </div>
    </motion.div>
  );
};

const MobileNavItem: React.FC<{ item: NavigationItem; onClose: () => void; depth: number }> = ({ item, onClose, depth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.items && item.items.length > 0;

  return (
    <div className="flex flex-col">
      {hasChildren ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex justify-between items-center py-4 w-full text-left transition-all ${depth === 0 ? "border-b border-white/5" : ""}`}
        >
          <span className={`${depth === 0 ? "text-xl font-black uppercase tracking-widest" : "text-md font-medium"} ${isOpen ? 'text-[#267b9a]' : 'text-slate-100'}`}>
            {item.title}
          </span>
          <div className={`transition-transform duration-300 ${isOpen ? "rotate-180 text-[#267b9a]" : "text-slate-500"}`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </button>
      ) : (
        <Link
          href={item.path}
          onClick={onClose}
          className={`flex items-center py-4 w-full transition-all ${depth === 0 ? "border-b border-white/5 font-black uppercase tracking-widest text-xl" : "font-medium text-md text-slate-300 hover:text-white"}`}
        >
          {item.title}
        </Link>
      )}

      <AnimatePresence>
        {hasChildren && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden flex flex-col pl-4 border-l-2 border-[#267b9a]/30 ml-1"
          >
            {item.items.map((child) => (
              <MobileNavItem key={child.id} item={child} onClose={onClose} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileNavbar;