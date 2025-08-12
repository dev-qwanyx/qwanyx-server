/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../qwanyx-ui/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Use RGB values for opacity support
        primary: '59 130 246',
        secondary: '168 85 247',
        accent: '34 197 94',
        success: '34 197 94',
        warning: '250 204 21',
        error: '239 68 68',
        info: '59 130 246',
        background: '249 250 251',
        foreground: '15 23 42',
        card: '255 255 255',
        'card-foreground': '15 23 42',
        border: '226 232 240',
        input: '255 255 255',
        ring: '59 130 246',
        'text-primary': '15 23 42',
        'text-secondary': '71 85 105',
        'text-muted': '148 163 184',
      },
    },
  },
  plugins: [],
}