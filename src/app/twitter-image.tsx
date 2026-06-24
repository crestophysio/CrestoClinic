// X / Twitter uses the same 1200x630 card as Open Graph. Re-export the OG
// generator so there's a single source of truth for the social image.
export { runtime, alt, size, contentType, default } from "./opengraph-image";
