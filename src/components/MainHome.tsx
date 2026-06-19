"use client";

import React from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import SectionTicker from "@/components/SectionTicker";

import { Language } from "@/lib/translations";

const About = dynamic(() => import("@/components/About"));
const Doctors = dynamic(() => import("@/components/Doctors"));
const Services = dynamic(() => import("@/components/Services"));
const BookingForm = dynamic(() => import("@/components/BookingForm"));
const Testimonials = dynamic(() => import("@/components/Testimonials"));
const GalleryGrid = dynamic(() => import("@/components/GalleryGrid"));
const FAQList = dynamic(() => import("@/components/FAQList"));
const BlogGrid = dynamic(() => import("@/components/BlogGrid"));
const Contact = dynamic(() => import("@/components/Contact"));
const Chatbot = dynamic(() => import("@/components/Chatbot"), { ssr: false });

interface MainHomeProps {
  settings: any;
  doctors: any[];
  services: any[];
  reviews: any[];
  faqs: any[];
  blogs: any[];
  gallery: any[];
}

export default function MainHome({
  settings,
  doctors,
  services,
  reviews,
  faqs,
  blogs,
  gallery,
}: MainHomeProps) {
  // Site is English-only.
  const lang: Language = "en";

  return (
    <>
      {/* Sections render inside PublicLayoutWrapper's <main> (Navbar/Footer/
          FloatingActions live there), so this component emits only content —
          no extra <main>/wrapper div, which would nest mains and break a11y. */}
      <Hero settings={settings} lang={lang} />
        
        <About settings={settings} lang={lang} />
        
        <SectionTicker 
          words={["Manual Therapy", "Neurological Rehab", "Sports Injury Care", "Posture Correction"]} 
          bgColor="bg-teal-tint/20"
          textColor="text-teal-dark"
        />
        
        <Doctors doctors={doctors} lang={lang} />
        
        <Services services={services} lang={lang} />
        
        <SectionTicker 
          words={["Quick Scheduling", "WhatsApp Bookings", "Instant Confirmation", "Physiotherapy Tracker"]} 
          reverse={true}
          bgColor="bg-brand-blush/20"
          textColor="text-pink-safe"
        />
        
        <BookingForm doctors={doctors} lang={lang} />
        
        <SectionTicker 
          words={["Verified Patient Feedback", "Expert Clinical Experience", "Premium Physiotherapy", "Cresto Patient Stories"]}
          bgColor="bg-teal-tint/20"
          textColor="text-teal-dark"
        />
        
        <Testimonials reviews={reviews} lang={lang} />
        
        <SectionTicker 
          words={["Modern Rehab Equipment", "Welcoming Treatment Rooms", "State-of-the-Art Facilities", "Virtual Tour"]}
          reverse={true}
          bgColor="bg-brand-blush/20"
          textColor="text-pink-safe"
        />
        
        <GalleryGrid gallery={gallery} lang={lang} />
        
        <SectionTicker 
          words={["Physiotherapy Advice", "Rehabilitation Insights", "Clinical FAQs answered", "Cresto Health Blogs"]}
          bgColor="bg-teal-tint/20"
          textColor="text-teal-dark"
        />
        
        <BlogGrid posts={blogs} lang={lang} />
        
        <SectionTicker 
          words={["Common Physio Concerns", "Timings & Consultation", "Recovery Timelines", "Your Questions Answered"]}
          reverse={true}
          bgColor="bg-brand-blush/20"
          textColor="text-pink-safe"
        />
        
        <FAQList faqs={faqs} lang={lang} />
        
        <SectionTicker 
          words={["Visit Cresto Physiotherapy", "Direct Call Channels", "WhatsApp Connect", "We Are Here To Help"]}
          bgColor="bg-teal-tint/20"
          textColor="text-teal-dark"
        />
        
        <Contact settings={settings} lang={lang} />

      {/* Chatbot Assistant */}
      <Chatbot settings={settings} doctors={doctors} />
    </>
  );
}
