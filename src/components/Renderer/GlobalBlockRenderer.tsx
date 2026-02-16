"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';

import {
  ConfluenceBlock,
  ServiceRichTextNode,
  ServiceRichTextChild,
  ComponentFaqItem,
  ComponentBackgroundImage
} from "@/lib/api";

// --- TYPES ---
interface RichTextText extends ServiceRichTextChild {
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
}

interface RichTextBlock {
  type: string;
  children: (RichTextText | RichTextBlock)[];
  level?: number;
  format?: 'ordered' | 'unordered';
  url?: string;
}

interface ComponentCardV2 {
  __component: "elements.card-v2";
  id: number;
  Icon?: {
    width: number;
    height: number;
    iconData: string;
    iconName?: string;
  };
  Title: string;
  Desctription: RichNode[];
}

type RichNode = RichTextText | RichTextBlock | RichTextImage;

interface ComponentFeatureItem {
  __component: "elements.feature-item";
  id: number;
  title: string;
  description: string;
  icon: {
    width: number;
    height: number;
    iconData: string;
    iconName?: string;
  } | null;
}

interface ComponentButton {
  __component: "elements.button";
  id?: number;
  label: string;
  href: string;
  isExternal: boolean;
}

export interface ComponentImage {
  __component: "elements.image";
  id: number;
  singleImage: {
    url: string;
    alternativeText?: string | null;
    width: number;
    height: number;
  };
}

interface CustomFeatureGrid {
  __component: 'custom.feature-grid';
  items: ComponentFeatureItem[];
}
interface CustomCardV2Grid {
  __component: "custom.card-v2-grid";
  items: ComponentCardV2[];
}

interface RichTextImage {
  type: "image";
  image: {
    url: string;
    width: number;
    height: number;
    alternativeText?: string | null;
  };
}

type AnyBlock =
  | ConfluenceBlock
  | ComponentBackgroundImage
  | ComponentFeatureItem
  | ComponentButton
  | ComponentImage
  | ComponentCardV2;

type ContentBlock = AnyBlock | CustomFeatureGrid | CustomCardV2Grid;

// --- HELPERS ---
const isRichTextImage = (node: RichNode): node is RichTextImage => node.type === "image";
const extractRichTextImage = (nodes: RichNode[]) => {
  for (const node of nodes) {
    if (isRichTextImage(node)) return node.image;
  }
  return null;
};

// --- ANIMATION VARIANTS ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } // "Apple" ease
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

