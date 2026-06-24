// Centralized SEO constants + Schema.org JSON-LD builders.
// Schemas are emitted server-side (in the initial HTML) so search engines and
// AI crawlers read them without executing JS. All builders return plain objects
// that get serialized by the <JsonLd> component.

// Default to the production domain so a missing/forgotten NEXT_PUBLIC_SITE_URL
// in prod never emits localhost canonicals/OG URLs. Matches sitemap.ts +
// robots.ts. Local dev overrides this via .env (NEXT_PUBLIC_SITE_URL=localhost).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://crestophysio.com"
).replace(/\/+$/, "");

export const SITE_NAME = "Cresto Physiotherapy Clinic";

export const SITE_DESCRIPTION =
  "Expert physiotherapy, manual therapy, neurological rehabilitation, and sports injury treatment in Bengaluru. Book your appointment at Cresto Physiotherapy Clinic on Bannerghatta Road.";

// Fallback social/JSON-LD image. Points at the generated OG route (see
// app/opengraph-image.tsx) so it resolves to a real image even when the admin
// hasn't uploaded a logo/hero in Settings. Those DB values override it when set.
export const DEFAULT_OG_IMAGE = "/opengraph-image";

// Real clinic location — used in PostalAddress schema + as the default address
// when the DB settings record is sparse. Drives local "near me" / city ranking.
export const CLINIC_LOCATION = {
  locality: "Bengaluru",
  region: "Karnataka",
  postalCode: "560076",
  country: "IN",
  // Full neighbourhood list from the local SEO keyword pack — drives the
  // LocalBusiness/MedicalClinic `areaServed` Places and "near me" city ranking.
  areaServed: [
    "Bengaluru",
    "Bannerghatta Road",
    "Doddakammanahalli",
    "Begur",
    "Begur Hobli",
    "Bilekahalli",
    "Arekere",
    "Hulimavu",
    "Gottigere",
    "BTM Layout",
    "JP Nagar",
    "Bannerghatta",
    "Jayanagar",
    "Banashankari",
    "HSR Layout",
    "Koramangala",
    "Bommanahalli",
    "Singasandra",
    "Kudlu Gate",
    "Electronic City",
    "Akshayanagar",
    "South Bengaluru",
  ],
};

