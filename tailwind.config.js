/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: "#1B3A6B",
          dark: "#142d54",
          tint: "#EDF1F8",
          light: "#9EB3D6",
        },
        pink: {
          DEFAULT: "#F0581E",
          safe: "#D44A14",
          hover: "#E04E18",
        },
        brand: {
          blush: "#FEF0EA",
          cream: "#F4F4F2",
          ink: "#1B3A6B",
          muted: "#5B6470",
          border: "#E8ECF4",
        },
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
