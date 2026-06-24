# Sugam → Cresto Migration Audit Report

**Project:** CrestoPhysiotherapyClinic (Next.js 15 App Router + MongoDB/Mongoose)
**Audit date:** 2026-06-23
**Scope:** Full end-to-end removal of legacy "Sugam Child & Gastro Care Clinic" (pediatric/gastro) traces; alignment with "Cresto Physiotherapy Clinic".

---

## ✅ Remediation Status (applied 2026-06-23)

**All code/content findings fixed (#2–#38) across 23 files.** Verified: `npm run build` green (exit 0, 32/32 static pages), `vitest` 30/30 pass, and a full-project grep returns **0** sugam/pediatric/old-contact/old-doctor hits anywhere outside this report.

- Critical 6 + High 8: domain redirect, robots, sitemap, Contact phone/map, page SEO metadata (services/blogs/gallery), Hero alt, visible copy, JSON-LD gallery name, email/API fallbacks.
- Medium + Low: `llms.txt` rewritten, README, package.json + package-lock.json, auth admin name, seed URLs, `/cresto-clinic` folders, "Sugam Specialist" byline, all admin placeholders, test fixtures, dead `finalSettings` blocks deleted, `hi.txt` deleted.
- **Child/vaccination booking feature fully removed** (user decision) — Appointment model fields, BookingForm schema, API zod + email block, admin appointments column/CSV/filter, and `bookingFormChild*` translations across all 6 languages.

**Still OUTSTANDING — manual (cannot be done from code):**
1. 🔴 **Rotate the 5 leaked credentials** (MongoDB pwd, ImageKit private key, Gmail app pwd, Upstash token, admin pwd) — see §9. They remain valid until rotated.
2. 🔴 **Purge `example.txt` from git history** + force-push + re-clone.
3. ⚠️ Replace placeholder real-world values before launch: actual phone, Google Maps embed, social URLs, and a real `EMAIL_FROM` on `@crestophysio.com`.
4. ⚠️ Verify `hero-logo*.jpg` are Cresto (not Sugam) imagery; add a `favicon.ico`.
5. ⚪ Optional: `aggregateRating` in `lib/seo.ts` is hard-coded (4.9/150) — drive from real reviews or remove (Google policy). Services/blogs/gallery pages still fetch `ClinicSettings` though no longer used — minor dead query.

---

## 0. Executive Summary

The core engine is already migrated: root `layout.tsx` metadata, `lib/seo.ts` (all JSON-LD builders), `models/ClinicSettings.ts` defaults, `lib/emailTemplate.ts`, `lib/seed.ts` (doctors/services/reviews/FAQs/blogs), and the homepage `app/page.tsx` all carry correct Cresto/physiotherapy data. Public content (Hero/About/Contact/Footer/Services) is DB-driven, so a correct Settings record renders correctly.

**However, real Sugam/pediatric remnants survive in ~35 locations**, including several that are **live and user/SEO-facing**:

- **Wrong domain redirect** in `next.config.js` (301s traffic to `sugamgastrochildclinic.com`).
- **Pediatric/Sugam page SEO** (`<title>`/`<meta>`/OG) on `/services`, `/blogs`, `/gallery`.
- **Old Sugam phone + a Chennai "Apollo Children's Hospitals" Google Map** as hard-coded fallbacks on the Contact section.
- **`public/llms.txt`** is 100% the old clinic (old phone, old email, old address, old doctor names, old domain).
- **Live production secrets committed to git history** (`example.txt`) — must be rotated.

Plus dead-code fallbacks, admin placeholders, internal CDN folder names, a leftover pediatric "child / vaccination reminder" booking feature, and Sugam-branded `README.md` / `package.json`.

**Severity counts:** CRITICAL 6 · HIGH 8 · MEDIUM 11 · LOW 10 (+ 1 security-critical).

---

## 1. Master Findings Table

Severity: **C**ritical (live, wrong public/SEO data or routing) · **H**igh (live-facing or SEO fallback) · **M**edium (admin-facing / dead data / functional remnant) · **L**ow (comment / placeholder / test / internal name).

| # | Sev | File:Line | Old value | Recommended replacement |
|---|-----|-----------|-----------|--------------------------|
| 1 | 🔴 SEC | git history `example.txt` (commit `7504885`) | Live MongoDB pwd, ImageKit private key, Gmail app pwd, Upstash token, admin pwd | **Rotate every credential.** Purge from history (see §9). |
| 2 | 🔴 C | `next.config.js:71-72` | redirect host `www.sugamgastrochildclinic.com` → `https://sugamgastrochildclinic.com` | `www.crestophysio.com` → `https://crestophysio.com` |
| 3 | 🔴 C | `src/components/Contact.tsx:68` | phone fallback `"+91 94432 12345"` (old Sugam no.) | `"+91 98765 43210"` (real Cresto no.) |
| 4 | 🔴 C | `src/components/Contact.tsx:71` | mapsUrl fallback → **Apollo Children's Hospitals, Chennai** | Real Cresto Bannerghatta Road embed |
| 5 | 🔴 C | `src/app/services/page.tsx:14,16,20,22` | title/desc/OG: "Pediatric, Neonatal & Gastroenterology Services in Coimbatore", "Sugam Clinic…" | Physiotherapy services / Bengaluru copy (see §3) |
| 6 | 🔴 C | `src/app/blogs/page.tsx:14,16,20,22` | "Child Health Blog… Sugam Clinic, Coimbatore… IAP vaccination…" | Physiotherapy/rehab blog copy |
| 7 | 🔴 C | `src/app/gallery/page.tsx:14,16,20,22` | "Sugam Child & Gastro Care Clinic, Coimbatore… endoscopy facilities" | Cresto Bengaluru gallery copy |
| 8 | 🟠 H | `public/llms.txt:1-24` | Entire file = old clinic (old phone `+91 73582 93645`, `sugamgastrochildclinic@gmail.com`, Coimbatore address, Dr. B. Rajesh Kannan, Dr. A. Senthil Vadivu, old domain) | Rewrite for Cresto (see §3) |
| 9 | 🟠 H | `src/app/robots.ts:4` | default base `https://sugamgastrochildclinic.com` | `https://crestophysio.com` |
| 10 | 🟠 H | `src/app/sitemap.ts:30` | default base `https://sugamgastrochildclinic.com` | `https://crestophysio.com` |
| 11 | 🟠 H | `src/app/gallery/page.tsx:69` | JSON-LD `ImageGallery` name `"Sugam Clinic Gallery"` | `"Cresto Physiotherapy Clinic Gallery"` |
| 12 | 🟠 H | `src/components/AllServicesView.tsx:48` | visible copy "…solutions for children, newborns, and gastroenterology conditions." | "…physiotherapy, rehabilitation and sports-injury care." |
| 13 | 🟠 H | `src/components/AllGalleryView.tsx:67` | visible heading "Sugam Clinic Media Library" | "Cresto Physiotherapy Clinic Gallery" |
| 14 | 🟠 H | `src/components/Hero.tsx:27` | `alt="Sugam Clinic background"` | `alt="Cresto Physiotherapy Clinic"` |
| 15 | 🟠 H | `src/lib/email.ts:11` | from fallback `noreply@sugamclinic.com` | `noreply@crestophysio.com` |
| 16 | 🟠 H | `src/app/api/contact/route.ts:78` | clinicEmail fallback `info@sugamclinic.com` | `info@crestophysio.com` |
| 17 | 🟠 H | `src/app/api/appointments/route.ts:200` | clinicEmail fallback `info@sugamclinic.com` | `info@crestophysio.com` |
| 18 | 🟡 M | `src/app/services/page.tsx:44-51` | dead `finalSettings` Sugam fallback (clinicName/tagline/address/phone `+91 94432 12345`/`contact@sugamclinic.com`) | Delete the unused block (or set to Cresto) |
| 19 | 🟡 M | `src/app/blogs/page.tsx:44-51` | same dead Sugam `finalSettings` | Delete the unused block |
| 20 | 🟡 M | `src/app/gallery/page.tsx:44-51` | same dead Sugam `finalSettings` | Delete the unused block |
| 21 | 🟡 M | `src/lib/auth.ts:84` | admin session `name: "Sugam Clinic Admin"` | `"Cresto Clinic Admin"` |
| 22 | 🟡 M | `src/lib/seed.ts:211,217,223` | gallery seed URLs `ik.imagekit.io/sugamclinic/…` (also wrong endpoint; real is `senra6374x`) | Real Cresto ImageKit URLs, or empty + upload via admin |
| 23 | 🟡 M | `src/app/admin/blogs/page.tsx:25,57,70` | default author `"Sugam Specialist"` (becomes public byline) | `"Cresto Physiotherapy"` |
| 24 | 🟡 M | `README.md:1-3,53` | "Sugam Child & Gastro Care Clinic", dir `sugamclinicfinal/` | Cresto description (see §3) |
| 25 | 🟡 M | `package.json:2` | `"name": "sugam-child-gastro-clinic"` | `"cresto-physiotherapy-clinic"` |
| 26 | 🟡 M | `src/app/admin/settings/page.tsx:368,379,341` | placeholders "About Sugam Clinic", "Dedicated pediatric & gastro care…", "pediatrician, gastrologist, neonate care" | Physiotherapy placeholders |
| 27 | 🟡 M | `models/Appointment.ts:27-31` + `components/BookingForm.tsx:25-28,57-62` + `lib/translations.ts` (×6 langs) | Pediatric feature: `isChild`/`childName`/`childDob`/`vaccinationReminderEnabled` + "Child / Infant" booking labels | Remove (physio has no vaccination reminders) — see §7 |
| 28 | 🟢 L | `src/app/admin/doctors/page.tsx:247` | placeholder "e.g. Pediatric Gastroenterologist" | "e.g. Neurological Physiotherapist" |
| 29 | 🟢 L | `src/app/admin/blogs/page.tsx:223` | placeholder "e.g. Pediatric Gastro" | "e.g. Back & Spine" |
| 30 | 🟢 L | `src/app/admin/services/page.tsx:130,193` | "child care plans…", placeholder "e.g. Newborn Growth Monitoring" | physio wording / "e.g. Manual Therapy" |
| 31 | 🟢 L | `src/app/admin/patients/page.tsx:316` | placeholder "e.g. Vaccination" | "e.g. Post-surgical rehab" |
| 32 | 🟢 L | `src/app/reset-password/page.tsx:125` | placeholder `admin@sugamclinic.com` | `admin@crestophysio.com` |
| 33 | 🟢 L | `src/app/admin/appointments/page.tsx:600` | comment `{/* Pediatric Module */}` | Remove or rename |
| 34 | 🟢 L | `src/components/ImageUploader.tsx:100` | upload folder `"/sugam-clinic"` | `"/cresto-clinic"` |
| 35 | 🟢 L | `src/app/api/imagekit/route.ts:64` | folder `"/sugam-clinic"` | `"/cresto-clinic"` |
| 36 | 🟢 L | `scripts/migrate-images-to-imagekit.mjs:56` | folder `"/sugam-clinic/migrated"` | `"/cresto-clinic/migrated"` |
| 37 | 🟢 L | `tests/unit/schemas.test.ts:14,43,49` | fixtures `specialization:"Pediatrics"`, `clinicName:"Sugam"` | physio fixtures (cosmetic) |
| 38 | 🟢 L | `hi.txt` (root) | junk file "hi simple" | Delete |

---

## 2. SEO Audit

**Solid (already physio):** root `layout.tsx` metadata (title/desc/keywords/OG/twitter/robots/canonical), `lib/seo.ts` keyword groups + all schema builders, homepage SEO, `ClinicSettings` SEO defaults.

**Broken / Sugam-leftover:**

- **Page-level metadata is the worst offense.** `/services`, `/blogs`, `/gallery` ship pediatric/gastro `<title>`, `<meta description>`, and OG tags (#5–#7). These are crawled and indexed as-is — Google will rank these pages for "pediatric Coimbatore", not physiotherapy Bengaluru.
- **Canonical host conflict.** `layout.tsx` `metadataBase` = `crestophysio.com`, but `robots.ts` (#9), `sitemap.ts` (#10) and `next.config.js` redirect (#2) all default/point to `sugamgastrochildclinic.com`. In production `NEXT_PUBLIC_SITE_URL` masks #9/#10, but the redirect (#2) actively 301s `www` traffic to the dead old domain regardless.
- **`llms.txt`** (#8) feeds AI crawlers a fully pediatric profile with old NAP (Name/Address/Phone) and old doctors — actively poisons AI/LLM search results.
- **Image SEO:** Hero `alt` (#14) says "Sugam Clinic background".
- **Heading hierarchy / internal linking:** structurally fine (single `<h1>` per page via views, nav/footer links DB-driven). No Sugam issues found there.

**Recommendations:** fix #2,#5–#10,#11,#14; ensure `NEXT_PUBLIC_SITE_URL=https://crestophysio.com` in prod; after fixes, resubmit sitemap and request re-index; add a Local Business profile (Google Business) for the Bengaluru address to feed the `MedicalClinic` schema.

---

## 3. Next.js Metadata Audit

| Surface | Status |
|---|---|
| `app/layout.tsx` static `metadata` (title template, description, keywords ×18, metadataBase, alternates.canonical, openGraph, twitter, robots, formatDetection) | ✅ Cresto/physio — correct |
| `app/services/page.tsx` `metadata` | ❌ pediatric/Sugam (#5) |
| `app/blogs/page.tsx` `metadata` | ❌ pediatric/Sugam (#6) |
| `app/gallery/page.tsx` `metadata` | ❌ pediatric/Sugam (#7) |
| `app/doctors`, `app/faqs`, `app/login`, `app/reset-password` | no page metadata override (inherit layout) — OK |
| `generateMetadata()` | none used (blog post page builds JSON-LD only) — OK |

**Replacement copy (drop-in):**

`/services` metadata:
```ts
export const metadata: Metadata = {
  title: "Physiotherapy Services in Bengaluru",
  description:
    "Cresto Physiotherapy Clinic, Bengaluru: manual therapy, neurological rehabilitation, sports injury treatment, post-surgical rehab, electrotherapy, and posture & spine care on Bannerghatta Road.",
  keywords: KEYWORDS.services,
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Physiotherapy Services in Bengaluru | Cresto Physiotherapy Clinic",
    description:
      "Manual therapy, neuro rehab, sports injury, post-surgical recovery, electrotherapy & posture care in Bengaluru, Bannerghatta Road.",
    url: "/services", type: "website",
  },
};
```

`/blogs` metadata:
```ts
title: "Physiotherapy & Rehab Blog — Expert Recovery Tips",
description:
  "Doctor-written physiotherapy advice from Cresto Physiotherapy Clinic, Bengaluru: back pain relief, post-stroke rehabilitation, sports injury prevention, posture correction, and recovery exercises.",
// openGraph.title:
"Physiotherapy & Rehab Blog | Cresto Physiotherapy Clinic"
// openGraph.description:
"Back pain exercises, neuro rehab guidance, sports injury prevention, and recovery tips from our physiotherapists."
```

`/gallery` metadata:
```ts
title: "Clinic Gallery — Bannerghatta Road, Bengaluru",
description:
  "Tour Cresto Physiotherapy Clinic on Bannerghatta Road, Bengaluru — modern treatment rooms, rehabilitation equipment, and our physiotherapy care team.",
// openGraph.title:
"Gallery | Cresto Physiotherapy Clinic, Bengaluru"
// openGraph.description:
"Photos of our Bengaluru clinic, treatment rooms, and advanced rehabilitation equipment."
```

`README.md` header + `public/llms.txt`: rewrite around — Name: *Cresto Physiotherapy Clinic*; Address: *No.70/1, Benaka Plaza, Doddakammanahalli, Bannerghatta Road, Begur Hobli, Bengaluru, Karnataka 560076*; Phone/WhatsApp: *+91 98765 43210*; Email: *info@crestophysio.com*; Doctors: *Dr. Farhan, Dr. Jeba, Dr. Afreen, Dr. Shusmita, Dr. Gouri*; Services: *manual therapy, neuro rehab, sports injury, post-surgical rehab, electrotherapy, posture & spine care*; Domain: *crestophysio.com*. (Also fix README dir reference `sugamclinicfinal/` → `CrestoPhysiotherapyClinic/`.)

---

## 4. Structured Data (JSON-LD) Audit

**Builders in `lib/seo.ts` are clean** — `organizationSchema`, `medicalClinicSchema`, `physicianSchemas`, `websiteSchema`, `faqSchema`, `breadcrumbSchema`, `serviceListSchema`, `blogListSchema`, `blogPostSchema` all use `SITE_NAME="Cresto Physiotherapy Clinic"`, Bengaluru `CLINIC_LOCATION`, physio `medicalSpecialty`/`availableService`. Schemas are largely DB-driven (clinic name, doctors, services, FAQs from Mongo).

**One leftover:** the inline `ImageGallery` node in `gallery/page.tsx:69` hard-codes `name: "Sugam Clinic Gallery"` (#11) — bypasses `lib/seo.ts`. Fix the string.

**Validation notes (not Sugam, but worth fixing):**
- `medicalClinicSchema` emits `aggregateRating` 4.9 / 150 reviews **hard-coded** (`lib/seo.ts:164-169`). Fabricated ratings violate Google's review-snippet policy and can trigger manual actions. Drive from real `Review` data or remove.
- `openingHours` passes the human string `"Mon - Sat: 9:00 AM - 7:00 PM"`; Schema.org expects `"Mo-Sa 09:00-19:00"`. Normalize for valid rich results.

---

## 5. Public Assets Audit

`/public` contains only: `hero-logo-desktop.jpg` (44 KB), `hero-logo.jpg` (61 KB), `llms.txt`.

- **`llms.txt`** — fully Sugam (#8). Rewrite.
- **`hero-logo*.jpg`** — referenced as the OG/Twitter image (`layout.tsx:74,85`) and Hero background. **Verify visually** that these are not Sugam-branded photos / logos; if they show the old clinic or pediatric imagery, replace with Cresto assets. (Could not introspect image contents in this audit.)
- **No `favicon.ico`** in `/public`, yet `layout.tsx:132` references `/favicon.ico` (and DB `favicon` default is `""`). Result: a 404 favicon. Add a Cresto favicon.
- No og-image/banner/placeholder assets present — nothing else to remove.

---

## 6. Content Audit

Public content components (`Hero`, `About`, `Services`, `Testimonials`, `FAQList`, `Contact`, `Footer`, `Navbar`) are **DB-driven** from `ClinicSettings`/collections — with a correct Settings record they render Cresto content. Hard-coded leftovers:

- Hero `alt` (#14), AllServicesView intro copy (#12), AllGalleryView heading (#13).
- Contact phone + map fallbacks (#3, #4) — render when the DB Settings record lacks those fields.
- Admin panel placeholders/labels (#23, #26, #28–#31, #33) and the pediatric child/vaccination booking UI (#27).

Seeded content (services, doctors, reviews, FAQs, blogs in `lib/seed.ts`) is fully physiotherapy — good.

---

## 7. Database & API Audit

- **Models:** all default values in `ClinicSettings.ts` are Cresto/Bengaluru ✅. **`Appointment.ts:27-31`** carries pediatric fields `isChild / childName / childDob / vaccinationReminderEnabled` (#27) — a leftover pediatric feature. A physiotherapy clinic has no vaccination reminders; recommend removing these fields + the matching `BookingForm.tsx` inputs (`:25-28,57-62`) + the `bookingFormChild*` keys in `lib/translations.ts` across all 6 languages, plus the `{/* Pediatric Module */}` admin block (`admin/appointments/page.tsx:600`). (If Cresto deliberately treats children, keep `isChild`/`childName`/`childDob` but still drop `vaccinationReminderEnabled`.)
- **Seed data:** gallery image URLs point to the old `sugamclinic` ImageKit folder **and** the wrong endpoint (#22) — these images will 404 on a fresh seed.
- **API responses / fallbacks:** `api/contact/route.ts:78` and `api/appointments/route.ts:200` fall back to `info@sugamclinic.com` (#16, #17).
- **Validation messages:** none contain Sugam/clinic-specific text (generic) — clean.

---

## 8. Email Template Audit

`lib/emailTemplate.ts` is correct: `CLINIC_NAME="Cresto Physiotherapy Clinic"`, tagline, navy/teal palette consistent with Tailwind. Phone/email read from env with Cresto fallbacks (`info@crestophysio.com`). **Only issue:** `lib/email.ts:11` `from` fallback is `noreply@sugamclinic.com` (#15) — fix. Also note `EMAIL_FROM` in `.env` is a personal Gmail (`senthilragunathan2004@gmail.com`), so production mail currently sends from a developer address, not a Cresto domain (see §11).

---

## 9. Security Audit  🔴 ACTION REQUIRED

**Critical — live secrets in git history.** Commit `7504885` added `example.txt` containing **real production credentials**; later "Delete example.txt" commits removed the file but **the values remain in history** (recoverable via `git show 7504885:example.txt`). Exposed:

- `MONGODB_URI` with password `APGXIlTcGnujDnfG` (Atlas user `4084senthilnathan_db_user`, DB `Cresto_clinic`)
- `IMAGEKIT_PRIVATE_KEY` `private_s80YDNMoK3E/mumxi1zP5s8PbJc=`
- Gmail `EMAIL_SERVER_PASSWORD` app password `srwz hbjj eper mnbe`
- `UPSTASH_REDIS_REST_TOKEN`
- `ADMIN_PASSWORD` `Senthil@123` (weak)

The same secrets are also present in the working-tree `.env` (correctly git-ignored — **not** tracked, good).

**Cleanup actions (do in order):**
1. **Rotate everything now** — treat all five as compromised: new Atlas DB password, regenerate ImageKit keys, new Gmail app password, rotate Upstash token, set a strong `ADMIN_PASSWORD` and a fresh `NEXTAUTH_SECRET` (`openssl rand -hex 32`).
2. **Purge history** — `git filter-repo --invert-paths --path example.txt` (and `.env.example` if it ever held real values), then force-push and have collaborators re-clone. Rotation in step 1 is the real fix; purging is hygiene.
3. Confirm `.gitignore` keeps `.env` / `.env.local` (it does).
4. Replace `EMAIL_FROM` personal Gmail with a Cresto-domain sender.

**No other exposed secrets** found in source. CSP and security headers in `next.config.js` are well-configured. `auth.ts` correctly fail-fasts instead of shipping fallback creds.

---

## 10. Performance Audit

- **Dead code:** `finalSettings` is computed but unused in `services/page.tsx`, `blogs/page.tsx`, `gallery/page.tsx` (#18–#20) — delete (also removes 3 copies of Sugam data).
- **Dead feature:** pediatric child/vaccination booking path (#27) if Cresto doesn't use it.
- **Junk file:** `hi.txt` (#38) — delete.
- **Favicon 404** (§5) — wasted request + missing branding.
- **Images:** `next.config.js` is well-tuned (AVIF/WebP, `optimizePackageImports` for lucide/framer/recharts, cache TTL). `hero-logo*.jpg` are reasonably sized; ensure they're served via `next/image` (verify in `Hero.tsx`). Broken seed gallery URLs (#22) cause 404 image loads on fresh installs.
- No other significant bundle/dead-code issues observed.

---

## 11. Brand Consistency Audit

| Dimension | State | Action |
|---|---|---|
| Clinic name | "Cresto Physiotherapy Clinic" everywhere except #8,#11,#13,#21,#23,#24,#25,#26 | Fix listed items |
| Domain | `layout.tsx`=`crestophysio.com`; `robots`/`sitemap`/`next.config` redirect=`sugamgastrochildclinic.com` | Unify on `crestophysio.com` (#2,#9,#10) |
| Phone | Settings default `+91 98765 43210`; Contact fallback `+91 94432 12345` (old) | Unify; set the **real** number (current is a placeholder) (#3) |
| Email | Mixed: `info@crestophysio.com` vs `info@/noreply@/contact@sugamclinic.com` vs personal Gmail | Standardize on `@crestophysio.com` (#15–#17, §8) |
| Map | Contact fallback = Apollo Chennai; seed default = generic Bannerghatta placeholder | Set real Cresto map embed (#4) |
| Social links | DB-driven, currently placeholder URLs (`facebook.com` etc. in seed) | Set real Cresto profiles |
| Colors | Tailwind + email palette consistent (navy `#1B3A6B` + orange `#F0581E`). Token names misleading (`teal`=navy, `pink`=orange) | Optional: rename tokens for clarity |

> Note: `+91 98765 43210`, the seed map embed, and the seed social URLs are **dummy placeholders** even on the "new" side — replace with real Cresto data before launch.

---

## 12. Final Deliverable

### 12.1 Exact code changes (high-priority drop-ins)

**#2 `next.config.js:67-76`**
```js
async redirects() {
  return [{
    source: '/:path*',
    has: [{ type: 'host', value: 'www.crestophysio.com' }],
    destination: 'https://crestophysio.com/:path*',
    permanent: true,
  }];
},
```

**#3/#4 `src/components/Contact.tsx:68,71`**
```ts
const phone = settings?.phone || "+91 98765 43210";
let mapsUrl = settings?.mapsUrl || "<REAL_CRESTO_BANNERGHATTA_MAPS_EMBED_URL>";
```

**#9 `src/app/robots.ts:4` / #10 `src/app/sitemap.ts:30`**
```ts
const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://crestophysio.com").replace(/\/+$/, "");
```

**#11 `src/app/gallery/page.tsx:69`** → `name: "Cresto Physiotherapy Clinic Gallery",`
**#14 `src/components/Hero.tsx:27`** → `alt="Cresto Physiotherapy Clinic"`
**#15 `src/lib/email.ts:11`** → `const from = process.env.EMAIL_FROM || "noreply@crestophysio.com";`
**#16 `api/contact/route.ts:78` / #17 `api/appointments/route.ts:200`** → fallback `"info@crestophysio.com"`
**#21 `src/lib/auth.ts:84`** → `name: "Cresto Clinic Admin",`
**#23 `admin/blogs/page.tsx:25,57,70`** → `"Cresto Physiotherapy"`
**#25 `package.json:2`** → `"name": "cresto-physiotherapy-clinic",`
**#5–#7** → metadata blocks per §3.
**#18–#20** → delete the unused `const finalSettings = … contact@sugamclinic.com … }` blocks.
**#22 `lib/seed.ts:211/217/223`** → real Cresto ImageKit URLs (or `""`).
**#8 `public/llms.txt`** → full rewrite per §3.
**#34/#35/#36** → folder `"/cresto-clinic"`.

### 12.2 Priority order

1. **🔴 Security:** rotate all leaked credentials + purge `example.txt` from history (§9).
2. **🔴 Critical:** #2, #3, #4, #5, #6, #7.
3. **🟠 High:** #8, #9, #10, #11, #12, #13, #14, #15, #16, #17.
4. **🟡 Medium:** #18–#27.
5. **🟢 Low:** #28–#38.

### 12.3 Files to delete / clean

- `hi.txt` (junk).
- `example.txt` from git history.
- Dead `finalSettings` blocks in services/blogs/gallery pages.
- Pediatric child/vaccination feature (#27) — if not needed.
- Verify & replace `hero-logo*.jpg` if Sugam-branded; add `favicon.ico`.

### 12.4 Final verification checklist

```text
[ ] grep -rIn -iE "sugam|coimbatore|venkittapuram|ambethkar|ambedkar|sindhi|bhuvaneshwari" src public *.js *.json *.md  → 0 hits
[ ] grep -rIn -iE "pediatr|paediatr|gastro|neonat|endoscop|ercp|hepatolog|jaundice|vaccination|newborn|child specialist" src public  → 0 hits (except intentionally kept child fields, if any)
[ ] grep -rIn "94432 12345|73582 93645|sugamgastrochildclinic|sugamclinic" .  → 0 hits
[ ] grep -rIn "Rajesh Kannan|Senthil Vadivu" .  → 0 hits
[ ] No "Apollo Children" map embed anywhere
[ ] next.config.js redirect targets crestophysio.com
[ ] robots.ts + sitemap.ts default to crestophysio.com
[ ] /services /blogs /gallery <title>/<meta>/OG = physiotherapy + Bengaluru
[ ] public/llms.txt fully Cresto (NAP + doctors + services + domain)
[ ] README.md + package.json name = Cresto
[ ] favicon.ico present; hero-logo*.jpg verified Cresto
[ ] git history: example.txt purged; all credentials rotated; ADMIN_PASSWORD strong; NEXTAUTH_SECRET fresh
[ ] EMAIL_FROM = a @crestophysio.com address
[ ] aggregateRating in lib/seo.ts driven by real reviews or removed
[ ] Real phone, map embed, and social URLs set in ClinicSettings (placeholders replaced)
[ ] npm run build && npm run lint && npm test  → green
```
