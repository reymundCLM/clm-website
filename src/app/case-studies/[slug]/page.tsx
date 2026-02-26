import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCaseStudyBySlug } from "@/lib/api";
import GlobalBlockRenderer from "@/components/Renderer/GlobalBlockRenderer";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// Force dynamic rendering to ensure fresh data from Strapi
export const dynamic = "force-dynamic";

// Dynamically generate SEO metadata based on the specific case study
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const caseStudy = await getCaseStudyBySlug(resolvedParams.slug);

  if (!caseStudy) return { title: "Case Study Not Found" };

  const finalTitle = `${caseStudy.client} Case Study | Confluence Local Marketing`;

  return {
    title: finalTitle,
    description: caseStudy.description,
    openGraph: {
      title: finalTitle,
      description: caseStudy.description,
      type: "article",
    },
  };
}

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const caseStudy = await getCaseStudyBySlug(resolvedParams.slug);

  if (!caseStudy) {
    notFound();
  }

  return (
    <main className="bg-zinc-50 min-h-screen font-sans antialiased selection:bg-[#267b9a] selection:text-white">
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full min-h-[70vh] flex flex-col items-center justify-center bg-[#0f172a] overflow-hidden px-6 pt-32 pb-40">
        {/* Animated Tech Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-30%] right-[-10%] w-[800px] h-[800px] bg-[#267b9a] rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-[-30%] left-[-10%] w-[600px] h-[600px] bg-purple-900 rounded-full mix-blend-screen filter blur-[150px] opacity-25" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] contrast-150 brightness-100" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto w-full">
          {/* Back Button */}
          <Link 
            href="/case-studies"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-white mb-10 transition-colors font-bold text-sm uppercase tracking-widest"
          >
            <FaArrowLeft /> Back to Case Studies
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <span className="inline-block px-4 py-2 text-xs font-bold tracking-[0.2em] text-cyan-300 uppercase bg-cyan-900/30 border border-cyan-500/30 rounded-full backdrop-blur-md w-fit">
              {caseStudy.category}
            </span>
            <span className="text-slate-400 font-bold tracking-widest uppercase">
              Client: <span className="text-white">{caseStudy.client}</span>
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight drop-shadow-2xl mb-8">
            {caseStudy.title}
          </h1>
          
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#267b9a] to-cyan-400 rounded-full shadow-[0_0_20px_rgba(38,123,154,0.6)] mb-10" />
          
          <p className="text-xl md:text-2xl text-slate-300/90 leading-relaxed max-w-3xl">
            {caseStudy.description}
          </p>
        </div>
      </section>

      {/* --- FLOATING METRICS SECTION --- */}
      {caseStudy.metrics && caseStudy.metrics.length > 0 && (
        <section className="relative z-20 max-w-6xl mx-auto px-6 -mt-24 mb-16">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-wrap md:flex-nowrap items-center justify-around gap-8">
            {caseStudy.metrics.map((metric) => (
              <div key={metric.id} className="text-center w-full md:w-auto">
                <div className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#267b9a] to-cyan-500 mb-2">
                  {metric.value}
                </div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- CONTENT BODY (Rendered via Strapi Dynamic Zone) --- */}
      <section className="relative z-10 bg-zinc-50 pb-24">
        {caseStudy.content && caseStudy.content.length > 0 ? (
          // We pass the rich content blocks to your existing renderer!
          <GlobalBlockRenderer blocks={caseStudy.content} />
        ) : (
          <div className="max-w-4xl mx-auto px-6 text-center text-slate-500 py-20">
            <p>Full case study details are being compiled. Check back soon.</p>
          </div>
        )}
      </section>

      {/* --- FOOTER CTA SECTION --- */}
      <section className="px-6 pb-24 relative overflow-hidden bg-zinc-50">
        <div className="max-w-6xl mx-auto relative group">
          <div className="relative overflow-hidden rounded-[3rem] bg-[#0f172a] shadow-[0_40px_80px_rgba(0,0,0,0.4)]">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#267b9a] rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-pulse" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-900 rounded-full mix-blend-screen filter blur-[100px] opacity-30" />
            </div>

            <div className="relative z-10 px-10 py-24 md:px-24 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
              <div className="flex-1">
                <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                  Want results like <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-[#267b9a]">{caseStudy.client}?</span>
                </h2>
                <p className="text-slate-400 text-lg max-w-xl">
                  Let's audit your current digital footprint and build a roadmap to dominate your local market.
                </p>
              </div>
              <div className="shrink-0">
                <Link href="/contact-us" className="group/btn relative inline-flex items-center justify-center">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#267b9a] to-cyan-400 rounded-xl blur opacity-40 group-hover/btn:opacity-75 transition duration-500" />
                  <button className="relative px-12 py-6 bg-white text-[#0f172a] text-sm font-bold uppercase tracking-widest rounded-xl transition-all duration-300 transform group-hover/btn:-translate-y-1 flex items-center gap-3">
                    Book a Free Demo
                    <FaArrowRight className="w-4 h-4 text-[#267b9a] transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}