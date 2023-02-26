/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
// Build Tailwind config.
module.exports = {
  content: ['./js/*.js', './index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ebony: '#25273D',
        snuff: '#E3E4F1',
        bright: '#393A4B',
      },
      fontFamily: {
        sans: ['Josefin Sans', ...defaultTheme.fontFamily.sans],
      },
      minHeight: {
        '1/3': 'calc(100vh/3)',
      },
      backgroundImage: {
        hero: "url('/img/hero.jpg')",
        'hero-dark': "url('/img/hero-dark.jpg')",
        gradient: 'linear-gradient(135deg, #55DDFF 0%, #C058F3 100%)',
      },
      gridTemplateColumns: {
        'two-columns-min-content': 'repeat(2, min-content)',
      },
    },
  },
  plugins: [],
};
