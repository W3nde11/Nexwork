import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nw: {
          blue: "#061E4C",
          purple: "#6C2AD5",
          green: "#21C45D",
          gray: "#9AA1A6",
          white: "#F8FAFC",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 24px rgba(6, 30, 76, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
