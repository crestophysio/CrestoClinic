"use client";

import { useEffect, useState } from "react";

// Renders an email address as a clickable mailto link, but keeps the plain
// address OUT of the server-rendered HTML so scrapers/spam bots can't harvest
// it (SEO audit "Email Privacy" finding). The address is passed base64-encoded
// and only decoded in the browser after mount — SSR output shows the label
// only. Real users still get a working mailto link once JS runs.
export default function ObfuscatedEmail({
  data,
  className,
  label = "Email us",
}: {
  data: string;
  className?: string;
  label?: string;
}) {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    try {
      setEmail(atob(data));
    } catch {
      setEmail(null);
    }
  }, [data]);

  if (!email) {
    return <span className={className}>{label}</span>;
  }

  return (
    <a href={`mailto:${email}`} className={className}>
      {email}
    </a>
  );
}
