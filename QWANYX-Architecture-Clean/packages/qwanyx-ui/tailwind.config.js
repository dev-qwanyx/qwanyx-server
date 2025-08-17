/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./studio/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "rgb(var(--color-border) / <alpha-value>)",
        input: "rgb(var(--color-input) / <alpha-value>)",
        ring: "rgb(var(--color-ring) / <alpha-value>)",
        background: "rgb(var(--color-background) / <alpha-value>)",
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        error: "rgb(var(--color-error) / <alpha-value>)",
        info: "rgb(var(--color-info) / <alpha-value>)",
        card: "rgb(var(--color-card) / <alpha-value>)",
        "card-foreground": "rgb(var(--color-card-foreground) / <alpha-value>)",
        "text-primary": "rgb(var(--color-text-primary) / <alpha-value>)",
        "text-secondary": "rgb(var(--color-text-secondary) / <alpha-value>)",
        "text-muted": "rgb(var(--color-text-muted) / <alpha-value>)",
        // Agile/Project Status Colors
        "status-backlog": "rgb(var(--qwanyx-status-backlog) / <alpha-value>)",
        "status-todo": "rgb(var(--qwanyx-status-todo) / <alpha-value>)",
        "status-doing": "rgb(var(--qwanyx-status-doing) / <alpha-value>)",
        "status-review": "rgb(var(--qwanyx-status-review) / <alpha-value>)",
        "status-done": "rgb(var(--qwanyx-status-done) / <alpha-value>)",
        "status-blocked": "rgb(var(--qwanyx-status-blocked) / <alpha-value>)",
        "status-archived": "rgb(var(--qwanyx-status-archived) / <alpha-value>)",
        "status-validated": "rgb(var(--qwanyx-status-validated) / <alpha-value>)",
      },
    },
  },
  plugins: [],
}