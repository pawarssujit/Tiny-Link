import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#7C3AED",
          foreground: "#FFFFFF",
        },
      },
      boxShadow: {
        card: "0 20px 45px -20px rgba(15, 23, 42, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;

