/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
      colors: {
        // GitHub's color system
        "gh-canvas": {
          DEFAULT: "var(--color-canvas-default)",
          subtle: "var(--color-canvas-subtle)",
          overlay: "var(--color-canvas-overlay)",
          inset: "var(--color-canvas-inset)",
        },
        "gh-border": {
          DEFAULT: "var(--color-border-default)",
          muted: "var(--color-border-muted)",
          subtle: "var(--color-border-subtle)",
        },
        "gh-fg": {
          DEFAULT: "var(--color-fg-default)",
          muted: "var(--color-fg-muted)",
          subtle: "var(--color-fg-subtle)",
          onEmphasis: "var(--color-fg-on-emphasis)",
        },
        "gh-accent": {
          fg: "var(--color-accent-fg)",
          emphasis: "var(--color-accent-emphasis)",
          muted: "var(--color-accent-muted)",
          subtle: "var(--color-accent-subtle)",
        },
        "gh-success": {
          fg: "var(--color-success-fg)",
          emphasis: "var(--color-success-emphasis)",
          muted: "var(--color-success-muted)",
          subtle: "var(--color-success-subtle)",
        },
        "gh-attention": {
          fg: "var(--color-attention-fg)",
          emphasis: "var(--color-attention-emphasis)",
          muted: "var(--color-attention-muted)",
          subtle: "var(--color-attention-subtle)",
        },
        "gh-danger": {
          fg: "var(--color-danger-fg)",
          emphasis: "var(--color-danger-emphasis)",
          muted: "var(--color-danger-muted)",
          subtle: "var(--color-danger-subtle)",
        },
        "gh-neutral": {
          emphasis: "var(--color-neutral-emphasis)",
          emphasisPlus: "var(--color-neutral-emphasis-plus)",
          muted: "var(--color-neutral-muted)",
          subtle: "var(--color-neutral-subtle)",
        },
      },
    },
  },
  plugins: [],
};
