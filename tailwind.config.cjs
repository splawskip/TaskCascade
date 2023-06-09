/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
// Build Tailwind config.
module.exports = {
  content: ['./index.html', './src/**/*.js'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ebony: 'hsl(235, 24%, 19%)',
        snuff: 'hsl(236, 33%, 92%)',
        bright: 'hsl(237, 14%, 26%)',
        trout: 'hsl(233, 14%, 35%)',
        mischka: 'hsl(60, 88%, 44%)',
        'mulled-wine': 'hsl(235, 19%, 35%)',
        'periwinkle-gray': 'hsl(234, 39%, 85%)',
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
        gradient:
          'linear-gradient(135deg, hsl(192, 100%, 67%) 0%, hsl(280, 87%, 65%) 100%)',
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
