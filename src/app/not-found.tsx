import React from "react";
import Link from "next/link";
import { Home, CalendarHeart, Stethoscope, ArrowUpRight } from "lucide-react";

// App Router global 404. Physio-themed: the "missing" page is framed as a
// patient that skipped its appointment, with an animated ECG heartbeat line
// running through the 404 to tie it to the clinic's brand. Server component —
// all motion is CSS keyframes (defined inline below), no client JS needed.

const quickLinks = [
  { name: "Our Services", href: "/#services" },
  { name: "Meet the Doctors", href: "/doctors" },
  { name: "FAQs", href: "/faqs" },
  { name: "Contact Us", href: "/#contact" },
];

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-teal-tint via-white to-brand-blush px-6 py-20">
      {/* Decorative blurred brand blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-teal/10 blur-3xl nf-float" />
      <div
        className="pointer-events-none absolute -bottom-32 -right-20 w-96 h-96 rounded-full bg-pink/10 blur-3xl nf-float"
        style={{ animationDelay: "1.5s" }}
      />

      <div className="relative z-10 w-full max-w-2xl text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur border border-brand-border px-4 py-1.5 shadow-sm mb-8">
          <Stethoscope className="w-4 h-4 text-pink" />
          <span className="font-heading font-semibold text-xs tracking-widest uppercase text-brand-muted">
            Page Not Found
          </span>
        </div>

        {/* 404 mark with ECG heartbeat overlay */}
        <div className="relative mx-auto w-fit">
          <h1 className="font-heading font-black leading-none tracking-tighter text-[7rem] sm:text-[10rem] bg-gradient-to-br from-teal via-teal to-pink bg-clip-text text-transparent select-none">
            404
          </h1>

          {/* Heartbeat line crossing the number */}
          <svg
            className="absolute left-0 right-0 top-1/2 -translate-y-1/2 w-full h-20"
            viewBox="0 0 600 100"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polyline
              className="nf-ecg"
              points="0,50 180,50 210,50 230,20 255,82 280,50 300,50 330,12 360,88 385,50 420,50 600,50"
              stroke="#F0581E"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Headline + copy */}
        <h2 className="mt-4 font-heading font-bold text-2xl sm:text-3xl text-brand-ink">
          This page missed its appointment
        </h2>
        <p className="mt-3 text-sm sm:text-base text-brand-muted max-w-md mx-auto leading-relaxed">
          The page you&apos;re looking for has moved, recovered, or never existed.
          Let&apos;s get you back on the path to where you need to be.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 bg-teal text-white hover:bg-teal-dark px-7 py-3.5 rounded-xl font-bold shadow-md transition-all hover:scale-[1.03] active:scale-95 w-full sm:w-auto"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/#contact"
            className="group inline-flex items-center justify-center gap-2 bg-white border border-brand-border text-brand-ink hover:border-pink hover:text-pink px-7 py-3.5 rounded-xl font-bold shadow-sm transition-all hover:scale-[1.03] active:scale-95 w-full sm:w-auto"
          >
            <CalendarHeart className="w-4 h-4" />
            Book an Appointment
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-12">
          <p className="font-heading font-semibold text-xs tracking-widest uppercase text-brand-muted/70 mb-4">
            Popular Pages
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group inline-flex items-center gap-1 rounded-full bg-white/70 backdrop-blur border border-brand-border px-4 py-2 text-sm font-medium text-brand-ink hover:bg-teal hover:text-white hover:border-teal transition-all"
              >
                {link.name}
                <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Scoped keyframes — server-rendered, no client JS */}
      <style>{`
        @keyframes nf-ecg-draw {
          0%   { stroke-dashoffset: 1400; }
          70%  { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }
        .nf-ecg {
          stroke-dasharray: 1400;
          animation: nf-ecg-draw 2.8s ease-in-out infinite;
        }
        @keyframes nf-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-24px) scale(1.05); }
        }
        .nf-float {
          animation: nf-float 9s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .nf-ecg { animation: none; stroke-dasharray: none; }
          .nf-float { animation: none; }
        }
      `}</style>
    </main>
  );
}
