/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vga: {
          dark: '#0a0a0f',
          purple: '#6b21a8',
          gold: '#fbbf24',
          accent: '#8b5cf6'
        }
      }
    },
  },
  plugins: [],
}
