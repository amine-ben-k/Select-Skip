/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A1B3A',
          600: '#1A3657', // Added for gradient compatibility
        },
        teal: {
          300: '#4FD1C5',
          500: '#38B2AC',
        },
        indigo: {
          600: '#4C51BF',
          700: '#5A4FCF',
        },
        gold: {
          500: '#D4AF37',
        },
        'blue-200': '#A3BFFA',
      },
      fontFamily: {
        Inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 1.5s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
}