// X / Twitter uses the same 1200x630 card as Open Graph. Re-export the image
// generator, but declare the route config as literals here — Next's static
// analyzer can't follow a re-exported `runtime`/config from another module.
export { default } from "./opengraph-image";

export const alt = "Cresto Physiotherapy Clinic — Bengaluru";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