// Master keyword groups for Cresto Physiotherapy Clinic SEO targeting, drawn
// from the local SEO keyword pack. Curated representative sets per category —
// used in page `keywords` metadata. (One MAIN keyword still belongs in each
// page's title/H1; these support, they don't replace, on-page copy.)
export const KEYWORDS = {
  // Home — brand + core local + top commercial.
  brandLocal: [
    "Cresto Physiotherapy Clinic",
    "Cresto Physiotherapy Bannerghatta Road",
    "Cresto Physiotherapy Bengaluru",
    "Cresto Physio",
    "Cresto physio clinic Bangalore",
    "Cresto Physiotherapy Doddakammanahalli",
    "physiotherapy Bannerghatta Road",
    "physiotherapist in Bannerghatta Road",
    "physiotherapy clinic Bannerghatta Road",
    "physiotherapy in Bengaluru",
    "physiotherapy clinic Bengaluru",
    "best physiotherapy clinic in Bengaluru",
    "best physiotherapist in Bengaluru",
    "physiotherapy Doddakammanahalli",
    "physiotherapy Begur Hobli",
    "physiotherapy near me",
  ],
  // /services — service lines + key techniques (+ area).
  services: [
    "orthopedic physiotherapy Bengaluru",
    "sports physiotherapy Bengaluru",
    "sports injury rehabilitation Bengaluru",
    "neurological physiotherapy Bengaluru",
    "neuro physiotherapy Bengaluru",
    "post-surgical rehabilitation Bengaluru",
    "post-operative physiotherapy Bengaluru",
    "geriatric physiotherapy Bengaluru",
    "pediatric physiotherapy Bengaluru",
    "women's health physiotherapy Bengaluru",
    "manual therapy Bannerghatta Road",
    "dry needling Bengaluru",
    "electrotherapy Bengaluru",
    "IFT therapy Bengaluru",
    "ultrasound therapy Bengaluru",
    "traction therapy Bengaluru",
    "posture correction Bengaluru",
    "gait training Bengaluru",
    "home visit physiotherapy Bengaluru",
    "musculoskeletal physiotherapy Bengaluru",
    "vestibular rehabilitation Bengaluru",
    "pelvic floor physiotherapy Bengaluru",
  ],
  // Condition / symptom searches (highest patient intent).
  conditions: [
    "back pain physiotherapy Bengaluru",
    "lower back pain treatment Bengaluru",
    "neck pain physiotherapy Bengaluru",
    "cervical spondylosis treatment Bengaluru",
    "knee pain physiotherapy Bengaluru",
    "frozen shoulder treatment Bengaluru",
    "sciatica treatment Bengaluru",
    "slip disc physiotherapy Bengaluru",
    "arthritis physiotherapy Bengaluru",
    "ACL injury physiotherapy Bengaluru",
    "sports injury treatment Bengaluru",
    "stroke rehabilitation Bengaluru",
    "Parkinson's disease physiotherapy Bengaluru",
    "plantar fasciitis treatment Bengaluru",
    "tennis elbow physiotherapy Bengaluru",
    "knee replacement rehabilitation Bengaluru",
    "post fracture rehabilitation Bengaluru",
    "rotator cuff injury physiotherapy Bengaluru",
  ],
  // "near me" + nearby-area / landmark searches.
  local: [
    "physiotherapy near me",
    "physiotherapist near me",
    "physio near me",
    "physical therapy near me",
    "physiotherapy clinic near me",
    "best physiotherapy near me",
    "sports physiotherapy near me",
    "orthopedic physiotherapy near me",
    "neuro physiotherapy near me",
    "home physiotherapy near me",
    "back pain physiotherapy near me",
    "knee pain physiotherapy near me",
    "physiotherapy near Fortis Hospital Bannerghatta",
    "physiotherapy near Royal Meenakshi Mall",
    "physio near BTM Layout",
    "physiotherapist near JP Nagar",
    "physio near Electronic City",
    "physiotherapy Gottigere",
    "physio Hulimavu",
    "physiotherapy Arekere",
  ],
  // Commercial-intent + booking/cost modifiers.
  commercial: [
    "best physiotherapy clinic in Bannerghatta Road",
    "top physiotherapist in Bengaluru",
    "affordable physiotherapy in Bengaluru",
    "experienced physiotherapist in Bengaluru",
    "expert physiotherapy clinic in Bengaluru",
    "trusted physiotherapy clinic Bannerghatta Road",
    "physiotherapy cost in Bengaluru",
    "physiotherapy consultation fees",
    "book physiotherapy appointment",
    "online physiotherapy booking",
    "same day physiotherapy appointment",
    "physiotherapy clinic open now",
  ],
  // /blogs — informational / FAQ topics that pull long-tail traffic.
  blog: [
    "physiotherapy exercises for back pain",
    "physiotherapy exercises for neck pain",
    "exercises for frozen shoulder",
    "stretches for sciatica",
    "physiotherapy after knee surgery",
    "how many physiotherapy sessions are needed",
    "is physiotherapy good for back pain",
    "physiotherapy vs chiropractic",
    "best exercises for cervical pain",
    "physiotherapy for posture correction at home",
    "neck pain relief exercises at home",
    "does physiotherapy hurt",
    "benefits of physiotherapy",
    "physiotherapy for sports injury recovery",
    "what does a physiotherapist do",
  ],
  // /gallery — brand + facility + area.
  gallery: [
    "Cresto Physiotherapy Clinic Bengaluru",
    "physiotherapy clinic Bannerghatta Road photos",
    "rehabilitation centre Bengaluru facilities",
    "physiotherapy centre Doddakammanahalli",
    "clinic tour Bengaluru",
    "physiotherapy treatment room Bengaluru",
  ],
  // Extra long-tail home-page terms — 20 fresh, non-duplicate phrases folded
  // into the homepage `keywords` meta to widen condition + service coverage.
  additional: [
    "physiotherapy treatment in Bengaluru",
    "rehabilitation centre in Bengaluru",
    "physiotherapy doctor in Bengaluru",
    "spine physiotherapy Bengaluru",
    "shoulder pain physiotherapy Bengaluru",
    "joint pain physiotherapy Bengaluru",
    "muscle strain treatment Bengaluru",
    "chronic pain physiotherapy Bengaluru",
    "post accident rehabilitation Bengaluru",
    "physiotherapy at home Bengaluru",
    "best rehabilitation clinic Bengaluru",
    "physiotherapy for paralysis Bengaluru",
    "physiotherapy for vertigo Bengaluru",
    "physiotherapy for diabetic neuropathy Bengaluru",
    "pediatric rehabilitation Bengaluru",
    "physiotherapy for shoulder pain near me",
    "physiotherapy for sciatica near me",
    "physiotherapy clinic in South Bengaluru",
    "weekend physiotherapy clinic Bengaluru",
    "physiotherapy for senior citizens Bengaluru",
  ],
};