// --- RENDERER LOGIC ---
const renderRichText = (nodes: (ServiceRichTextNode | ServiceRichTextChild | RichNode)[], textColorClass: string = "text-slate-600") => {
  if (!nodes) return null;

  return nodes.map((node, index) => {
    const safeNode = node as RichNode;

    if (safeNode.type === 'text') {
      const textNode = safeNode as RichTextText;
      let content: React.ReactNode = textNode.text;

      // Logic: If background is dark (text-white/slate-300), keep bold white. Else dark.
      const isDarkBg = textColorClass.includes("white") || textColorClass.includes("slate-300");

      if (textNode.bold) content = <strong key="bold" className={`font-bold ${isDarkBg ? "text-white" : "text-slate-900"}`}>{content}</strong>;
      if (textNode.italic) content = <em key="italic" className="italic">{content}</em>;
      if (textNode.code) content = <code key="code" className="bg-slate-100 text-[#267b9a] px-1.5 py-0.5 rounded text-sm font-mono border border-slate-200">{content}</code>;

      return <span key={index}>{content}</span>;
    }

    const blockNode = safeNode as RichTextBlock;

    switch (blockNode.type) {
      case 'paragraph':
        if (blockNode.children.length === 0 || (blockNode.children.length === 1 && (blockNode.children[0] as RichTextText).text === "")) {
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
        const headingSize = level === 1 ? 'text-4xl md:text-6xl' : level === 2 ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl';
        const isDarkHead = textColorClass.includes("white");

        return (
          <Tag key={index} className={`${headingSize} font-bold mt-12 mb-6 tracking-tight ${isDarkHead ? "text-white" : "text-slate-900"}`}>
            {renderRichText(blockNode.children, textColorClass)}
          </Tag>
        );

      case 'list':
        const isOrdered = blockNode.format === 'ordered';
        const ListTag = isOrdered ? 'ol' : 'ul';
        const listClass = isOrdered
          ? "list-decimal pl-6 mb-8 space-y-3 text-lg font-medium text-slate-800"
          : "list-disc pl-6 mb-8 space-y-3 text-lg marker:text-[#267b9a]";

        return (
          <ListTag key={index} className={listClass}>
            {renderRichText(blockNode.children, textColorClass)}
          </ListTag>
        );

      case 'list-item':
        return (
          <li key={index} className={`pl-2 ${textColorClass} leading-relaxed`}>
            {renderRichText(blockNode.children, textColorClass)}
          </li>
        );

      case 'quote':
        return (
          <blockquote key={index} className="relative pl-8 py-6 my-12 border-l-4 border-[#267b9a] bg-gradient-to-r from-[#267b9a]/5 to-transparent rounded-r-2xl">
            <div className="text-xl font-medium italic text-slate-700 leading-relaxed">
              "{renderRichText(blockNode.children, textColorClass)}"
            </div>
          </blockquote>
        );

      case 'link':
        return (
          <Link
            key={index}
            href={blockNode.url || "#"}
            className="text-[#267b9a] font-bold underline decoration-[#267b9a]/30 hover:decoration-[#267b9a] transition-all hover:text-[#1f637c]"
          >
            {renderRichText(blockNode.children, "text-[#267b9a]")}
          </Link>
        );

      default:
        return null;
    }
  });
};

// --- SUB-COMPONENTS ---

const FaqItem = ({ item }: { item: ComponentFaqItem }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6">
      <motion.div
        initial={false}
        className={`group border transition-all duration-500 rounded-[2rem] overflow-hidden ${isOpen
            ? "bg-white border-[#267b9a]/30 shadow-[0_20px_50px_rgba(38,123,154,0.15)]"
            : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md"
          }`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center px-8 py-7 text-left outline-none bg-transparent"
        >
          <span
            className={`text-lg md:text-xl font-bold tracking-tight transition-colors duration-300 ${isOpen ? "text-[#267b9a]" : "text-slate-800 group-hover:text-slate-900"
              }`}
          >
            {item.title}
          </span>

          <div
            className={`flex-shrink-0 ml-4 w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500 ${isOpen
                ? "bg-[#267b9a] border-[#267b9a] text-white rotate-180 shadow-[0_0_15px_rgba(38,123,154,0.4)]"
                : "bg-slate-50 border-slate-200 text-slate-400 rotate-0"
              }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="3"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} // Match your "Apple" ease
            >
              <div className="px-8 pb-8">
                {/* Visual Divider consistent with your card design */}
                <div className="h-[1px] w-full bg-gradient-to-r from-slate-100 via-slate-50 to-transparent mb-6" />

                <div className="prose prose-slate max-w-none text-slate-600 text-base md:text-lg leading-relaxed">
                  {renderRichText(item.content, "text-slate-600")}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// --- HELPER: GROUP BLOCKS ---
const processBlocks = (blocks: AnyBlock[]) => {
  const heroBlocks: AnyBlock[] = [];
  const processedContent: ContentBlock[] = [];

  let heroHeadingTaken = false;
  let heroTextTaken = false;
  let heroButtonTaken = false;

  let featureBuffer: ComponentFeatureItem[] = [];
  let cardV2Buffer: ComponentCardV2[] = [];

  const flushCardV2 = () => {
    if (cardV2Buffer.length > 0) {
      processedContent.push({ __component: "custom.card-v2-grid", items: [...cardV2Buffer] });
      cardV2Buffer = [];
    }
  };

  const flushFeatures = () => {
    if (featureBuffer.length > 0) {
      processedContent.push({ __component: "custom.feature-grid", items: [...featureBuffer] });
      featureBuffer = [];
    }
  };

  blocks.forEach((block) => {
    if (block.__component === "elements.heading" && !heroHeadingTaken) {
      heroBlocks.push(block);
      heroHeadingTaken = true;
      return;
    }
    if (block.__component === "elements.rich-text" && !heroTextTaken) {
      heroBlocks.push(block);
      heroTextTaken = true;
      return;
    }
    if (block.__component === "elements.button" && !heroButtonTaken) {
      heroBlocks.push(block);
      heroButtonTaken = true;
      return;
    }
    if (block.__component === "elements.feature-item") {
      featureBuffer.push(block as ComponentFeatureItem);
      return;
    }
    if (block.__component === "elements.card-v2") {
      cardV2Buffer.push(block as ComponentCardV2);
      return;
    }
    flushFeatures();
    flushCardV2();
    processedContent.push(block);
  });
  flushFeatures();
  flushCardV2();

  return { heroBlocks, processedContent };
};

// --- MAIN RENDERER ---
interface RendererProps {
  blocks: AnyBlock[];
}

export default function ConfluenceBlockRenderer({ blocks }: RendererProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted || !blocks || blocks.length === 0) return null;

  const heroImage = blocks.find((b) => b.__component === "elements.background-image") as ComponentBackgroundImage | undefined;
  const rawBlocks = blocks.filter((b) => b.__component !== "elements.background-image");
  const { heroBlocks, processedContent } = processBlocks(rawBlocks);

  const heroHeading = heroBlocks.find(b => b.__component === 'elements.heading') as { heading: string; __component: string } | undefined;
  const heroText = heroBlocks.find(b => b.__component === 'elements.rich-text') as { richText: any[]; __component: string } | undefined;
  const heroButton = heroBlocks.find(b => b.__component === 'elements.button') as ComponentButton | undefined;

  return (
    <div className="bg-white flex flex-col min-h-screen font-sans antialiased selection:bg-[#267b9a] selection:text-white">

      {/* --- HERO SECTION --- */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center bg-[#0f172a] overflow-hidden px-4">

        {/* Animated Tech Background */}
        <div className="absolute inset-0 z-0">
          {/* Mesh Gradients */}
          <div className="absolute top-[-30%] right-[-10%] w-[800px] h-[800px] bg-[#267b9a] rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-[-30%] left-[-10%] w-[600px] h-[600px] bg-indigo-900 rounded-full mix-blend-screen filter blur-[150px] opacity-25" />

          {/* Grid Overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] contrast-150 brightness-100" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />
        </div>

        {heroImage && heroImage.background?.url && (
          <div className="absolute inset-0 w-full h-full z-0">
            <Image
              src={heroImage.background.url}
              alt={heroImage.background.alternativeText || `${heroHeading?.heading || 'Confluence'} Hero Image`}
              fill
              className="object-cover opacity-30 mix-blend-overlay"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/90 to-transparent" />
          </div>
        )}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="relative z-10 max-w-5xl mx-auto text-center py-24"
        >
          {heroHeading && (
            <>
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight drop-shadow-2xl mb-8">
                {heroHeading.heading}
              </h1>
              {/* Decorative Line */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 96 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-1.5 bg-gradient-to-r from-[#267b9a] to-cyan-400 rounded-full shadow-[0_0_20px_rgba(38,123,154,0.6)] mx-auto mb-10"
              />
            </>
          )}

          {heroText && (
            <div className="prose prose-xl prose-invert max-w-3xl mx-auto text-slate-300/90 leading-relaxed mb-12">
              {renderRichText(heroText.richText, "text-slate-300")}
            </div>
          )}

          {heroButton && (
            <Link
              href={heroButton.href}
              target={heroButton.isExternal ? "_blank" : "_self"}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 bg-[#267b9a] rounded-lg hover:bg-[#1f637c] hover:shadow-[0_0_40px_rgba(38,123,154,0.5)] hover:-translate-y-1 overflow-hidden"
            >
              {/* Shine effect */}
              <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12 group-hover:animate-shine" />
              <span className="relative z-10">{heroButton.label}</span>
            </Link>
          )}
        </motion.div>
      </section>

      {/* --- MAIN CONTENT --- */}
      <div className="grow w-full py-16 overflow-hidden bg-slate-50/50">
        {processedContent.map((block, index) => {
          const key = `block-${index}`;

          // CARD V2 GRID (Usually Services/Benefits)
          if (block.__component === "custom.card-v2-grid") {
            return (
              <div key={key} className="max-w-7xl mx-auto px-6 my-24">
                <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {block.items.map((card) => (
                    <motion.div
                      key={card.id}
                      variants={fadeInUp}
                      className="group relative bg-white rounded-3xl p-10 border border-slate-100 shadow-sm hover:shadow-[0_20px_50px_rgba(38,123,154,0.1)] transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#267b9a] to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                      {card.Icon && (
                        <div className="w-14 h-14 mb-8 text-[#267b9a] p-3 bg-[#f0f9fb] rounded-2xl group-hover:bg-[#267b9a] group-hover:text-white transition-all duration-300">
                          <svg width="100%" height="100%" viewBox={`0 0 ${card.Icon.width} ${card.Icon.height}`} fill="currentColor" dangerouslySetInnerHTML={{ __html: card.Icon.iconData }} />
                        </div>
                      )}
                      <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight group-hover:text-[#267b9a] transition-colors">{card.Title}</h3>
                      <div className="text-slate-600 text-base leading-relaxed">{renderRichText(card.Desctription, "text-slate-600")}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            );
          }

          // FEATURE GRID
          if (block.__component === 'custom.feature-grid') {
            const features = block.items;
            const isFourItems = features.length === 4;
            return (
              <div key={key} className={`max-w-7xl mx-auto px-6 mb-24 mt-12`}>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  className={`grid gap-8 ${isFourItems ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"}`}
                >
                  {features.map((feature, fIndex) => {
                    const hasIcon = !!feature.icon;
                    return (
                      <motion.div
                        key={feature.id || fIndex}
                        variants={fadeInUp}
                        className={`group relative rounded-3xl p-10 transition-all duration-300 border border-slate-200/60
                          ${hasIcon
                            ? "bg-white hover:border-[#267b9a]/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)]"
                            : "bg-gradient-to-br from-slate-100 to-white flex flex-col justify-center text-center hover:shadow-lg"}`}
                      >
                        {hasIcon && (
                          <div className="w-16 h-16 rounded-2xl bg-[#f0f9fb] flex items-center justify-center text-[#267b9a] mb-6 group-hover:scale-110 transition-transform duration-300">
                            <svg width={feature.icon!.width} height={feature.icon!.height} viewBox={`0 0 ${feature.icon!.width} ${feature.icon!.height}`} fill="currentColor" className="w-8 h-8" dangerouslySetInnerHTML={{ __html: feature.icon!.iconData }} />
                          </div>
                        )}
                        <h3 className={hasIcon ? "text-xl font-bold text-slate-900 mb-3" : "text-4xl md:text-5xl font-extrabold text-[#267b9a] mb-2"}>{feature.title}</h3>
                        <p className={hasIcon ? "text-slate-600 leading-relaxed" : "text-sm font-bold uppercase tracking-widest text-slate-400"}>{feature.description}</p>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            );
          }

          const BlockWrapper = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className={className}>{children}</motion.div>
          );

          switch (block.__component) {
            case "elements.heading":
              const headingBlock = block as { heading: string };
              return (
                <BlockWrapper key={key} className={`max-w-6xl mx-auto px-6 mt-16 text-left`}>
                  <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">{headingBlock.heading}</h2>
                  <div className="w-20 h-1.5 bg-[#267b9a] mt-6 rounded-full opacity-80"></div>
                </BlockWrapper>
              );

            case "elements.rich-text": {
              const rtBlock = block as { richText: RichNode[] };
              const image = extractRichTextImage(rtBlock.richText);
              const textOnly = rtBlock.richText.filter(n => n.type !== "image");
              return (
                <BlockWrapper key={key} className={`max-w-6xl mx-auto px-6 my-20 ${image ? "grid md:grid-cols-2 gap-16 items-center" : ""}`}>
                  <div className="prose prose-lg prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-[#267b9a]">
                    {renderRichText(textOnly, "text-slate-600")}
                  </div>
                  {image && (
                    <div className="relative group">
                      <div className="absolute -inset-4 bg-[#267b9a]/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="relative w-full overflow-hidden rounded-[2rem] shadow-2xl border border-slate-200/50">
                        <Image src={image.url} alt={image.alternativeText || `${heroHeading?.heading || 'Confluence'} Service Detail Image`} width={image.width} height={image.height} className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105" />
                      </div>
                    </div>
                  )}
                </BlockWrapper>
              );
            }
            case "elements.button":
              const btn = block as ComponentButton;
              return (
                <BlockWrapper key={key} className="flex justify-start max-w-4xl mx-auto my-12 px-6">
                  <Link href={btn.href} target={btn.isExternal ? "_blank" : "_self"} className="inline-flex items-center justify-center px-10 py-4 text-sm font-bold uppercase tracking-widest bg-slate-900 text-white rounded-lg transition-all duration-300 hover:bg-[#267b9a] hover:-translate-y-1 shadow-lg hover:shadow-[#267b9a]/40">
                    {btn.label}
                  </Link>
                </BlockWrapper>
              );

            case "elements.faq-item":
              return (
                <motion.div key={key} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp} className="max-w-4xl mx-auto px-6">
                  <FaqItem item={block as ComponentFaqItem} />
                </motion.div>
              );

            case "elements.image": {
              const imageBlock = block as ComponentImage;
              if (!imageBlock.singleImage?.url) return null;
              return (
                <BlockWrapper key={key} className="max-w-6xl mx-auto px-6 my-24">
                  <div className="relative w-full overflow-hidden rounded-[2rem] shadow-2xl border border-slate-200">
                    <Image src={imageBlock.singleImage.url} alt={imageBlock.singleImage.alternativeText || `${heroHeading?.heading || 'Confluence'} Content Image`} width={imageBlock.singleImage.width} height={imageBlock.singleImage.height} className="w-full h-auto object-cover" />
                  </div>
                </BlockWrapper>
              );
            }

            default: return null;
          }
        })}
      </div>

      {/* --- FOOTER CTA (Tech Style) --- */}
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