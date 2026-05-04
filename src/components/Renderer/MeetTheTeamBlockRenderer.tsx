"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants, AnimatePresence } from "framer-motion";

import {
  MeetTheTeamBlock,
  MeetTheTeamCardItem,
  ServiceRichTextNode,
  ServiceRichTextChild
} from "@/lib/api";

// --- INTERFACES ---
interface RendererProps {
  blocks: MeetTheTeamBlock[];
}

// --- ANIMATION VARIANTS ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

// --- RENDERER HELPER ---
const renderRichText = (nodes: (ServiceRichTextNode | ServiceRichTextChild)[], textColorClass: string = "text-slate-600") => {
  if (!nodes) return null;

  return nodes.map((node, index) => {
    if (node.type === 'text') {
      const textNode = node as any;
      let content: React.ReactNode = textNode.text;
      const isDarkBackground = textColorClass.includes("white");

      if (textNode.bold) content = <strong key="bold" className={`font-black ${isDarkBackground ? "text-white" : "text-slate-900"}`}>{content}</strong>;
      if (textNode.italic) content = <em key="italic" className="italic">{content}</em>;
      if (textNode.code) content = <code key="code" className="bg-slate-100 text-[#267b9a] px-1.5 py-0.5 rounded text-sm font-mono border border-slate-200">{content}</code>;

      return <span key={index}>{content}</span>;
    }

    const blockNode = node as any;

    switch (blockNode.type) {
      case 'paragraph':
        if (!blockNode.children.length || (blockNode.children.length === 1 && blockNode.children[0].text === "")) {
          return <div key={index} className="h-4" />;
        }
        return (
          <p key={index} className={`mb-6 text-[1.05rem] leading-8 ${textColorClass} last:mb-0`}>
            {renderRichText(blockNode.children, textColorClass)}
          </p>
        );

      case 'heading':
        const level = blockNode.level || 3;
        const headingColor = textColorClass.includes("white") ? "text-white" : "text-slate-900";
        const Tag = `h${level}` as React.ElementType;
        const size = level === 1 ? 'text-4xl md:text-5xl' : level === 2 ? 'text-3xl md:text-4xl' : 'text-2xl';

        return (
          <Tag key={index} className={`${size} font-black mt-8 mb-4 ${headingColor} tracking-tight`}>
            {renderRichText(blockNode.children, textColorClass)}
          </Tag>
        );

      case 'list':
        const isOrdered = blockNode.format === 'ordered';
        const ListTag = isOrdered ? 'ol' : 'ul';
        const listClass = isOrdered
          ? "list-decimal ml-6 mb-8 space-y-2"
          : "list-disc ml-6 mb-8 space-y-2 marker:text-[#267b9a]";

        return (
          <ListTag key={index} className={`${listClass} ${textColorClass}`}>
            {renderRichText(blockNode.children, textColorClass)}
          </ListTag>
        );

      case 'list-item':
        return (
          <li key={index} className="pl-2 leading-relaxed">
            {renderRichText(blockNode.children, textColorClass)}
          </li>
        );

      default: return null;
    }
  });
};