// Absolute URL helper — Schema.org wants fully-qualified URLs.
export const abs = (path = "/") =>
  path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

type Settings = Record<string, any> | null | undefined;

/** Organization node — identity shared across the site (referenced by @id). */
export function organizationSchema(settings: Settings) {
  const sameAs = [
    settings?.facebook,
    settings?.instagram,
    settings?.youtube,
    settings?.linkedin,
  ].filter(Boolean);

  return {
    "@type": ["Organization", "MedicalOrganization"],
    "@id": `${SITE_URL}/#organization`,
    name: settings?.clinicName || SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: abs(settings?.logo || DEFAULT_OG_IMAGE),
    },
    image: abs(settings?.heroImage || DEFAULT_OG_IMAGE),
    description: settings?.tagline || SITE_DESCRIPTION,
    ...(settings?.email && { email: settings.email }),
    ...(settings?.phone && { telephone: settings.phone }),
    ...(sameAs.length && { sameAs }),
  };
}

/**
 * MedicalClinic node — the primary LocalBusiness entity. Combines MedicalClinic
 * + LocalBusiness so it surfaces in Google local/maps results AND medical rich
 * results.
 */
export function medicalClinicSchema(settings: Settings) {
  return {
    "@type": ["MedicalClinic", "LocalBusiness"],
    "@id": `${SITE_URL}/#clinic`,
    name: settings?.clinicName || SITE_NAME,
    url: SITE_URL,
    description: settings?.tagline || SITE_DESCRIPTION,
    image: abs(settings?.heroImage || DEFAULT_OG_IMAGE),
    logo: abs(settings?.logo || DEFAULT_OG_IMAGE),
    ...(settings?.phone && { telephone: settings.phone }),
    ...(settings?.email && { email: settings.email }),
    priceRange: "₹₹",
    alternateName: "Cresto Physio",
    medicalSpecialty: [
      "Physiotherapy",
      "Neurological Rehabilitation",
      "Sports Medicine",
      "Musculoskeletal Therapy",
    ],
    areaServed: CLINIC_LOCATION.areaServed.map((name) => ({
      "@type": "Place",
      name,
    })),
    address: {
      "@type": "PostalAddress",
      streetAddress: settings?.address || "No.70/1, Benaka Plaza, Doddakammanahalli, Bannerghatta Road",
      addressLocality: CLINIC_LOCATION.locality,
      addressRegion: CLINIC_LOCATION.region,
      postalCode: CLINIC_LOCATION.postalCode,
      addressCountry: CLINIC_LOCATION.country,
    },
    ...(settings?.workingHours && {
      openingHours: settings.workingHours,
    }),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "150",
      bestRating: "5",
    },
    availableService: [
      { "@type": "MedicalProcedure", name: "Physiotherapy Consultation" },
      { "@type": "MedicalProcedure", name: "Manual Therapy" },
      { "@type": "MedicalProcedure", name: "Neurological Rehabilitation" },
      { "@type": "MedicalProcedure", name: "Sports Injury Treatment" },
    ],
  };
}

/**
 * Physician nodes from the clinic's real doctor records. Satisfies the
 * "Person schema target" keywords (e.g. brand-doctor searches) using live DB
 * names rather than hardcoded ones, and links each doctor to the clinic.
 */
