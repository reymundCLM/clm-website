"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { getStrapiMedia } from '@/lib/api';

// --- TYPES ---
interface RichTextChild { text: string; type: "text"; bold?: boolean; italic?: boolean; code?: boolean; }
interface RichTextNode { 
  type: "paragraph" | "list" | "list-item" | "heading" | "link" | "quote" | "image"; // ADDED "image"
  format?: "unordered" | "ordered"; 
  level?: 1 | 2 | 3; 
  url?: string; 
  image?: {
    url: string;
    width: number;
    height: number;
    alternativeText?: string | null;
  };
  children: (RichTextNode | RichTextChild)[]; 
}

interface ComponentHeading { __component: "elements.heading"; id: number; heading: string; }
interface ComponentRichText { __component: "elements.rich-text"; id: number; richText: RichTextNode[]; }
interface ComponentContactButton { __component: "elements.contact-button"; id: number; label: string; phoneNumber: string; }
interface ComponentBackgroundImage { __component: "elements.background-image"; id: number; background: { id: number; url: string; alternativeText?: string; width: number; height: number; }; }
interface ComponentFaqItem { __component: "elements.faq-item"; id: number; title: string; isAccordion: boolean; content: RichTextNode[]; }
interface ComponentImage { __component: "elements.image"; id: number; singleImage: { url: string; alternativeText?: string | null; width: number; height: number; }; } // ADDED ComponentImage

export type ServicePageBlock = ComponentHeading | ComponentRichText | ComponentContactButton | ComponentBackgroundImage | ComponentFaqItem | ComponentImage;
interface BlockRendererProps { blocks: ServicePageBlock[]; }

// --- VARIANTS ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

// --- RENDERER ---
const renderRichText = (nodes: (RichTextNode | RichTextChild)[], textColorClass: string = "text-slate-600") => {
  if (!nodes) return null;

  return nodes.map((node, index) => {
    if (node.type === 'text') {
      const textNode = node as any;
      let content: React.ReactNode = textNode.text;

      if (textNode.bold) content = <strong key="bold" className="font-bold text-slate-900">{content}</strong>;
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
          <p key={index} className={`mb-6 text-lg leading-8 ${textColorClass} last:mb-0`}>
            {renderRichText(blockNode.children, textColorClass)}
          </p>
        );

      case 'heading':
        const level = blockNode.level || 3;
        const Tag = `h${level}` as React.ElementType;
        const size = level === 1 ? 'text-5xl' : level === 2 ? 'text-4xl' : 'text-2xl';
        return (
          <Tag key={index} className={`${size} font-bold mt-12 mb-6 tracking-tight text-slate-900`}>
            {renderRichText(blockNode.children, textColorClass)}
          </Tag>
        );

      case 'list':
        const isOrdered = blockNode.format === 'ordered';
        const ListTag = isOrdered ? 'ol' : 'ul';
        const listClass = isOrdered
          ? "list-decimal pl-8 mb-8"
          : "list-disc pl-8 mb-8 marker:text-[#267b9a]";

        return (
          <ListTag key={index} className={`${listClass} ${textColorClass} space-y-3 text-lg`}>
            {renderRichText(blockNode.children, textColorClass)}
          </ListTag>
        );

      case 'list-item':
        return (
          <li key={index} className="pl-2">
            {renderRichText(blockNode.children, textColorClass)}
          </li>
        );

      case 'link':
        return (
          <a
            key={index}
            href={blockNode.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#267b9a] font-bold underline decoration-[#267b9a]/30 hover:decoration-[#267b9a] transition-all"
          >
            {renderRichText(blockNode.children, "text-[#267b9a]")}
          </a>
        );

      case 'quote':
        return (
          <blockquote key={index} className="border-l-4 border-[#267b9a] pl-6 my-8 italic text-slate-700 bg-slate-50 py-4 rounded-r-lg">
            {renderRichText(blockNode.children, textColorClass)}
          </blockquote>
        );

      // --- ADDED SUPPORT FOR INLINE RICH TEXT IMAGES ---
      case 'image':
        if (!blockNode.image?.url) return null;
        return (
          <div key={index} className="relative w-full my-12 rounded-[2rem] overflow-hidden shadow-xl border border-slate-200">
            <Image
              src={getStrapiMedia(blockNode.image.url) || ""}
              alt={blockNode.image.alternativeText || "Service Details"}
              width={blockNode.image.width || 1200}
              height={blockNode.image.height || 800}
              className="w-full h-auto object-cover"
            />
          </div>
        );

      default:
        return null;
    }
  });
};

