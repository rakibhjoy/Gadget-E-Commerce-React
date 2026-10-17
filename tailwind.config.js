/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        offwhite: {
          DEFAULT: '#fcfbf9',
          card: '#ffffff',
          subtle: '#f5f3ee',
          border: '#e7e5df',
        },
        brand: {
          DEFAULT: '#1c1917', // warm obsidian
          hover: '#292524',
          accent: '#b45309', // warm luxury amber/gold
          emerald: '#059669',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
