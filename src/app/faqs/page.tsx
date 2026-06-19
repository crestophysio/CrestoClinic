import React from "react";
import type { Metadata } from "next";
import { connectToDatabase } from "@/lib/db";
import FAQ from "@/models/FAQ";
import AllFAQsView from "@/components/AllFAQsView";
import JsonLd from "@/components/JsonLd";
import { graph, breadcrumbSchema, faqSchema, KEYWORDS, SITE_NAME } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "FAQs | Cresto Physiotherapy Clinic, Bengaluru",
  description:
    "Answers to frequently asked questions about physiotherapy treatments, appointment booking, session duration, and rehabilitation at Cresto Physiotherapy Clinic on Bannerghatta Road, Bengaluru.",
  keywords: KEYWORDS.brandLocal,
  alternates: { canonical: "/faqs" },
  openGraph: {
    title: `Frequently Asked Questions | ${SITE_NAME}`,
    description:
      "Find answers to common questions about physiotherapy, appointment booking, and rehabilitation services at Cresto Physiotherapy Clinic, Bengaluru.",
    url: "/faqs",
    type: "website",
  },
};

export default async function FAQsPage() {
  let faqs: any[] = [];

  try {
    await connectToDatabase();
    faqs = await FAQ.find().sort({ createdAt: -1 }).lean();
  } catch (error) {
    console.error("FAQs page db error:", error);
  }

  const serialize = (arr: any[]) =>
    arr.map((item) => ({
      ...item,
      _id: item._id ? item._id.toString() : "",
      createdAt: item.createdAt ? item.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: item.updatedAt ? item.updatedAt.toISOString() : new Date().toISOString(),
    }));

  const serializedFaqs = serialize(faqs);

  const structuredData = graph(
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "FAQs", path: "/faqs" },
    ]),
    faqSchema(serializedFaqs)
  );

  return (
    <div className="pt-32 pb-24">
      <JsonLd data={structuredData} />
      <AllFAQsView faqs={serializedFaqs} />
    </div>
  );
}
