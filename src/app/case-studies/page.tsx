import React from "react";
import type { Metadata } from "next";
import { getCaseStudies } from "@/lib/api";
import CaseStudiesGrid from "@/components/Body/CaseStudiesGrid";

// Force dynamic rendering to ensure fresh data from Strapi on every request
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Case Studies | Confluence Local Marketing",
  description: "See how we leverage AI-First SEO and technical mastery to drive explosive growth for businesses across competitive industries.",
  openGraph: {
    title: "Case Studies | Confluence Local Marketing",
    description: "See how we leverage AI-First SEO and technical mastery to drive explosive growth for businesses across competitive industries.",
  },
};

export default async function CaseStudiesPage() {
  // 1. Fetch data directly on the server
  const caseStudiesData = await getCaseStudies();

  return (
    <main className="bg-zinc-50 min-h-screen font-sans antialiased selection:bg-[#267b9a] selection:text-white">
      {/* 2. Pass the fetched data to your interactive client component */}
      <CaseStudiesGrid caseStudies={caseStudiesData} />
    </main>
  );
}