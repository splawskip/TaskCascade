/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
// B
module.exports = {
  content: ['./js/*.js', './index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ebony: '#25273D',
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
      },
      gridTemplateColumns: {
        'two-columns-min-content': 'repeat(2, min-content)',
      },
    },
  },
  plugins: [],
};
