import React from "react";
import type { Metadata } from "next";
import { connectToDatabase } from "@/lib/db";
import Doctor from "@/models/Doctor";
import ClinicSettings from "@/models/ClinicSettings";
import AllDoctorsView from "@/components/AllDoctorsView";
import JsonLd from "@/components/JsonLd";
import { graph, breadcrumbSchema, physicianSchemas, KEYWORDS, SITE_NAME } from "@/lib/seo";

// ISR — revalidated when admin saves doctor data
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Our Physiotherapists | Cresto Physiotherapy Clinic, Bengaluru",
  description:
    "Meet the specialist physiotherapy team at Cresto Physiotherapy Clinic on Bannerghatta Road, Bengaluru. Expert manual therapists, neurological rehab specialists, and sports injury physiotherapists.",
  keywords: KEYWORDS.brandLocal,
  alternates: { canonical: "/doctors" },
  openGraph: {
    title: `Our Specialist Physiotherapists | ${SITE_NAME}`,
    description:
      "Expert physiotherapists specialising in manual therapy, neurological rehabilitation, sports injuries, and post-surgical recovery at Cresto Physiotherapy Clinic, Bengaluru.",
    url: "/doctors",
    type: "website",
  },
};

export default async function DoctorsPage() {
  let doctors: any[] = [];

  try {
    await connectToDatabase();
    doctors = await Doctor.find().sort({ createdAt: 1 }).lean();
  } catch (error) {
    console.error("Doctors page db error:", error);
  }

  const serialize = (arr: any[]) =>
    arr.map((item) => ({
      ...item,
      _id: item._id ? item._id.toString() : "",
      createdAt: item.createdAt ? item.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: item.updatedAt ? item.updatedAt.toISOString() : new Date().toISOString(),
    }));

  const serializedDoctors = serialize(doctors);

  const structuredData = graph(
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Doctors", path: "/doctors" },
    ]),
    ...physicianSchemas(serializedDoctors)
  );

  return (
    <div className="pt-32 pb-24">
      <JsonLd data={structuredData} />
      <AllDoctorsView doctors={serializedDoctors} />
    </div>
  );
}
