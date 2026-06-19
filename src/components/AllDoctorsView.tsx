"use client";

import React from "react";
import Image from "next/image";
import { Phone, Clock, Award, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface AllDoctorsViewProps {
  doctors: any[];
}

export default function AllDoctorsView({ doctors }: AllDoctorsViewProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      {/* Back Button & Title */}
      <div className="mb-12">
        <Link
          href="/#doctors"
          className="inline-flex items-center gap-2 text-teal font-bold hover:text-teal-dark transition-all text-sm mb-6 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-border/60 pb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-tint text-teal-dark text-xs font-semibold mb-3">
              <Shield className="w-4 h-4 text-teal" />
              <span>Our Specialist Team</span>
            </div>
            <h1 className="font-heading font-bold text-3xl sm:text-4xl text-brand-ink">
              Meet All Our Physiotherapists
            </h1>
            <p className="text-brand-muted text-sm mt-2">
              Expert rehabilitation specialists dedicated to your recovery and well-being.
            </p>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-tint text-teal-dark text-sm font-bold border border-teal/20">
              {doctors.length} Specialist{doctors.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <h2 className="sr-only">All Doctors</h2>
      {doctors.length === 0 ? (
        <div className="text-center py-20 text-brand-muted text-sm border border-dashed border-brand-border rounded-3xl bg-white max-w-md mx-auto">
          No doctors listed yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {doctors.map((doc: any, idx: number) => (
            <motion.div
              key={doc._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
              className="bg-white rounded-3xl border border-brand-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row items-stretch"
            >
              {/* Photo */}
              <div className="relative w-full md:w-2/5 aspect-[4/5] bg-teal-tint/30 shrink-0">
                {doc.photo ? (
                  <Image
                    src={doc.photo}
                    alt={doc.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    loading="lazy"
                    quality={72}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-teal-tint text-teal font-heading font-bold text-5xl">
                    {doc.name?.charAt(4) || "D"}
                  </div>
                )}
                <span className="absolute top-4 left-4 z-10 text-[10px] font-bold px-2.5 py-1 rounded-full border bg-white flex items-center gap-1 shadow-sm uppercase tracking-wider">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      doc.availability === "Available Today"
                        ? "bg-emerald-500"
                        : doc.availability === "Fully Booked"
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                  />
                  {doc.availability}
                </span>
              </div>

              {/* Details */}
              <div className="p-8 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-brand-ink mb-1">
                    {doc.name}
                  </h3>
                  <p className="text-teal-dark font-medium text-xs sm:text-sm mb-3">
                    {doc.specialization}
                  </p>
                  <p className="text-[10px] text-brand-muted mb-4 font-semibold flex items-center gap-1 uppercase tracking-wider">
                    <Award className="w-4 h-4 text-teal" />
                    {doc.qualification}
                  </p>
                  <p className="text-xs sm:text-sm text-brand-muted leading-relaxed mb-6">
                    {doc.description}
                  </p>
                </div>
                <div className="space-y-3 pt-4 border-t border-brand-border/60">
                  <div className="flex items-center gap-2 text-xs text-brand-ink font-semibold">
                    <Clock className="w-4 h-4 text-teal shrink-0" />
                    <span>{doc.consultingTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-brand-ink font-semibold">
                    <Phone className="w-4 h-4 text-teal shrink-0" />
                    <a
                      href={`tel:${doc.phone}`}
                      className="hover:text-teal transition-colors"
                    >
                      {doc.phone}
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Book appointment CTA */}
      <div className="mt-16 text-center">
        <p className="text-brand-muted text-sm mb-4">Ready to start your recovery journey?</p>
        <Link
          href="/#booking"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-teal text-white font-bold text-sm hover:bg-teal-dark transition-all duration-300 shadow-md active:scale-95"
        >
          Book an Appointment
        </Link>
      </div>
    </div>
  );
}
