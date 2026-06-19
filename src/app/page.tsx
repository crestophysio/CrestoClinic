import React from "react";
import { connectToDatabase } from "@/lib/db";
import ClinicSettings from "@/models/ClinicSettings";
import Doctor from "@/models/Doctor";
import Service from "@/models/Service";
import Review from "@/models/Review";
import FAQ from "@/models/FAQ";
import BlogPost from "@/models/BlogPost";
import Gallery from "@/models/Gallery";
import MainHome from "@/components/MainHome";
import { seedDatabase } from "@/lib/seed";
import JsonLd from "@/components/JsonLd";
import {
  graph,
  organizationSchema,
  medicalClinicSchema,
  websiteSchema,
  faqSchema,
  physicianSchemas,
} from "@/lib/seo";

export const revalidate = 300;

export default async function Page() {
  let settings = null;
  let doctors: any[] = [];
  let services: any[] = [];
  let reviews: any[] = [];
  let faqs: any[] = [];
  let blogs: any[] = [];
  let gallery: any[] = [];

  try {
    await connectToDatabase();

    // Fetch from database in parallel
    const [
      settingsRes,
      doctorsRes,
      servicesRes,
      reviewsRes,
      faqsRes,
      blogsRes,
      galleryRes,
    ] = await Promise.all([
      ClinicSettings.findOne().lean(),
      Doctor.find()
        .select("name qualification specialization experience description consultingTime phone availability photo createdAt updatedAt")
        .sort({ createdAt: -1 })
        .limit(4)
        .lean(),
      Service.find()
        .select("title description icon createdAt updatedAt")
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
      Review.find({ approved: true })
        .select("name rating reviewText createdAt updatedAt")
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
      FAQ.find()
        .select("question answer createdAt updatedAt")
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),
      BlogPost.find()
        .select("title content category tags author image createdAt updatedAt")
        .sort({ createdAt: -1 })
        .limit(3)
        .lean(),
      Gallery.find({ category: { $in: ["gallery", "services", "doctors"] } })
        .select("imageUrl category caption order createdAt updatedAt")
        .sort({ order: 1, createdAt: -1 })
        .limit(8)
        .lean(),
    ]);

    settings = settingsRes;
    doctors = doctorsRes;
    services = servicesRes;
    reviews = reviewsRes;
    faqs = faqsRes;
    blogs = blogsRes;
    gallery = galleryRes;

    // Auto seed if database is empty
    if (!settings || doctors.length === 0 || services.length === 0) {
      console.log("Database empty. Seeding database directly on server...");
      try {
        await seedDatabase();
        // Refetch after seeding in parallel
        const [
          settingsRes2,
          doctorsRes2,
          servicesRes2,
          reviewsRes2,
          faqsRes2,
          blogsRes2,
          galleryRes2,
        ] = await Promise.all([
          ClinicSettings.findOne().lean(),
          Doctor.find()
            .select("name qualification specialization experience description consultingTime phone availability photo createdAt updatedAt")
            .sort({ createdAt: -1 })
            .limit(4)
            .lean(),
          Service.find()
            .select("title description icon createdAt updatedAt")
            .sort({ createdAt: -1 })
            .limit(6)
            .lean(),
          Review.find({ approved: true })
            .select("name rating reviewText createdAt updatedAt")
            .sort({ createdAt: -1 })
            .limit(6)
            .lean(),
          FAQ.find()
            .select("question answer createdAt updatedAt")
            .sort({ createdAt: -1 })
            .limit(8)
            .lean(),
          BlogPost.find()
            .select("title content category tags author image createdAt updatedAt")
            .sort({ createdAt: -1 })
            .limit(3)
            .lean(),
          Gallery.find({ category: { $in: ["gallery", "services", "doctors"] } })
            .select("imageUrl category caption order createdAt updatedAt")
            .sort({ order: 1, createdAt: -1 })
            .limit(8)
            .lean(),
        ]);

        settings = settingsRes2;
        doctors = doctorsRes2;
        services = servicesRes2;
        reviews = reviewsRes2;
        faqs = faqsRes2;
        blogs = blogsRes2;
        gallery = galleryRes2;
      } catch (setupErr) {
        console.error("Auto seeding failed:", setupErr);
      }
    }
  } catch (error) {
    console.error("Database connection failed in Page Server Component:", error);
  }


  // Fallback / Mock Data if DB connection isn't working
  const finalSettings = settings || {
    clinicName: "Cresto Physiotherapy Clinic",
    tagline: "Expert Physiotherapy & Rehabilitation Care in Bengaluru",
    address: "No.70/1, Benaka Plaza, Central Excise House Building Co-operative Society, Doddakammanahalli, Bannerghatta Road, Begur Hobli, Bengaluru",
    phone: "+91 98765 43210",
    email: "info@crestophysio.com",
    whatsapp: "+91 98765 43210",
    workingHours: "Mon - Sat: 9:00 AM - 7:00 PM",
  };

  const finalDoctors = doctors.length > 0 ? doctors : [
    {
      _id: "doc1",
      name: "Dr. Farhan",
      qualification: "MPT, CMT, CDNT, FIMT, CKTT, KSPT",
      specialization: "Senior Physiotherapist & Manual Therapy Expert",
      experience: 10,
      description: "Dr. Farhan is a highly qualified physiotherapist with expertise in manual therapy, dry needling, and advanced rehabilitation techniques.",
      consultingTime: "Mon - Sat: 9:00 AM - 1:00 PM, 4:00 PM - 7:00 PM",
      phone: "+91 98765 43210",
      availability: "Available Today",
    },
    {
      _id: "doc2",
      name: "Dr. Jeba",
      qualification: "BPT, MPT (Neuro)",
      specialization: "Neurological Physiotherapist",
      experience: 7,
      description: "Dr. Jeba specialises in neurological rehabilitation for stroke, Parkinson's, and spinal cord conditions.",
      consultingTime: "Mon - Sat: 9:00 AM - 1:00 PM, 4:00 PM - 7:00 PM",
      phone: "+91 98765 43211",
      availability: "Available Today",
    },
    {
      _id: "doc3",
      name: "Dr. Afreen",
      qualification: "BPT",
      specialization: "Physiotherapist",
      experience: 3,
      description: "Dr. Afreen provides personalised rehabilitation programs for musculoskeletal and post-surgical patients.",
      consultingTime: "Mon - Sat: 9:00 AM - 7:00 PM",
      phone: "+91 98765 43212",
      availability: "Available Today",
    },
    {
      _id: "doc4",
      name: "Dr. Shusmita",
      qualification: "BPT",
      specialization: "Physiotherapist",
      experience: 2,
      description: "Dr. Shusmita focuses on pain management, posture correction, and functional recovery for patients of all ages.",
      consultingTime: "Mon - Sat: 9:00 AM - 7:00 PM",
      phone: "+91 98765 43213",
      availability: "Available Today",
    },
    {
      _id: "doc5",
      name: "Dr. Gouri",
      qualification: "BPT",
      specialization: "Physiotherapist",
      experience: 2,
      description: "Dr. Gouri specialises in therapeutic exercises, electrotherapy, and orthopaedic physiotherapy.",
      consultingTime: "Mon - Sat: 9:00 AM - 7:00 PM",
      phone: "+91 98765 43214",
      availability: "Available Today",
    },
  ];

  const finalServices = services.length > 0 ? services : [
    { _id: "s1", title: "Manual Therapy", description: "Hands-on techniques to reduce pain and restore joint mobility.", icon: "Activity" },
    { _id: "s2", title: "Neurological Rehabilitation", description: "Specialised programs for stroke, Parkinson's, and spinal cord conditions.", icon: "Shield" },
    { _id: "s3", title: "Sports Injury Treatment", description: "Targeted rehabilitation for athletes and sports-related injuries.", icon: "Award" },
    { _id: "s4", title: "Post-Surgical Rehab", description: "Structured recovery plans following orthopaedic surgeries.", icon: "Heart" },
    { _id: "s5", title: "Electrotherapy", description: "Advanced electrotherapy for pain relief and tissue healing.", icon: "Zap" },
    { _id: "s6", title: "Posture & Spine Care", description: "Corrective therapy for back pain, neck pain, and posture issues.", icon: "Compass" },
  ];

  // Map mongoose models object IDs to strings for serialization
  const serialize = (arr: any[]) =>
    arr.map((item) => ({
      ...item,
      _id: item._id ? item._id.toString() : "",
      createdAt: item.createdAt ? item.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: item.updatedAt ? item.updatedAt.toISOString() : new Date().toISOString(),
      doctor: item.doctor ? item.doctor.toString() : undefined,
    }));

  const settingsForSchema = JSON.parse(JSON.stringify(finalSettings));
  const structuredData = graph(
    websiteSchema(),
    organizationSchema(settingsForSchema),
    medicalClinicSchema(settingsForSchema),
    faqSchema(faqs),
    ...physicianSchemas(serialize(finalDoctors))
  );

  return (
    <>
      <JsonLd data={structuredData} />
      <MainHome
        settings={settingsForSchema}
        doctors={serialize(finalDoctors)}
        services={serialize(finalServices)}
        reviews={serialize(reviews)}
        faqs={serialize(faqs)}
        blogs={serialize(blogs)}
        gallery={serialize(gallery)}
      />
    </>
  );
}
