import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      // ─── Colors ────────────────────────────────────────────────
      colors: {
        bg:      "var(--color-bg)",
        surface: "var(--color-surface)",
        accent:  "var(--color-accent)",
        text:    "var(--color-text)",
        dim:     "var(--color-dim)",
        border:  "var(--color-border)",
      },
      // ─── Font Families ─────────────────────────────────────────
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body:    ["var(--font-body)", "sans-serif"],
        mono:    ["var(--font-mono)", "monospace"],
      },
      // ─── Font Sizes (PRD secção 2.2) ───────────────────────────
      fontSize: {
        "hero-name":    ["clamp(5rem, 10vw, 9rem)",    { lineHeight: "0.92", fontWeight: "800", letterSpacing: "-0.02em" }],
        "hero-tagline": ["clamp(1.25rem, 2.5vw, 1.75rem)", { lineHeight: "1.4",  fontWeight: "400" }],
        "section-h2":   ["clamp(2rem, 4vw, 3.5rem)",   { lineHeight: "1.1",  fontWeight: "700", letterSpacing: "-0.02em" }],
        "project-title":["1.25rem",                    { lineHeight: "1.4",  fontWeight: "500" }],
        "label":        ["0.6875rem",                  { lineHeight: "1.4",  fontWeight: "400", letterSpacing: "0.12em" }],
      },
      // ─── Spacing ────────────────────────────────────────────────
      maxWidth: {
        site: "1200px",
        prose: "560px",
      },
      // ─── Background Image ────────────────────────────────────────
      backgroundImage: {
        none: "none",
      },
    },
  },
  plugins: [],
};

export default config;
