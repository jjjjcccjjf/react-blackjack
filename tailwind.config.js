/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'tall': { 'raw': '(min-height: 768px)' },
        'taller': { 'raw': '(min-height: 902px)' },
        // => @media (min-height: 800px) { ... }
      }
    },
  },
  plugins: [],
}