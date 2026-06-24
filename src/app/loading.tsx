import React from "react";
import Image from "next/image";
import { getLayoutSettings } from "@/lib/layoutSettings";

export default async function Loading() {
  const settings: any = await getLayoutSettings();
  const logoUrl = settings?.logo;

  return (
    <div className="min-h-[85vh] w-full flex flex-col items-center justify-center py-20 bg-white">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="w-20 h-20 rounded-full border-4 border-teal/10 border-t-teal animate-spin" />
        {/* Inner reverse spinning ring */}
        <div className="absolute w-14 h-14 rounded-full border-4 border-pink/10 border-t-pink animate-spin [animation-direction:reverse]" />
        {/* Brand logo, centered */}
        {logoUrl ? (
          <div className="absolute w-9 h-9 rounded-full overflow-hidden border border-teal/20">
            <Image
              src={logoUrl}
              alt="Cresto Physiotherapy Clinic Logo"
              fill
              sizes="36px"
              quality={70}
              className="object-cover"
            />
          </div>
        ) : (
          <div className="absolute w-9 h-9 rounded-full bg-teal-tint flex items-center justify-center text-teal font-heading font-bold text-lg border border-teal/20 select-none">
            C
          </div>
        )}
      </div>
      <p className="mt-4 font-heading font-medium text-sm text-brand-ink/70 animate-pulse tracking-wide">
        Loading clinic details...
      </p>
    </div>
  );
}
