/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './app.js',
    '../P+/assets/web/index.html',
    '../P+/assets/web/app.js'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "primary": "#000000",
        "on-primary": "#ffffff",
        "primary-container": "#1b1b1b",
        "on-primary-container": "#848484",
        "primary-fixed": "#e2e2e2",
        "primary-fixed-dim": "#c6c6c6",
        "on-primary-fixed": "#1b1b1b",
        "on-primary-fixed-variant": "#474747",
        "inverse-primary": "#c6c6c6",

        "secondary": "#545f72",
        "on-secondary": "#ffffff",
        "secondary-container": "#d5e0f7",
        "on-secondary-container": "#586376",
        "secondary-fixed": "#d8e3f9",
        "secondary-fixed-dim": "#bcc7dd",
        "on-secondary-fixed": "#111c2c",
        "on-secondary-fixed-variant": "#3c4759",

        "tertiary": "#000000",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#00210e",
        "on-tertiary-container": "#009854",
        "tertiary-fixed": "#82faab",
        "tertiary-fixed-dim": "#64dd91",
        "on-tertiary-fixed": "#00210e",
        "on-tertiary-fixed-variant": "#00522b",

        "error": "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",

        "background": "#f8f9ff",
        "on-background": "#121c2a",
        "surface": "#f8f9ff",
        "on-surface": "#121c2a",
        "surface-dim": "#d0daee",
        "surface-bright": "#f8f9ff",
        "surface-variant": "#d9e3f7",
        "on-surface-variant": "#4c4546",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#eff3ff",
        "surface-container": "#e6eeff",
        "surface-container-high": "#dfe9fc",
        "surface-container-highest": "#d9e3f7",
        "inverse-surface": "#273140",
        "inverse-on-surface": "#ebf1ff",
        "outline": "#7e7576",
        "outline-variant": "#cfc4c5",
        "surface-tint": "#5e5e5e"
      },
      borderRadius: {
        "DEFAULT": "1rem",
        "sm": "0.5rem",
        "md": "1.5rem",
        "lg": "2rem",
        "xl": "3rem",
        "full": "9999px"
      },
      spacing: {
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2.25rem",
        "gutter": "1rem",
        "gutter-tablet": "1.25rem",
        "margin": "1.25rem",
        "margin-desktop": "2.5rem"
      },
      fontFamily: {
        "sans": ["Inter", "sans-serif"],
        "display-hero": ["Inter"],
        "headline-lg": ["Inter"],
        "headline-lg-mobile": ["Inter"],
        "headline-md": ["Inter"],
        "title-sm": ["Inter"],
        "body-lg": ["Inter"],
        "body-md": ["Inter"],
        "label-md": ["Inter"],
        "label-telemetry": ["Inter"]
      },
      fontSize: {
        "display-hero": ["44px", { lineHeight: "52px", letterSpacing: "-0.03em", fontWeight: "600" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.025em", fontWeight: "600" }],
        "headline-lg-mobile": ["26px", { lineHeight: "34px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "headline-md": ["22px", { lineHeight: "28px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "title-sm": ["17px", { lineHeight: "24px", letterSpacing: "-0.015em", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "24px", letterSpacing: "-0.01em", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "20px", letterSpacing: "-0.005em", fontWeight: "400" }],
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "500" }],
        "label-telemetry": ["11px", { lineHeight: "14px", letterSpacing: "0.06em", fontWeight: "600" }]
      }
    }
  },
  plugins: []
};
