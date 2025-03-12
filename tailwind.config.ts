import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: "#e6edff",
          100: "#c1d3ff",
          200: "#9bb8ff",
          300: "#759eff",
          400: "#5084ff",
          500: "#3073f1", // rgb(48, 115, 241)
          DEFAULT: "#3073f1", // rgb(48, 115, 241)
          600: "#2966d1",
          700: "#2259b1",
          800: "#1b4c92",
          900: "#143f72",
        },
        "tree-row": {
          1: "#AAAAAA",
          2: "#274D60",
          3: "#0A7075",
          4: "#032F30",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
