/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#D9480F',
          dark: '#A8380B',
          light: '#F2653D',
          50: '#FEF1EC'
        },
        ink: {
          DEFAULT: '#0F1B2D',
          soft: '#33415C'
        },
        gold: '#F5A623',
        whatsapp: {
          DEFAULT: '#22C55E',
          dark: '#16A34A'
        },
        paper: '#F7F5F2'
      },
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif']
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 27, 45, 0.06), 0 4px 12px rgba(15, 27, 45, 0.05)',
        cardHover: '0 8px 24px rgba(15, 27, 45, 0.12)'
      }
    }
  },
  plugins: []
};
