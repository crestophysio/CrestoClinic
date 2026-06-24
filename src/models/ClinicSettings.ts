import mongoose, { Schema } from "mongoose";

const ClinicSettingsSchema = new Schema(
  {
    clinicName: { type: String, default: "Cresto Physiotherapy Clinic" },
    tagline: { type: String, default: "Expert Physiotherapy & Rehabilitation Care in Bengaluru" },
    logo: { type: String, default: "" },
    favicon: { type: String, default: "" },
    heroImage: { type: String, default: "" },
    address: { type: String, default: "No.70/1, Benaka Plaza, Central Excise House Building Co-operative Society, Doddakammanahalli, Bannerghatta Road, Begur Hobli, Bengaluru" },
    phone: { type: String, default: "+91 98765 43210" },
    email: { type: String, default: "info@crestophysio.com" },
    whatsapp: { type: String, default: "+91 98765 43210" },
    mapsUrl: { type: String, default: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.0!2d77.5946!3d12.8973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae6b0a0a0a0a0a%3A0x0!2sBannerghatta+Road%2C+Bengaluru!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" },
    workingHours: { type: String, default: "Mon - Sat: 9:00 AM - 7:00 PM" },
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    youtube: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    seoTitle: { type: String, default: "Best Physiotherapy in Bengaluru | Cresto Clinic" },
    seoDescription: { type: String, default: "Expert physiotherapy in Bengaluru. Cresto Physiotherapy Clinic on Bannerghatta Road offers pain relief, rehab & sports therapy. Book your visit today!" },
    seoKeywords: { type: String, default: "physiotherapy Bannerghatta Road, physiotherapist in Bengaluru, best physiotherapy clinic in Bengaluru, physiotherapy near me, back pain physiotherapy Bengaluru, knee pain physiotherapy Bengaluru, neck pain physiotherapy Bengaluru, sciatica treatment Bengaluru, frozen shoulder treatment Bengaluru, sports injury rehabilitation Bengaluru, neurological physiotherapy Bengaluru, stroke rehabilitation Bengaluru, post-surgical rehabilitation Bengaluru, manual therapy Bengaluru, dry needling Bengaluru, electrotherapy Bengaluru, posture correction Bengaluru, home visit physiotherapy Bengaluru, physiotherapy Doddakammanahalli, Cresto Physiotherapy Clinic" },
    ogImage: { type: String, default: "" },

    // About section content. Blank = fall back to the per-language defaults in
    // lib/translations.ts. A non-empty value here overrides ALL languages.
    aboutBadge: { type: String, default: "" },
    aboutTitle: { type: String, default: "" },
    aboutDesc1: { type: String, default: "" },
    aboutDesc2: { type: String, default: "" },
    aboutMission: { type: String, default: "" },
    aboutMissionDesc: { type: String, default: "" },
    aboutVision: { type: String, default: "" },
    aboutVisionDesc: { type: String, default: "" },
    aboutPremium: { type: String, default: "" },
    aboutPremiumDesc: { type: String, default: "" },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === "development" && mongoose.models.ClinicSettings) {
  delete (mongoose.models as any).ClinicSettings;
}

export default mongoose.models.ClinicSettings || mongoose.model("ClinicSettings", ClinicSettingsSchema);
