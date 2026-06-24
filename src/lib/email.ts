import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { randomUUID } from "node:crypto";

const host = process.env.EMAIL_SERVER_HOST;
const port = parseInt(process.env.EMAIL_SERVER_PORT || "587");
const user = process.env.EMAIL_SERVER_USER;
// Gmail App Passwords are shown as "xxxx xxxx xxxx xxxx" but the real value has
// no spaces. Pasting the spaced form into .env makes SMTP auth fail silently —
// strip whitespace defensively (SMTP credentials never contain spaces).
const pass = (process.env.EMAIL_SERVER_PASSWORD || "").replace(/\s+/g, "");

// Sender address. MUST match the authenticated mailbox (`user`) so the message
// stays SPF/DKIM-aligned — otherwise mailbox providers mark it as spam/spoofed.
// When using Gmail SMTP, EMAIL_FROM MUST be the same gmail.com address as
// EMAIL_SERVER_USER. Using a custom domain here without SPF+DKIM = spam.
const fromAddress = process.env.EMAIL_FROM || user || "";
// Friendly display name so the inbox shows the clinic name, not a raw email —
// bare addresses score worse with spam filters and look less trustworthy.
const fromName = process.env.EMAIL_FROM_NAME || "Cresto Physiotherapy Clinic";

if (!fromAddress) {
  console.warn("EMAIL_FROM / EMAIL_SERVER_USER not set. Email sending will be skipped.");
}

if (process.env.EMAIL_FROM && user && fromAddress.split("@")[1] !== user.split("@")[1]) {
  console.warn(
    `EMAIL_FROM domain (${fromAddress}) differs from the authenticated mailbox (${user}). ` +
      "Without SPF + DKIM on that domain, mail will likely be flagged as spam. " +
      "When using Gmail SMTP, set EMAIL_FROM to the same gmail.com address as EMAIL_SERVER_USER."
  );
}

// When using Gmail SMTP, Gmail re-writes the From address to the authenticated
// account anyway — so EMAIL_FROM MUST match EMAIL_SERVER_USER or you'll see
// "sent on behalf of" warnings and spam classification.
if (host?.includes("gmail") && user && fromAddress && fromAddress !== user) {
  console.warn(
    `Gmail SMTP detected: EMAIL_FROM (${fromAddress}) should match EMAIL_SERVER_USER (${user}). ` +
      "Gmail will override the From header, causing 'sent on behalf of' display and spam risk."
  );
}

// ---- Resend (preferred when configured) -----------------------------------
// When RESEND_API_KEY is set, all mail is sent through Resend's API instead of
// Gmail SMTP. Resend signs with DKIM aligned to YOUR verified domain, which is
// the real fix for spam placement. The `from` MUST be on a domain verified in
// the Resend dashboard (e.g. crestophysio.com) — a gmail.com from will be
// rejected. No npm dependency: we call the HTTP API directly via fetch.
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM =
  process.env.RESEND_FROM || `${fromName} <noreply@crestophysio.com>`;

async function sendViaResend({
  to,
  subject,
  html,
  text,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}) {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [to],
        subject,
        html,
        text,
        ...(replyTo && { reply_to: replyTo }),
        headers: {
          "Auto-Submitted": "auto-generated",
          "X-Auto-Response-Suppress": "OOF, AutoReply",
        },
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Resend send failed:", res.status, data);
      return { success: false, error: data };
    }
    console.log("Email sent via Resend:", data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Resend error:", error);
    return { success: false, error };
  }
}

// Strip CR/LF (and clamp length) from any user-controlled value placed into an
// email header such as the Subject — prevents SMTP header injection.
export function sanitizeHeader(value: string, maxLen = 200): string {
  return (value || "").replace(/[\r\n]+/g, " ").trim().slice(0, maxLen);
}

// Derive a readable plain-text body from the HTML. A multipart/alternative
// message (text + HTML) is a major deliverability win — HTML-only mail is one
// of the strongest spam signals, especially Gmail-to-Gmail.
export function htmlToText(html: string): string {
  return (html || "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<head[\s\S]*?<\/head>/gi, "")
    .replace(/<(?:br)\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|div|tr|h[1-6]|table|li)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&bull;/gi, "•")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Reuse a single pooled transporter instead of opening a fresh SMTP connection
// on every send (the booking flow fires two emails at once).
let cachedTransporter: Transporter | null = null;
function getTransporter(): Transporter {
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      // Enforce an encrypted (STARTTLS) connection on port 587 — refuse to send
      // in clear text. Encrypted transport is expected by modern receivers.
      requireTLS: port !== 465,
      pool: true,
      auth: { user, pass },
    });
  }
  return cachedTransporter;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}) {
  console.log(`Sending email to ${to} with subject "${subject}"`);

  const textBody = text || htmlToText(html);

  // Prefer Resend when configured — domain-aligned DKIM = best inbox placement.
  if (RESEND_API_KEY) {
    return sendViaResend({ to, subject, html, text: textBody, replyTo });
  }

  if (!host || !user || !pass) {
    console.warn("SMTP settings missing in environment. Email logged to console.");
    return { success: true, logged: true };
  }

  const transporter = getTransporter();

  try {
    const info = await transporter.sendMail({
      from: { name: fromName, address: fromAddress },
      to,
      // Replies should reach a monitored inbox, not bounce into the void.
      replyTo: replyTo || fromAddress,
      subject,
      html,
      // Plain-text alternative — auto-derived from the HTML when not supplied.
      // A multipart/alternative (text + HTML) message is a key spam-score win.
      text: textBody,
      // Well-formed Message-ID on the sending domain (matches From → aligned).
      messageId: `<${randomUUID()}@${(fromAddress || "crestophysio.com").split("@")[1]}>`,
      headers: {
        // RFC 3834: mark as machine-generated so recipient mail systems don't
        // fire vacation/auto-replies back at the clinic mailbox.
        "Auto-Submitted": "auto-generated",
        // Outlook/Exchange equivalent — suppress out-of-office & auto-replies.
        "X-Auto-Response-Suppress": "OOF, AutoReply",
        // Transactional, NOT bulk — keep priority normal so it isn't down-ranked.
        "X-Priority": "3",
        // Mark as transactional (not promotional/bulk) — this is the key Gmail
        // classification header. "transactional" = booking confirmations, receipts.
        // Without this, Gmail may route automated mail to Promotions tab.
        "X-Entity-Ref-ID": randomUUID(),
      },
    });
    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}