// --- TEAM CARD COMPONENT (Compact + Water Modal) ---
const TeamCard = ({ card }: { card: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const altText = card.image?.alternativeText || card.title || "Team Member";

  // Updated check: Strapi Cloud provides the URL directly in card.image.url
  const hasImage = card.image && card.image.url;
  const hasIcon = card.icon && card.icon.iconData;

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  // Helper function to render SVG icons correctly using API dimensions
  const renderIcon = (containerClassName: string) => (
    <div className={containerClassName}>
      <svg
        viewBox={`0 0 ${card.icon.width} ${card.icon.height}`}
        className="w-full h-full"
        fill="currentColor"
        dangerouslySetInnerHTML={{ __html: card.icon.iconData }}
      />
    </div>
  );

  return (
    <>
      <motion.div
        layoutId={`card-container-${card.id}`}
        onClick={() => setIsOpen(true)}
        variants={fadeInUp}
        // FIX: Only allow hover scaling when the modal is closed to prevent 
        // the "stuck" shrinking effect when the mouse is over the closing card.
        // whileHover={!isOpen ? { y: -5 } : {}}
        // transition={{
        //   layout: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
        // }}
        className="group relative flex flex-col items-center p-8 bg-white rounded-[2.5rem] shadow-md hover:shadow-2xl border border-slate-100 cursor-pointer-none transition-all duration-500 overflow-hidden"
      >
        {/* --- CARD BLOBS --- */}
        <motion.div
          animate={{ borderRadius: ["40% 60% 70% 30%", "60% 40% 30% 70%", "40% 60% 70% 30%"] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-8 -left-8 w-24 h-24 bg-[#267b9a]/10 pointer-events-none group-hover:bg-[#267b9a]/20 transition-colors"
        />
        <motion.div
          animate={{ borderRadius: ["30% 70% 60% 40%", "50% 50% 30% 70%", "30% 70% 60% 40%"] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute -bottom-8 -right-8 w-28 h-28 bg-[#267b9a]/5 pointer-events-none group-hover:bg-[#267b9a]/15 transition-colors"
        />
        <motion.div
          animate={{ borderRadius: ["20% 80% 20% 80%", "80% 20% 80% 20%", "20% 80% 20% 80%"], rotate: [0, 90, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-4 -right-6 w-16 h-16 bg-cyan-400/10 pointer-events-none group-hover:bg-cyan-400/20 transition-colors blur-lg"
        />
        <motion.div
          animate={{ borderRadius: ["60% 40% 50% 50%", "40% 60% 30% 70%", "60% 40% 50% 50%"], scale: [1, 1.1, 1] }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute bottom-10 -left-4 w-12 h-12 bg-[#267b9a]/5 pointer-events-none group-hover:bg-[#267b9a]/15 transition-colors"
        />
        <motion.div
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.02, 0.08, 0.02] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/3 left-1/3 w-32 h-32 rounded-full bg-cyan-600/5 pointer-events-none blur-2xl"
        />

        {/* Compact Avatar with Pulse Effect */}
        <div className="relative w-32 h-32 mb-6 z-10 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-[#267b9a] opacity-0 group-hover:animate-ping" />
          <div className="relative w-28 h-28 rounded-full border-[3px] border-white shadow-lg overflow-hidden bg-slate-50 flex items-center justify-center">
            {hasImage ? (
              <Image
                src={card.image.url}
                alt={card.title}
                fill
                className="object-cover"
                unoptimized
              />
            ) : hasIcon ? (
              renderIcon("w-full h-full flex items-center justify-center p-6 text-[#267b9a]")
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#267b9a] font-bold text-2xl">
                {card.title?.[0]}
              </div>
            )}
          </div>
        </div>

        <div className="text-center z-10">
          <h3 className="text-[#267b9a] text-xl font-black mb-1 tracking-tight">{card.title}</h3>
          {card.position && (
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{card.position}</p>
          )}
        </div>

        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 text-[#267b9a] font-bold text-[10px] uppercase tracking-widest">
          View Profile →
        </div>
      </motion.div>

      {/* --- THE MODAL --- */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-[#0f172a]/90 backdrop-blur-xl"
            />

            <motion.div
              layoutId={`card-container-${card.id}`}
              className="relative w-full max-w-4xl bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible"
            >
              {/* --- CLOSE BUTTON WITH DARK TEAL ANIMATED BLOB --- */}
              <div className="absolute top-6 right-6 z-50">
                {/* Background Glow Blob */}
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "60% 40% 40% 60% / 60% 60% 40% 40%", "30% 70% 70% 30% / 30% 30% 70% 70%"],
                    rotate: [0, 90, 0]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-[#1a5a73] opacity-60 blur-xl scale-125"
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className="relative w-12 h-12 bg-white text-[#267b9a] hover:bg-[#267b9a] hover:text-white rounded-full flex items-center justify-center transition-colors shadow-lg group"
                >
                  <svg className="w-6 h-6 transform transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Left Side: Circular Image/Icon with Blobs */}
              <div className="w-full md:w-2/5 relative min-h-[300px] md:h-auto bg-slate-50 border-r border-slate-100 flex items-center justify-center overflow-hidden">
                <motion.div
                  animate={{ borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "60% 40% 40% 60% / 60% 60% 40% 40%"], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute w-[140%] h-[140%] bg-[#267b9a]/5 pointer-events-none"
                />
                <motion.div
                  animate={{ borderRadius: ["50% 50% 20% 80% / 25% 80% 20% 67%", "67% 20% 80% 25% / 80% 20% 67% 25%"] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute w-64 h-64 bg-[#267b9a]/10 pointer-events-none blur-xl"
                />
                <motion.div
                  animate={{ y: [-10, 10, -10], x: [5, -5, 5] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-10 right-10 w-32 h-32 bg-cyan-300/10 rounded-full blur-2xl pointer-events-none"
                />

                <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full border-[6px] border-white shadow-2xl z-10 bg-white">
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    {hasImage ? (
                      <Image
                        src={card.image.url}
                        alt={altText}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : hasIcon ? (
                      renderIcon("w-full h-full flex items-center justify-center p-10 text-[#267b9a]")
                    ) : (
                      <div className="w-full h-full bg-slate-200 flex items-center justify-center text-[#267b9a] font-bold text-5xl">
                        {card.title?.[0]}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side: Bio */}
              <div className="w-full md:w-3/5 p-8 md:p-14 flex flex-col justify-center bg-white relative z-10">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="relative z-20">
                  <span className="inline-block text-[#267b9a] font-black uppercase tracking-[0.3em] text-[10px] mb-4">
                    {card.position || "Team Member"}
                  </span>
                  <h2 className="text-4xl font-black text-[#0f172a] mb-6 tracking-tight leading-none">
                    {card.title}
                  </h2>
                  <div className="w-20 h-1.5 mb-8 rounded-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#267b9a] to-cyan-400" />
                    <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-full h-full" />
                  </div>
                  <div className="relative w-full mb-10 p-6 rounded-2xl overflow-hidden group/wave">
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                      <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute top-0 left-0 w-[200%] h-full flex items-end">
                        <svg className="w-full h-full text-[#267b9a] fill-current" viewBox="0 0 1440 320" preserveAspectRatio="none">
                          <path fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                        </svg>
                      </motion.div>
                    </div>
                    <div className="prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed italic relative z-10">
                      {card.description}
                    </div>
                  </div>
                  <Link href="/contact-us" className="inline-block px-8 py-4 bg-[#267b9a] text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-[#0f172a] transition-all transform hover:-translate-y-1 shadow-lg shadow-[#267b9a]/20">
                    Connect with {card.title.split(' ')[0]}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- MAIN RENDERER ---

export default function MeetTheTeamRenderer({ blocks }: RendererProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleHashChange = () => {
      const id = window.location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  if (!blocks || blocks.length === 0) return null;

  const heroImage = blocks.find((b) => b.__component === "elements.background-image");
  const heroHeading = blocks.find((b) => b.__component === "elements.heading");
  const heroText = blocks.find((b) => b.__component === "elements.rich-text");
  const heroButton = blocks.find((b) => b.__component === "elements.button");

  const contentBlocks = blocks.filter(b =>
    b !== heroImage &&
    b !== heroHeading &&
    b !== heroText &&
    b !== heroButton
  );

  const processedBlocks: any[] = [];
  let cardBuffer: MeetTheTeamCardItem[] = [];

  contentBlocks.forEach((block) => {
    if (block.__component === "elements.card-item") {
      cardBuffer.push(block as MeetTheTeamCardItem);
    } else {
      if (cardBuffer.length > 0) {
        processedBlocks.push({
          __component: "custom.card-grid",
          cards: [...cardBuffer],
        });
        cardBuffer = [];
      }
      processedBlocks.push(block);
    }
  });

  if (cardBuffer.length > 0) {
    processedBlocks.push({
      __component: "custom.card-grid",
      cards: [...cardBuffer],
    });
  }

  const buttonProps = heroButton as any;

  return (
    <div className="bg-white flex flex-col min-h-screen font-sans">

      {/* --- HERO BANNER --- */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center bg-[#0f172a] overflow-hidden px-4">

        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#267b9a] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-900 rounded-full mix-blend-screen filter blur-[120px] opacity-20 pointer-events-none" />

        {heroImage && heroImage.__component === 'elements.background-image' && heroImage.background?.url && (
          <div className="absolute inset-0 w-full h-full z-0">
            <Image
              src={heroImage.background.url}
              alt={heroImage.background.alternativeText || "Hero Background"}
              fill
              className="object-cover opacity-40 mix-blend-overlay"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/90 to-transparent" />
          </div>
        )}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="relative z-10 max-w-4xl mx-auto text-center py-20"
        >
          {heroHeading && heroHeading.__component === 'elements.heading' && (
            <>
              <h1 className="text-4xl md:text-7xl font-black text-white leading-tight tracking-tight drop-shadow-2xl mb-8">
                {heroHeading.heading}
              </h1>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 96 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-1.5 bg-gradient-to-r from-[#267b9a] to-cyan-400 rounded-full shadow-[0_0_20px_rgba(38,123,154,0.6)] mx-auto mb-10"
              />            </>
          )}

          {heroText && heroText.__component === 'elements.rich-text' && (
            <div className="prose prose-lg prose-invert max-w-none text-slate-300 leading-relaxed mb-10">
              {renderRichText(heroText.richText, "text-white")}
            </div>
          )}

          {buttonProps && buttonProps.label && (
            <Link
              href={buttonProps.href || "#"}
              className="inline-flex items-center justify-center px-10 py-5 text-[13px] font-black uppercase tracking-[0.15em] bg-[#267b9a] text-white rounded-lg transition-all duration-300 hover:bg-white hover:text-[#0f172a] shadow-xl hover:shadow-[#267b9a]/40 transform hover:-translate-y-1"
            >
              {buttonProps.label}
            </Link>
          )}
        </motion.div>
      </section>

      {/* --- MAIN CONTENT --- */}
      <div className="grow w-full py-24 overflow-hidden bg-slate-50/50">
        {processedBlocks.map((block, index) => {
          const key = `block-${index}`;

          const BlockWrapper = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className={className}
            >
              {children}
            </motion.div>
          );

          switch (block.__component) {
            case "elements.heading":
              const isCentered = block.heading.toLowerCase().includes("our team");
              return (
                <BlockWrapper key={key} className={`max-w-6xl mx-auto px-6 mt-20 mb-12 ${isCentered ? "text-center" : "text-left"}`}>
                  <h2 className="text-3xl md:text-5xl font-black text-[#0f172a] tracking-tight leading-tight">
                    {block.heading}
                  </h2>
                  <div className={`bg-[#267b9a] mt-6 rounded-full opacity-80 ${isCentered ? "w-20 h-1.5 mx-auto" : "w-20 h-1.5"}`} />
                </BlockWrapper>
              );

            case "elements.rich-text":
              return (
                <BlockWrapper key={key} className="max-w-6xl mx-auto px-6 prose prose-lg prose-headings:font-black prose-headings:text-[#0f172a] prose-p:text-slate-600">
                  {renderRichText(block.richText, "text-slate-600")}
                </BlockWrapper>
              );

            case "custom.card-grid":
              return (
                <div key={key} className="max-w-7xl mx-auto px-6 mt-12 mb-24">
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={staggerContainer}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                  >
                    {block.cards.map((card: any) => (
                      <TeamCard key={card.id} card={card} />
                    ))}
                  </motion.div>
                </div>
              );

            default:
              return null;
          }
        })}
      </div>

      {/* --- FOOTER CTA --- */}
      <section className="px-6 pb-24 relative overflow-hidden bg-slate-50/50">
        <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-6xl mx-auto relative group">
          <div className="relative overflow-hidden rounded-[3rem] bg-[#0f172a] shadow-[0_40px_80px_rgba(0,0,0,0.4)]">

            {/* CTA Background FX */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#267b9a] rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-pulse" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-900 rounded-full mix-blend-screen filter blur-[100px] opacity-30" />
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 contrast-150" />
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
                  Join forward-thinking brands leveraging our proprietary frameworks.
                </p>
              </div>
              <div className="shrink-0">
                <Link href="/contact-us" className="group/btn relative inline-flex items-center justify-center">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#267b9a] to-cyan-400 rounded-xl blur opacity-40 group-hover/btn:opacity-75 transition duration-500" />
                  <button className="relative px-12 py-6 bg-white text-[#0f172a] text-sm font-bold uppercase tracking-widest rounded-xl transition-all duration-300 transform group-hover/btn:-translate-y-1 group-active/btn:translate-y-0 flex items-center gap-3">
                    Let's Talk Strategy
                    <svg className="w-5 h-5 text-[#267b9a] transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}