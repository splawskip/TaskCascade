/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
// Build Tailwind config.
module.exports = {
  content: ['./index.html', './src/**/*.js'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ebony: '#25273D',
        snuff: '#E3E4F1',
        bright: '#393A4B',
        trout: '#4D5067',
        mischka: '#D1D2DA',
        'mulled-wine': '#494C6B',
        'periwinkle-gray': '#C8CBE7',
      },
      fontFamily: {
        sans: ['Josefin Sans', ...defaultTheme.fontFamily.sans],
      },
      minHeight: {
        '1/3': 'calc(100vh/3)',
      },
      backgroundImage: {
        'hero-light': "url('/img/hero-light.jpg')",
        'hero-dark': "url('/img/hero-dark.jpg')",
        gradient: 'linear-gradient(135deg, #55DDFF 0%, #C058F3 100%)',
      },
      gridTemplateColumns: {
        'two-columns-min-content': 'repeat(2, min-content)',
      },
      keyframes: {
        pulse: {
          '0%': {
            transform: 'scale(1) rotate(45deg)',
            opacity: '1',
          },
          '50%': {
            transform: 'scale(1.3) rotate(45deg)',
            opacity: '1',
          },
          '100%': {
            transform: 'scale(1) rotate(45deg)',
            opacity: '1',
          },
        },
      },
      animation: {
        pulse: 'pulse 700ms infinite',
      },
    },
  },
  plugins: [],
};
