import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rarity: {
          common: "#9CA3AF",
          uncommon: "#22C55E",
          rare: "#3B82F6",
          epic: "#A855F7",
          legendary: "#F59E0B",
        },
      },
      fontFamily: {
        pixel: ["'Press Start 2P'", "monospace"],
        display: ["var(--font-display)", "sans-serif"],
      },
      backgroundImage: {
        "app-gradient":
          "radial-gradient(circle at 50% 0%, #1e2a5e 0%, #0b1024 45%, #05060f 100%)",
        "gold-shine": "linear-gradient(135deg, #fde68a 0%, #f59e0b 45%, #b45309 100%)",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-150%) skewX(-20deg)" },
          "100%": { transform: "translateX(250%) skewX(-20deg)" },
        },
        "pulse-glow-legendary": {
          "0%, 100%": { boxShadow: "0 0 8px 2px rgba(245,158,11,0.5)" },
          "50%": { boxShadow: "0 0 22px 7px rgba(245,158,11,0.9)" },
        },
        "pulse-glow-epic": {
          "0%, 100%": { boxShadow: "0 0 6px 2px rgba(168,85,247,0.4)" },
          "50%": { boxShadow: "0 0 18px 6px rgba(168,85,247,0.75)" },
        },
        "fab-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(245,158,11,0.6)" },
          "100%": { boxShadow: "0 0 0 16px rgba(245,158,11,0)" },
        },
      },
      animation: {
        shimmer: "shimmer 2.8s ease-in-out infinite",
        "glow-legendary": "pulse-glow-legendary 2s ease-in-out infinite",
        "glow-epic": "pulse-glow-epic 2.2s ease-in-out infinite",
        "fab-ring": "fab-ring 1.8s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
