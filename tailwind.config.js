/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ─── COLOR TOKENS ───────────────────────────────────────────────────
      colors: {
        // Primary — IBM Blue (enterprise, trustworthy)
        primary: {
          DEFAULT: "#0F62FE",
          dark:    "#0043CE",
          light:   "#4589FF",
          muted:   "#EDF5FF",
        },
        // Secondary — Teal/Aqua (aquaculture, water, fresh)
        secondary: {
          DEFAULT: "#0CA5A5",
          dark:    "#087979",
          light:   "#3DC9C9",
          muted:   "#E6F7F7",
        },
        // Accent — Warm amber (highlights, CTAs)
        accent: {
          DEFAULT: "#FF832B",
          muted:   "#FFF1E6",
        },
        // Semantic
        success: {
          DEFAULT: "#24A148",
          muted:   "#DEFBE6",
        },
        warning: {
          DEFAULT: "#F1C21B",
          muted:   "#FFF8CC",
        },
        error: {
          DEFAULT: "#DA1E28",
          muted:   "#FFF1F1",
        },
        info: {
          DEFAULT: "#0043CE",
          muted:   "#EDF5FF",
        },
        // Surface
        surface: {
          0: "#FFFFFF",
          1: "#F4F4F4",
          2: "#E8E8E8",
          3: "#C6C6C6",
        },
        // Text
        "text-primary":   "#161616",
        "text-secondary": "#525252",
        "text-tertiary":  "#8D8D8D",
        "text-disabled":  "#C6C6C6",
        "text-inverse":   "#FFFFFF",
        // Border
        border: {
          DEFAULT: "#E0E0E0",
          strong:  "#C6C6C6",
          subtle:  "#F4F4F4",
        },
      },

      // ─── FONT FAMILY ────────────────────────────────────────────────────
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },

      // ─── FONT SIZE SCALE ────────────────────────────────────────────────
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],       // 10px
        "xs":  ["0.75rem",  { lineHeight: "1.125rem" }],   // 12px
        "sm":  ["0.875rem", { lineHeight: "1.25rem" }],    // 14px
        "base":["1rem",     { lineHeight: "1.5rem" }],     // 16px
        "lg":  ["1.125rem", { lineHeight: "1.75rem" }],    // 18px
        "xl":  ["1.25rem",  { lineHeight: "1.875rem" }],   // 20px
        "2xl": ["1.5rem",   { lineHeight: "2rem" }],       // 24px
        "3xl": ["1.875rem", { lineHeight: "2.375rem" }],   // 30px
        "4xl": ["2.25rem",  { lineHeight: "2.75rem" }],    // 36px
        "5xl": ["3rem",     { lineHeight: "1.15" }],       // 48px
        "6xl": ["3.75rem",  { lineHeight: "1.1" }],        // 60px
      },

      // ─── BORDER RADIUS SCALE (4 values only) ────────────────────────────
      borderRadius: {
        "none": "0px",
        "sm":   "6px",    // small elements
        "md":   "8px",    // inputs, small badges — replaces rounded-lg
        "lg":   "12px",   // buttons, tags — replaces rounded-xl
        "xl":   "16px",   // cards — replaces rounded-2xl
        "2xl":  "24px",   // section containers — replaces rounded-3xl
        "full": "9999px", // pills
      },

      // ─── BOX SHADOW SCALE ────────────────────────────────────────────────
      boxShadow: {
        "xs": "0 1px 2px rgba(0, 0, 0, 0.05)",
        "sm": "0 2px 8px rgba(0, 0, 0, 0.08)",
        "md": "0 4px 16px rgba(0, 0, 0, 0.10)",
        "lg": "0 8px 32px rgba(0, 0, 0, 0.12)",
        "xl": "0 16px 48px rgba(0, 0, 0, 0.14)",
        // Colored shadows for CTAs
        "primary-sm": "0 4px 14px rgba(15, 98, 254, 0.25)",
        "primary-md": "0 6px 20px rgba(15, 98, 254, 0.30)",
        "secondary-sm": "0 4px 14px rgba(12, 165, 165, 0.25)",
        "accent-sm":  "0 4px 14px rgba(255, 131, 43, 0.25)",
        "error-sm":   "0 4px 14px rgba(218, 30, 40, 0.25)",
        "none": "none",
      },

      // ─── TRANSITION ──────────────────────────────────────────────────────
      transitionDuration: {
        "150": "150ms",
        "200": "200ms",
        "300": "300ms",
      },
      transitionTimingFunction: {
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      // ─── ANIMATIONS ──────────────────────────────────────────────────────
      keyframes: {
        shimmer: {
          "0%":   { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "gentle-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%":      { opacity: "0.75" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "shimmer":       "shimmer 1.5s infinite linear",
        "gentle-pulse":  "gentle-pulse 4s ease-in-out infinite",
        "fade-in":       "fade-in 0.3s ease-out",
        "scale-in":      "scale-in 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
