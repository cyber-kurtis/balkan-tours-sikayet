/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkBg: '#09090b',      // Zinc 950
        darkCard: '#18181b',    // Zinc 900
        darkBorder: '#27272a',  // Zinc 800
        darkMuted: '#71717a',   // Zinc 500
        accent: '#3f3f46',      // Zinc 700
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
