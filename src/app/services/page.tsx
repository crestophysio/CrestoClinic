import React from "react";
import type { Metadata } from "next";
import { connectToDatabase } from "@/lib/db";
import ClinicSettings from "@/models/ClinicSettings";
import Service from "@/models/Service";
import AllServicesView from "@/components/AllServicesView";
import JsonLd from "@/components/JsonLd";
import { graph, breadcrumbSchema, serviceListSchema, KEYWORDS } from "@/lib/seo";

// ISR — cached HTML, busted on demand via revalidatePath in admin mutations.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Physiotherapy Services in Bengaluru",
  description:
    "Cresto Physiotherapy Clinic, Bengaluru services: manual therapy, neurological rehabilitation, sports injury treatment, post-surgical rehab, electrotherapy, and posture & spine care on Bannerghatta Road.",
  keywords: [...KEYWORDS.services, ...KEYWORDS.conditions],
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Physiotherapy Services in Bengaluru | Cresto Physiotherapy Clinic",
    description:
      "Manual therapy, neuro rehab, sports injury treatment, post-surgical recovery, electrotherapy & posture care in Bengaluru, Bannerghatta Road.",
    url: "/services",
    type: "website",
  },
};

export default async function ServicesPage() {
  let settings = null;
  let services: any[] = [];

  try {
    await connectToDatabase();
    const [settingsRes, servicesRes] = await Promise.all([
      ClinicSettings.findOne().lean(),
      Service.find().sort({ createdAt: -1 }).lean()
    ]);
    settings = settingsRes;
    services = servicesRes;
  } catch (error) {
    console.error("Services page db error:", error);
  }

  const serialize = (arr: any[]) =>
    arr.map((item) => ({
      ...item,
      _id: item._id ? item._id.toString() : "",
      createdAt: item.createdAt ? item.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: item.updatedAt ? item.updatedAt.toISOString() : new Date().toISOString(),
    }));

  const serializedServices = serialize(services);
  const structuredData = graph(
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
    ]),
    serviceListSchema(serializedServices)
  );

  return (
    <div className="pt-32 pb-24">
      <JsonLd data={structuredData} />
      <AllServicesView services={serializedServices} />
    </div>
  );
}
