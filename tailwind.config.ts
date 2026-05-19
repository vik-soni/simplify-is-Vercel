import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // App design system (dashboard/assessment)
        "bg-deep": "var(--bg-deep)",
        "bg-surface": "var(--bg-surface)",
        "bg-elevated": "var(--bg-elevated)",
        "accent-primary": "var(--accent-primary)",
        "accent-secondary": "var(--accent-secondary)",
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        "text-primary": "var(--text-primary)",
        "text-muted": "var(--text-muted)",
        border: "var(--border)",
        // Marketing design system (Earthy Sentinel)
        surface: "var(--surface)",
        "surface-dim": "var(--surface-dim)",
        "surface-bright": "var(--surface-bright)",
        "surface-container": "var(--surface-container)",
        "surface-container-low": "var(--surface-container-low)",
        "surface-container-high": "var(--surface-container-high)",
        "surface-container-highest": "var(--surface-container-highest)",
        "surface-container-lowest": "var(--surface-container-lowest)",
        "on-surface": "var(--on-surface)",
        "on-surface-variant": "var(--on-surface-variant)",
        "on-surface-muted": "var(--on-surface-muted)",
        outline: "var(--outline)",
        "outline-variant": "var(--outline-variant)",
        primary: "var(--color-primary)",
        "primary-deep": "var(--color-primary-deep)",
        "primary-container": "var(--color-primary-container)",
        secondary: "var(--color-secondary)",
        "on-primary": "var(--on-primary)",
        "on-primary-fixed": "var(--on-primary-fixed)",
        "on-primary-fixed-variant": "var(--on-primary-fixed-variant)",
        "on-primary-container": "var(--on-primary-container)",
      },
      boxShadow: {
        "glow-cyan": "var(--glow-cyan)",
        "glow-violet": "var(--glow-violet)",
        "glow-brand": "var(--glow-brand)",
        "glow-brand-lg": "var(--glow-brand-lg)",
      },
      fontFamily: {
        // Canonical (Earthen Brutalism) aliases
        headline: ["var(--font-raleway)", "Raleway", "sans-serif"],
        body: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
        label: ["var(--font-josefin)", "Josefin Sans", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "Geist Mono", "monospace"],
        // Named aliases used throughout the repo
        raleway: ["var(--font-raleway)", "Raleway", "sans-serif"],
        montserrat: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
        josefin: ["var(--font-josefin)", "Josefin Sans", "sans-serif"],
        geist: ["var(--font-jetbrains-mono)", "Geist Mono", "monospace"],
        // Legacy DM Sans/Serif left intact for any residual marketing copy
        heading: ["var(--font-dm-serif)", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
