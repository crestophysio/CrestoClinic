import React from "react";
import type { Metadata } from "next";
import { connectToDatabase } from "@/lib/db";
import ClinicSettings from "@/models/ClinicSettings";
import BlogPost from "@/models/BlogPost";
import AllBlogsView from "@/components/AllBlogsView";
import JsonLd from "@/components/JsonLd";
import { graph, breadcrumbSchema, blogListSchema, KEYWORDS } from "@/lib/seo";

// ISR — cached HTML, busted on demand via revalidatePath in admin mutations.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Physiotherapy & Rehab Blog — Expert Recovery Tips",
  description:
    "Doctor-written physiotherapy advice from Cresto Physiotherapy Clinic, Bengaluru: back pain relief, post-stroke rehabilitation, sports injury prevention, posture correction, and recovery exercises.",
  keywords: KEYWORDS.blog,
  alternates: { canonical: "/blogs" },
  openGraph: {
    title: "Physiotherapy & Rehab Blog | Cresto Physiotherapy Clinic",
    description:
      "Back pain exercises, neuro rehab guidance, sports injury prevention, and recovery tips from our physiotherapists.",
    url: "/blogs",
    type: "website",
  },
};

export default async function BlogsPage() {
  let settings = null;
  let posts: any[] = [];

  try {
    await connectToDatabase();
    const [settingsRes, postsRes] = await Promise.all([
      ClinicSettings.findOne().lean(),
      BlogPost.find().sort({ createdAt: -1 }).lean()
    ]);
    settings = settingsRes;
    posts = postsRes;
  } catch (error) {
    console.error("Blogs page db error:", error);
  }

  const serialize = (arr: any[]) =>
    arr.map((item) => ({
      ...item,
      _id: item._id ? item._id.toString() : "",
      createdAt: item.createdAt ? item.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: item.updatedAt ? item.updatedAt.toISOString() : new Date().toISOString(),
    }));

  const serializedPosts = serialize(posts);
  const structuredData = graph(
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blogs" },
    ]),
    blogListSchema(serializedPosts)
  );

  return (
    <div className="pt-32 pb-24">
      <JsonLd data={structuredData} />
      <AllBlogsView posts={serializedPosts} />
    </div>
  );
}
