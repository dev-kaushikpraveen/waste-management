/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saahas: {
          dark: '#004728',     // Deep Saahas Forest Green
          green: '#005A36',    // Primary Brand Green
          light: '#007A4A',    // Lighter Forest Green
          lime: '#7CB342',     // Fresh Eco Lime Accent (#8DC63F variant)
          mint: '#E8F5E9',     // Soft Mint Background
          surface: '#F4F7F5',  // Warm light eco background
          card: '#FFFFFF',     // Clean white card
          border: '#DDE7E1',   // Soft organic border
        },
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 90, 54, 0.08)',
        'medium': '0 10px 30px -4px rgba(0, 90, 54, 0.12)',
        'elevated': '0 20px 40px -6px rgba(0, 0, 0, 0.07)',
      }
    },
  },
  plugins: [],
}
