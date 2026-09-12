import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Core background layers ── */
        canvas: {
          DEFAULT: "#07151D",   // deepest — page background
          light:   "#0A1B24",   // secondary background
        },
        surface: {
          DEFAULT: "#0D222C",   // panels, sidebar
          card:    "#102A35",   // cards, elevated surfaces
          hover:   "#13303D",   // hover states
          input:   "#0D222C",   // input fields
          raised:  "#152E3A",   // raised/active states
        },
        border: {
          subtle:  "rgba(145, 190, 200, 0.10)",
          medium:  "rgba(145, 190, 200, 0.16)",
          strong:  "rgba(145, 190, 200, 0.26)",
          focus:   "#38B8B0",
        },
        /* ── Typography ── */
        primary: {
          DEFAULT:   "#F2F5F6",   // primary text
          secondary: "#B6C4CA",   // secondary body text
          muted:     "#7F929B",   // labels, metadata
        },
        /* ── Accent ── */
        accent: {
          DEFAULT: "#38B8B0",             // teal — air-gap, success, status
          hover:   "#44C9C1",
          pressed: "#2FA09A",
          soft:    "rgba(56,184,176,0.12)",
        },
        orange: {
          DEFAULT: "#F28A5B",             // orange — CTA, active action
          hover:   "#F59A70",
          soft:    "rgba(242,138,91,0.12)",
        },
        /* ── Status ── */
        status: {
          success: "#45C49A",
          warning: "#E5B85C",
          danger:  "#E46A6A",
          info:    "#5B96C2",
        },
        /* ── Landing page tokens (unchanged) ── */
        land: {
          bg:        "#06131C",
          bgSecond:  "#0A1D28",
          surface:   "#0D2430",
          elevated:  "#102B38",
          text:      "#F0F4F6",
          textSec:   "#B8C5CC",
          textMuted: "#718B96",
          teal:      "#38B8B0",
          orange:    "#E8875A",
          success:   "#45C49A",
          warning:   "#E6B85C",
          danger:    "#E46A6A",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
        mono: [
          '"JetBrains Mono"',
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      fontSize: {
        "page-title":    ["1.875rem", { lineHeight: "1.2",  fontWeight: "700"  }], // 30px
        "section-title": ["1.25rem",  { lineHeight: "1.3",  fontWeight: "650"  }], // 20px
        "card-title":    ["0.9375rem",{ lineHeight: "1.35", fontWeight: "600"  }], // 15px
        "body":          ["0.9375rem",{ lineHeight: "1.6"                       }], // 15px
        "body-sm":       ["0.875rem", { lineHeight: "1.55"                      }], // 14px
        "caption":       ["0.8125rem",{ lineHeight: "1.5"                       }], // 13px
        "meta":          ["0.75rem",  { lineHeight: "1.4"                       }], // 12px
        "micro":         ["0.6875rem",{ lineHeight: "1.4"                       }], // 11px
      },
      maxWidth: {
        landing:   "1240px",
        workspace: "960px",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
      boxShadow: {
        // Subtle elevation only — no dramatic glow
        card:      "0 1px 8px rgba(0,0,0,0.22)",
        panel:     "0 2px 16px rgba(0,0,0,0.28)",
        floating:  "0 4px 24px rgba(0,0,0,0.32)",
        composer:  "0 -2px 16px rgba(0,0,0,0.18)",
        // Minimal glow — only for primary CTA, not decorative
        glow:      "0 0 0 1px rgba(56,184,176,0.15)",
      },
      borderRadius: {
        // Standardized radius scale
        "btn":  "8px",
        "input":"9px",
        "card": "12px",
        "lg":   "12px",
        "xl":   "14px",
        "2xl":  "16px",
        "3xl":  "20px",
      },
      transitionDuration: {
        "200": "200ms",
        "250": "250ms",
      },
    },
  },
  plugins: [],
};

export default config;
