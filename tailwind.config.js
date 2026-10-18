/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Clean Tech + Warm Orange Palette
        primary: {
          bg: '#FFFFFF',
          text: '#252525',
        },
        secondary: {
          bg: '#F3F1ED',
        },
        accent: {
          DEFAULT: '#E98545',  // Warm Orange
          hover: '#D6742F',
          soft: '#FBE9DC',
          light: '#FDF4EE',
        },
        border: {
          DEFAULT: '#E7E5E1',
          light: '#F0EEEA',
        },
        muted: '#777777',
        success: '#27845A',
        sale: '#D9534F',
        footer: {
          bg: '#252525',
          text: '#FFFFFF',
        },
        // Legacy aliases for easy migration
        offwhite: {
          DEFAULT: '#FFFFFF',
          card: '#FFFFFF',
          subtle: '#F3F1ED',
          border: '#E7E5E1',
        },
        brand: {
          DEFAULT: '#252525',
          hover: '#3a3a3a',
          accent: '#E98545',
          emerald: '#27845A',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        glass: '16px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(233, 133, 69, 0.08)',
        'glass-lg': '0 16px 48px 0 rgba(233, 133, 69, 0.12)',
        'glass-card': '0 4px 24px 0 rgba(37, 37, 37, 0.06)',
        'warm-glow': '0 0 40px rgba(233, 133, 69, 0.15)',
      },
    },
  },
  plugins: [],
}