// --- COMPONENT: ACCORDION ---
const FaqAccordion = ({ block }: { block: ComponentFaqItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mb-4">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`group cursor-pointer rounded-2xl border bg-white transition-all duration-300 hover:border-[#267b9a]/40 hover:shadow-lg ${isOpen ? 'ring-1 ring-[#267b9a] shadow-md border-[#267b9a]' : 'border-slate-200'}`}
      >
        <div className="flex items-center justify-between p-6">
          <span className="font-bold text-xl text-slate-900 group-hover:text-[#267b9a] transition-colors">{block.title}</span>
          <span className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${isOpen ? 'bg-[#267b9a] text-white rotate-180' : 'bg-slate-100 text-slate-500 group-hover:bg-[#267b9a] group-hover:text-white'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
          </span>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="px-6 pb-8 pt-0 text-slate-600 leading-relaxed border-t border-slate-50 mt-2">
                {renderRichText(block.content, "text-slate-600")}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- MAIN RENDERER ---
const BlockRenderer = ({ blocks }: BlockRendererProps) => {
  if (!blocks || blocks.length === 0) return null;

  const heroImageBlock = blocks.find((b) => b.__component === "elements.background-image") as ComponentBackgroundImage | undefined;
  const heroHeadingBlock = blocks.find((b) => b.__component === "elements.heading") as ComponentHeading | undefined;
  const ctaButtons: ComponentContactButton[] = [];
  blocks.forEach(b => { if (b.__component === "elements.contact-button") ctaButtons.push(b as ComponentContactButton); });

  const contentBlocks = blocks.filter((b) => {
    return b !== heroImageBlock && b !== heroHeadingBlock && !ctaButtons.includes(b as ComponentContactButton);
  });

  return (
    <div className="bg-white flex flex-col min-h-screen font-sans">

      {/* --- HERO BANNER --- */}
      {(heroImageBlock || heroHeadingBlock) && (
        <section className="relative w-full min-h-[85vh] flex items-center justify-center bg-[#0f172a] overflow-hidden px-4">
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#267b9a] rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-pulse pointer-events-none" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-900 rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04]" />

          {heroImageBlock?.background?.url && (
            <div className="absolute inset-0 w-full h-full z-0">
              <Image src={getStrapiMedia(heroImageBlock.background.url) || ""} alt="Hero" fill className="object-cover opacity-40 mix-blend-overlay" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/90 to-transparent" />
            </div>
          )}

          {heroHeadingBlock && (
            <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="relative z-10 max-w-5xl mx-auto px-6 text-center">
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight drop-shadow-2xl">{heroHeadingBlock.heading}</h1>
              <div className="flex justify-center mt-10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 96 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="h-1.5 bg-gradient-to-r from-[#267b9a] to-cyan-400 rounded-full shadow-[0_0_20px_rgba(38,123,154,0.6)] mx-auto mb-10"
                />              
              </div>
            </motion.div>
          )}
        </section>
      )}

      {/* --- CONTENT --- */}
      <div className="flex-grow max-w-6xl mx-auto px-6 py-24 w-full">
        {contentBlocks.map((block, index) => {
          const key = `${block.__component}-${index}`;
          const BlockWrapper = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className={className}>{children}</motion.div>
          );

          switch (block.__component) {
            case 'elements.heading':
              return (
                <BlockWrapper key={key} className="mt-20 mb-10">
                  <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">{block.heading}</h2>
                  <div className="w-16 h-1 bg-[#267b9a] mt-6 rounded-full" />
                </BlockWrapper>
              );
              
            case 'elements.rich-text':
              return (
                <BlockWrapper key={key} className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600">
                  {renderRichText(block.richText, "text-slate-600")}
                </BlockWrapper>
              );

            case 'elements.faq-item':
              return <motion.div key={key} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}><FaqAccordion block={block} /></motion.div>;
            
            case 'elements.background-image':
              if (!block.background?.url) return null;
              return (
                <BlockWrapper key={key} className="relative w-full my-20 rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200">
                  <Image src={getStrapiMedia(block.background.url) || ""} alt="Image" width={block.background.width} height={block.background.height} style={{ width: '100%', height: 'auto' }} className="object-cover" />
                </BlockWrapper>
              );

            // --- ADDED SUPPORT FOR STANDALONE IMAGE COMPONENT ---
            case 'elements.image':
              if (!block.singleImage?.url) return null;
              return (
                <BlockWrapper key={key} className="relative w-full my-20 rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200">
                  <Image src={getStrapiMedia(block.singleImage.url) || ""} alt="Service visual" width={block.singleImage.width || 1200} height={block.singleImage.height || 800} style={{ width: '100%', height: 'auto' }} className="object-cover" />
                </BlockWrapper>
              );

            default: return null;
          }
        })}
      </div>

      {/* --- FOOTER CTA --- */}
      <section className="px-6 pb-24 relative overflow-hidden bg-slate-50/50">
        <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-6xl mx-auto relative group">
          <div className="relative overflow-hidden rounded-[3rem] bg-[#0f172a] shadow-[0_40px_80px_rgba(0,0,0,0.4)]">
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
                  <button className="relative px-12 py-6 bg-white text-[#0f172a] text-sm font-bold uppercase tracking-widest rounded-xl transition-all duration-300 transform group-hover/btn:-translate-y-1 flex items-center gap-3">
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
};

export default BlockRenderer;