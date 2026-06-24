import type { MetadataRoute } from "next";

// AI / LLM crawlers we explicitly welcome — for model training AND, more
// importantly, answer-engine citations (ChatGPT, Claude, Perplexity, Google AI
// Overviews, Apple Intelligence, etc.). Listed individually so they stay allowed
// even if the wildcard policy is ever tightened. Pairs with /llms.txt, which
// gives these crawlers a clean clinic summary.
const AI_BOTS = [
  "GPTBot",            // OpenAI training
  "ChatGPT-User",      // ChatGPT live browsing
  "OAI-SearchBot",     // OpenAI search
  "ClaudeBot",         // Anthropic training
  "Claude-Web",        // Anthropic live browsing
  "anthropic-ai",      // Anthropic
  "PerplexityBot",     // Perplexity index
  "Perplexity-User",   // Perplexity live fetch
  "Google-Extended",   // Google Gemini / AI Overviews
  "Applebot-Extended", // Apple Intelligence
  "Amazonbot",         // Amazon / Alexa
  "Meta-ExternalAgent",// Meta AI
  "cohere-ai",         // Cohere
  "CCBot",             // Common Crawl (feeds many LLMs)
  "Bytespider",        // ByteDance
  "Diffbot",
  "YouBot",            // You.com
  "Timpibot",
];

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://crestophysio.com").replace(/\/+$/, "");

  return {
    rules: [
      // Search engines + everything else: full crawl access.
      { userAgent: "*", allow: "/" },
      // AI / LLM crawlers: explicitly allowed across the whole site.
      { userAgent: AI_BOTS, allow: "/" },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
