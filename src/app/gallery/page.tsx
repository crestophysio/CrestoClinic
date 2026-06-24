import React from "react";
import type { Metadata } from "next";
import { connectToDatabase } from "@/lib/db";
import ClinicSettings from "@/models/ClinicSettings";
import Gallery from "@/models/Gallery";
import AllGalleryView from "@/components/AllGalleryView";
import JsonLd from "@/components/JsonLd";
import { graph, breadcrumbSchema, KEYWORDS } from "@/lib/seo";

// ISR — cached HTML, busted on demand via revalidatePath in admin mutations.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Clinic Gallery — Bannerghatta Road, Bengaluru",
  description:
    "Tour Cresto Physiotherapy Clinic on Bannerghatta Road, Bengaluru — modern treatment rooms, advanced rehabilitation equipment, and our physiotherapy care team.",
  keywords: KEYWORDS.gallery,
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Gallery | Cresto Physiotherapy Clinic, Bengaluru",
    description:
      "Photos of our Bengaluru clinic, treatment rooms, and advanced rehabilitation equipment.",
    url: "/gallery",
    type: "website",
  },
};

export default async function GalleryPage() {
  let settings = null;
  let gallery: any[] = [];

  try {
    await connectToDatabase();
    const [settingsRes, galleryRes] = await Promise.all([
      ClinicSettings.findOne().lean(),
      Gallery.find({ category: { $in: ["gallery", "services", "doctors"] } }).sort({ order: 1, createdAt: -1 }).lean()
    ]);
    settings = settingsRes;
    gallery = galleryRes;
  } catch (error) {
    console.error("Gallery page db error:", error);
  }

  const serialize = (arr: any[]) =>
    arr.map((item) => ({
      ...item,
      _id: item._id ? item._id.toString() : "",
      createdAt: item.createdAt ? item.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: item.updatedAt ? item.updatedAt.toISOString() : new Date().toISOString(),
    }));

  const serializedGallery = serialize(gallery);
  const structuredData = graph(
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Gallery", path: "/gallery" },
    ]),
    {
      "@type": "ImageGallery",
      name: "Cresto Physiotherapy Clinic Gallery",
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/gallery`,
      ...(serializedGallery.length && {
        image: serializedGallery
          .map((g: any) => g.imageUrl)
          .filter(Boolean),
      }),
    }
  );

  return (
    <div className="pt-32 pb-24">
      <JsonLd data={structuredData} />
      <AllGalleryView gallery={serializedGallery} />
    </div>
  );
}
