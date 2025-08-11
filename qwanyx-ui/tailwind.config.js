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
        // Use CSS variables with fallback values
        primary: 'rgb(59 130 246)',
        secondary: 'rgb(168 85 247)',
        accent: 'rgb(34 197 94)',
        success: 'rgb(34 197 94)',
        warning: 'rgb(250 204 21)',
        error: 'rgb(239 68 68)',
        info: 'rgb(59 130 246)',
        background: 'rgb(249 250 251)',
        foreground: 'rgb(15 23 42)',
        card: 'rgb(255 255 255)',
        'card-foreground': 'rgb(15 23 42)',
        border: 'rgb(226 232 240)',
        input: 'rgb(255 255 255)',
        ring: 'rgb(59 130 246)',
        'text-primary': 'rgb(15 23 42)',
        'text-secondary': 'rgb(71 85 105)',
        'text-muted': 'rgb(148 163 184)',
      },
    },
  },
  plugins: [],
}