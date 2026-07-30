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
      },
    },
  },
  plugins: [],
};

export default config;
