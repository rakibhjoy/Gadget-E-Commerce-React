/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Joy Mart storefront palette
        primary: {
          bg: '#FFFFFF',
          text: 'var(--ink)',
        },
        secondary: {
          bg: 'var(--surface)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          soft: 'var(--accent-soft)',
          light: 'var(--accent-soft)',
        },
        border: {
          DEFAULT: 'var(--line)',
          light: 'var(--line)',
        },
        muted: 'var(--muted)',
        success: 'var(--stock)',
        sale: 'var(--danger)',
        footer: {
          bg: 'var(--ink)',
          text: '#FFFFFF',
        },
        // Legacy aliases for easy migration
        offwhite: {
          DEFAULT: 'var(--surface)',
          card: '#FFFFFF',
          subtle: 'var(--surface)',
          border: 'var(--line)',
        },
        brand: {
          DEFAULT: 'var(--ink)',
          hover: '#1E293B',
          accent: 'var(--accent)',
          emerald: 'var(--stock)',
        },
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      backdropBlur: {
        glass: '16px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(15, 23, 42, 0.08)',
        'glass-lg': '0 16px 48px 0 rgba(15, 23, 42, 0.12)',
        'glass-card': '0 4px 24px 0 rgba(15, 23, 42, 0.06)',
        'accent-glow': '0 0 40px rgba(15, 23, 42, 0.15)',
      },
    },
  },
  plugins: [],
}