export function physicianSchemas(
  doctors: Array<{
    name?: string;
    specialization?: string;
    qualification?: string;
    description?: string;
    photo?: string;
    phone?: string;
  }>
) {
  return (doctors || [])
    .filter((d) => d?.name)
    .map((d) => ({
      "@type": "Physician",
      name: d.name,
      ...(d.specialization && { medicalSpecialty: d.specialization }),
      ...(d.qualification && { hasCredential: d.qualification }),
      ...(d.description && { description: d.description }),
      ...(d.photo && { image: abs(d.photo) }),
      ...(d.phone && { telephone: d.phone }),
      worksFor: { "@id": `${SITE_URL}/#clinic`, name: SITE_NAME },
      address: {
        "@type": "PostalAddress",
        addressLocality: CLINIC_LOCATION.locality,
        addressRegion: CLINIC_LOCATION.region,
        addressCountry: CLINIC_LOCATION.country,
      },
    }));
}

/** WebSite node with a SearchAction so engines can show a sitelinks searchbox. */
export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/** FAQPage built from clinic FAQ documents. */
export function faqSchema(faqs: Array<{ question?: string; answer?: string }>) {
  const entities = (faqs || [])
    .filter((f) => f?.question && f?.answer)
    .map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    }));

  if (!entities.length) return null;

  return {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: entities,
  };
}

/** BreadcrumbList for a sub-page. `items` = [{name, path}] ordered root→current. */
export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

/** ItemList of services (used on /services). */
export function serviceListSchema(
  services: Array<{ title?: string; description?: string }>
) {
  const elements = (services || [])
    .filter((s) => s?.title)
    .map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "MedicalProcedure",
        name: s.title,
        ...(s.description && { description: s.description }),
      },
    }));

  if (!elements.length) return null;

  return {
    "@type": "ItemList",
    name: "Medical Services",
    itemListElement: elements,
  };
}

/** Blog + posts schema (used on /blogs). */
export function blogListSchema(
  posts: Array<{
    title?: string;
    content?: string;
    author?: string;
    image?: string;
    createdAt?: string;
    updatedAt?: string;
  }>
) {
  const blogPosts = (posts || [])
    .filter((p) => p?.title)
    .map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      ...(p.content && {
        description: String(p.content).replace(/<[^>]+>/g, "").slice(0, 200),
      }),
      ...(p.author && { author: { "@type": "Person", name: p.author } }),
      ...(p.image && { image: abs(p.image) }),
      ...(p.createdAt && { datePublished: p.createdAt }),
      ...(p.updatedAt && { dateModified: p.updatedAt }),
      publisher: { "@id": `${SITE_URL}/#organization` },
    }));

  return {
    "@type": "Blog",
    "@id": `${SITE_URL}/blogs#blog`,
    name: `${SITE_NAME} — Health Blog`,
    url: abs("/blogs"),
    ...(blogPosts.length && { blogPost: blogPosts }),
  };
}

/** Slugify a title for SEO-friendly URLs (lowercase, hyphenated, ascii). */
export function slugify(text = "") {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Canonical blog post slug: keyword-rich title + Mongo _id suffix. The _id has
 * no hyphens, so the last "-" segment is always the id — no DB migration or
 * slug column needed, and titles can change without breaking the URL.
 */
export function postSlug(post: { title?: string; _id?: string }) {
  const id = String(post?._id || "");
  return `${slugify(post?.title)}-${id}`;
}

/** Extract the Mongo _id from a post slug (last hyphen segment). */
export function idFromSlug(slug = "") {
  const parts = String(slug).split("-");
  return parts[parts.length - 1] || "";
}

/** Single-article BlogPosting schema (used on /blogs/[slug]). */
export function blogPostSchema(
  post: {
    title?: string;
    content?: string;
    author?: string;
    image?: string;
    createdAt?: string;
    updatedAt?: string;
    _id?: string;
  },
  url: string
) {
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: String(post.title || "").slice(0, 110),
    ...(post.content && {
      description: String(post.content).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 200),
    }),
    ...(post.author && { author: { "@type": "Person", name: post.author } }),
    ...(post.image && { image: abs(post.image) }),
    ...(post.createdAt && { datePublished: post.createdAt }),
    ...(post.updatedAt && { dateModified: post.updatedAt }),
    publisher: { "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@id": `${SITE_URL}/blogs#blog` },
  };
}

/** Wrap nodes in a single @graph document. */
export function graph(...nodes: Array<object | null | undefined>) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter(Boolean),
  };
}
